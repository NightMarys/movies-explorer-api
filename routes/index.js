const router = require('express').Router();

const { errors } = require('celebrate');
const { validateUserAuth, validateUserCreate } = require('../utils/validate');
const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateUserCreate, createUser);

router.post('/signin', validateUserAuth, login);

router.use(auth);

router.use('/', movieRouter);
router.use('/', userRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

router.use(errors());
router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  return next(err);
});

module.exports = router;
