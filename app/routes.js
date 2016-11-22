module.exports = function(app, passport) {
    app.get("/", function(req, res){
        res.render("index.ejs");
    });

    app.get("/game", isAuthenticated, function(req, res){
        res.render("game.ejs");
    });

    app.get("/login", function(req, res) {
        res.render("login.ejs", { message: req.flash('loginMessage') });
    });

    app.get("/register", function(req, res){
        res.render("register.ejs", { message: req.flash('signupMessage') });
    });

    app.post("/login", passport.authenticate('local', {
        successRedirect : '/game',
        failureRedirect : '/login', 
        failureFlash : true 
    }));

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/game',
        failureRedirect : '/register', 
        failureFlash : true
    }));

    
};

function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.isAuthenticated())
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}
