const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcryptjs');

// Load User model
const Users = require('../models/user');
//const User = require('../models/teacher');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'id' }, (id, password, done) => {
      // Match user
      Users.findOne({
        "id": id
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That roll is not registered' });
        }

        // Match password
          if (password===user.password) {
            return done(null, user);
          } 
          
          
          else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Users.find({"id":id}, function(err, user) {
      done(err, user);
    });
  });
};