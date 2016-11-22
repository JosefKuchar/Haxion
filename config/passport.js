const LocalStrategy = require("passport-local").Strategy;
const User = require("../app/models/user.js");

module.exports = function(passport) {
    // Save user to session 
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Get user from session
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Registration logic
    passport.use("local-signup", new LocalStrategy({ passReqToCallback : true }, function (req, username, password, done) {
        // Find user by name
        User.findOne({ "username": username }, function(err, user) {
            // If db not responding return error
            if (err)
            {
                return done(err);
            }

            // If user exists, flash error
            if (user) {
                return done(null, false, req.flash("signupMessage", "Username is already taken."));
            } else {
                // Create new user instance
                var newUser = new User();

                // Set username
                newUser.username = username;
                // Set password by hashing with bscrypt
                newUser.password = bcrypt.hashSync(password, 10);

                // Save to DB
                newUser.save(function(err) {
                    // If DB error, throw it
                    if (err)
                    {
                        throw err;
                    }

                    // Return new user (log-in)
                    return done(null, newUser);
                });
            }
        });
    }));

    // Login logic
    passport.use(new LocalStrategy({ passReqToCallback : true }, function(req, username, password, done) {
        // Find user by name
        User.findOne({ "username": username }, function(err, user) {
            // If db not responding return error
            if (err)
            {
                return done(err);
            }

            // If user not exists, flash error
            if (!user)
            {
                return done(null, false, req.flash("loginMessage", "No user found."));
            }

            // If passwords not match, flash error
            if (!user.validPassword(password))
            {
                return done(null, false, req.flash("loginMessage", "Oops! Wrong password."));
            }
            
            // Log-in
            return done(null, user);
        });
    }));
}