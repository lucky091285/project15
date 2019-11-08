const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = (req.user._id);

  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new ServerError('Ошибка запроса');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new ServerError('Произошла ошибка при загрузке карточек');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) return Promise.reject(new Error('Такой карты нет'));
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) return Promise.reject(new Error('Удалять можно только свои карточки!'));
      Card.remove(card)
        .then((cardToDelete) => res.send(cardToDelete !== null ? { data: card } : { data: 'Нечего удалять' }))
        .catch(() => { throw new ServerError('Произошла ошибка при удалении карточки'); });
    })
    .catch((err) => next(err.statusCode ? err : new NotFoundError('Такой карты нет')));
};
