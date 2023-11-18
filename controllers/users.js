require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ValidationError = require("../errors/ValidationError");
const ConflictError = require("../errors/ConflictError");

module.exports.getUser = (req, res, next) => {
  User.find({})

    .then((users) => res.send(users))

    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)

    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("Переданы некорректные данные."));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(ValidationError("Переданы некорректные данные"));
      } else if (err.message === "NotFound") {
        next(new NotFoundError("Пользователь не найден"));
      } else next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(201).send({
        name: user.name,
        _id: user._id,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError("Пользователь с таким email уже существует")
        );
      }
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError("Пользователь с таким email уже существует")
        );
      }
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Неправильные почта или пароль")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Неправильные почта или пароль")
          );
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          { expiresIn: "7d" }
        );
        return res.send({ token });
      });
    })
    .catch(next);
};
