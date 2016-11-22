const LocalStrategy = require("passport-local").Strategy;
const User = require("../app/models/user.js");

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use("local-signup", new LocalStrategy({ passReqToCallback : true }, function (req, username, password, done) {
        User.findOne({ "username": username }, function(err, user) {
            if (err)
            {
                return done(err);
            }
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();
                console.log(newUser);

                // set the user's local credentials
                newUser.username = username;
                newUser.password = bcrypt.hashSync(password, 10);

                // save the user
                newUser.save(function(err) {
                    if (err)
                    {
                        throw err;
                    }  
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.use(new LocalStrategy({ passReqToCallback : true }, function(req, username, password, done) {
        User.findOne({ "username": username }, function(err, user) {
            if (err)
            {
                return done(err);
            }

            if (!user)
            {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if (!user.validPassword(password))
            {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            
            return done(null, user);
        });
    }));
}