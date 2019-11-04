require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users')
const cardsRoutes = require('./routes/cards');
const { PORT = 3000, BASE_PATH, SECRET_KEY = secret_key } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb',  {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(helmet());


app.post('/signin', login);
app.post('/signup', createUser);
// app.use((req, res, next) => {
//  req.user = {
//    _id: '5d999a39eae33d0fc001dc0f'
//  };
//  next();
// });
app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);

app.get('*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));

app.listen(PORT, () => {
 console.log('Ссылка на сервер:');
 console.log(BASE_PATH);
});

// app.get('/users/id/:id', (req, res)=> {
//   res.send(req.params);
// });