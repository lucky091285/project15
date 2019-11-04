const usersRouter = require('express').Router();
const { createUser, getAllUsers, getSingleUser, updateProfile, updateAvatar, login } = require('../controllers/users');

// usersRouter.post('/', login);

// usersRouter.post('/', createUser);

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getSingleUser);

usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;