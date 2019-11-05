const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllUsers, getSingleUser, updateProfile, updateAvatar } = require('../controllers/users');

// usersRouter.post('/', login);

// usersRouter.post('/', createUser);

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getSingleUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
  }),
}), updateAvatar);

module.exports = usersRouter;