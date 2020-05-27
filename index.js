const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash');
const app = express()
const mongoose = require('mongoose')


require('./config/passport')(passport);
const db = require('./config/keys').mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true  }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  app.set('view engine', 'ejs');

  app.use(express.static(__dirname + '/public'));

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/',require('./routes/users'))

app.listen(3000, () => console.log("Academia available on port 3000..."))