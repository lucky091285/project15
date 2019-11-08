const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validate = require('mongoose-validator');

const urlValidate = validate({
  validator: 'matches',
  // eslint-disable-next-line no-useless-escape
  arguments: '/^((http|https):\/\/)((((\d{1,3}\.){3}(\d{1,3})(:[0-9]{2,5}(\/[A-Za-z\/]+)?)?)$)|((w{3}\.)?[A-Za-z0-9\/]+[.]+(([A-Za-z0-9\/]+)|([A-Za-z]+(\:[0-9]{2,5})?))(#)?$))',
});
const mailValidate = validate({
  validator: 'matches',
  // eslint-disable-next-line no-useless-escape
  arguments: '/[A-Za-z]+@[A-Za-z]+\.[A-Za-z]{2,}',
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: urlValidate,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: mailValidate,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
