require('./models/User');
require('./models/Message');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const requireAuth = require('./middlewares/requireAuth');


const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(messageRoutes);
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))



const mongoUri = 
'mongodb+srv://admin:passwordpassword@cluster0-iteqx.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('connected to mongo');
});

mongoose.connection.on('error', (err) => {
    console.error('error connecting to mongo', err);
});



app.get('/', requireAuth, (req, res) => {
    res.send(`Your Email: ${req.user.email}`);

});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});