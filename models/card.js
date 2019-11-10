const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const urlValidate = validate({
  validator: 'matches',
  // eslint-disable-next-line no-useless-escape
  arguments: /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/,
});

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: urlValidate,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
