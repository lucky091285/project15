const cardsRouter = require('express').Router();
// const cards = require('../data/cards.json');
const { createCard, getAllCards, deleteCard } = require('../controllers/cards');

cardsRouter.get('/', getAllCards);

cardsRouter.post('/', createCard);

cardsRouter.delete('/:id', deleteCard);

module.exports = cardsRouter;