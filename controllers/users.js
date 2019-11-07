const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');
const AuthError = require('../errors/auth-err');
const ReqError = require('../errors/req-err');
const { DEV_SECRET_KEY } = require('./../config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  console.log(req.body)
  const { name, about, avatar, email } = req.body;
  if (req.body.length != 0) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name, about, avatar, email, password: hash
      }))
      .then((user) => {
        if (!user) {
          throw new ServerError('Ошибка запроса');
        }
        res.send({ data: user });
      })
      .catch(next);
  } else {
    return `Заполните пожалуйста все поля`
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthError('Ошибка авторизации');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET_KEY, { expiresIn: '7d' }); // _id: '5d999a39eae33d0fc001dc0f', user._id , 'some-secret-key'
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'авторизация прошла успешно' })
        .end();
    })
    .catch(next)
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new ServerError('Произошла ошибка при добавлении пользователей');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getSingleUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) {
        throw new ReqError('Произошла ошибка при обновление профиля');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) {
        throw new ReqError('Произошла ошибка при обновление аватара');
      }
      res.send({ data: user });
    })
    .catch(next);
};