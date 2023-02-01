require("dotenv").config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// import config
const dbOptions = require('./config/dbOptions.config');

// import routes
const home = require('./routes/atm/home');
const login = require('./routes/auth/login');
const register = require('./routes/auth/register');
const logout = require('./routes/auth/logout');
const profile = require('./routes/atm/profile');
const editProfile = require('./routes/atm/editProfile');
const deposit = require('./routes/atm/deposit');
const withdraw = require('./routes/atm/withdraw');
const transactions = require('./routes/atm/transactions');

const app = express();

app.set('trust proxy', 1);

// create MySQLStore to store sessions
const sessionStore = new MySQLStore(dbOptions);

// Configure Sessions Middleware
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,  //don't save session if unmodified
  saveUninitialized: false,  // don't create session until something stored
  cookie: {
    // sameSite: 'none',
    // secure: true, 
    maxAge: 2 * 60 * 60 * 1000    // 2 hour
  },
  store: sessionStore,
}));

app.set('view engine', 'ejs');
app.set('views', ('./src/views/')); //set the views folder path

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
require('./config/passportLocal.config')(passport);

// configure routes
app.use('/', home);
app.use('/', login);
app.use('/', register);
app.use('/', logout);
app.use('/', profile);
app.use('/', editProfile);
app.use('/atm', deposit);
app.use('/atm', withdraw);
app.use('/atm', transactions);

// 404 Error route
app.get('*', function(req, res){
  res.render('404');
});

const port = process.env.PORT || 3150;

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});