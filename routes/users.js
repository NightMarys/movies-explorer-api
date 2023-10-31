const router = require('express').Router();

const { validateUser } = require('../utils/validate');
const {
  updateProfile, getCurrentUser, getUser, getUserById,
} = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', getUserById);

router.patch('/users/me', validateUser, updateProfile);

module.exports = router;
