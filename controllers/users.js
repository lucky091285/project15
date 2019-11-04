const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  console.log(req.body)
  const { name, about, avatar, email, password } = req.body;
if(req.body.length!=0) {
  bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name, about, avatar, email, password: hash
  }))
      .then(user => res.send({ data: user }),)
      .catch(err => res.status(500).send({ message: `Произошла ошибка при создании пользователя -- ${err}` }));
} else {
  return `Заполните пожалуйста все поля`
}
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' }); // _id: '5d999a39eae33d0fc001dc0f', user._id , 'some-secret-key'
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'авторизация прошла успешно' })
        .end();
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getAllUsers = (req, res)=> {
  User.find({})
        .then(users => res.send({ data: users }))
        .catch(err => res.status(500).send({ message: `Произошла ошибка при добавлении пользователей -- ${err}` }));
};

module.exports.getSingleUser = (req, res) => {
  User.findById(req.params.id)
        .then(user => res.send({ data: user }))
        .catch(err => res.status(500).send({ message: `Нет пользователя с таким id -- ${err}` }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

    User.findByIdAndUpdate(req.user._id, { name, about },
      {
        new: true,
        runValidators: true,
      })
        .then(user => res.send({ data: user }))
        .catch(err => res.status(500).send({ message: `Профиль не обновился -- ${err}` }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

    User.findByIdAndUpdate(req.user._id, { avatar },
      {
        new: true,
        runValidators: true,
      })
        .then(user => res.send({ data: user }))
        .catch(err => res.status(500).send({ message: `Аватар не обновился -- ${err}` }));
};