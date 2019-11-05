const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createCard, getAllCards, deleteCard } = require('../controllers/cards');

cardsRouter.get('/', getAllCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
  }),
}), createCard);

cardsRouter.delete('/:id', deleteCard);

module.exports = cardsRouter;