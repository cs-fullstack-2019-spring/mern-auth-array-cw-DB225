var express = require('express');
var router = express.Router();
var UserAuthCollection = require('../models/UserAuthSchema');

// Used to hash passwords
var bCrypt = require('bcrypt-nodejs');

// Middleware for authentication. Run at the start of a route that uses a strategy
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Initialize passport and restore cookie data
router.use(passport.initialize());
router.use(passport.session());

//Serialization and Deserialization: In order to restore authentication state across HTTP requests, Passport needs to serialize users into and deserialize users out of the session. Serialization is the process of turning an object in memory into a stream of bytes so you can do stuff send it the database. Deserialization is the reverse process of serialization.
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    UserAuthCollection.findById(id, function(err, user) {
        done(err, user);
    });
});

// Validation for password. The password in the function is what the user enterd. The user.password is the saved password. It's run when someone needs to log in and check if the password they entered is the same as the one in the database.
var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};

// Password scrambler (randomizes it)
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

passport.use('signup', new LocalStrategy(
    {passReqToCallback : true},
    function(req, username, password, done) {
        console.log("0");
        findOrCreateUser = function(){
            UserAuthCollection.findOne({'username':username},function(err, user) {
                // In case of any error in Mongoose/Mongo when finding the user
                if (err){
                    console.log('Error in SignUp: '+err);
                    // Return the error in the callback function done
                    return done(err);
                }
                // if the user already exists
                if (user) {
                    console.log('User already exists');
                    return done(null, false,
                        { message: 'User already exists.' }
                    );
                } else {
                    console.log(req.body);
                    // if there is no user with that email
                    // create the user
                    var newUser = new UserAuthCollection();
                    // set the user's local credentials
                    newUser.username = req.body.username;
                    newUser.password = createHash(req.body.password);

                    // save the user. Works like .create, but for an object of a schema
                    newUser.save(function(err) {
                        // If there is an error
                        if (err){
                            console.log('Error in Saving user: '+err);
                            // Throw error to catch in the client
                            throw err;
                        }
                        console.log('User Registration succesful');
                        // Null is returned because there was no error
                        // newUser is returned in case the route that called this strategy (callback route) needs any of it's info.
                        return done(null, newUser);
                    });
                }
            });
        };
        process.nextTick(findOrCreateUser);
    })
);

// Create new user with the signup strategy
router.post('/newuser',
    passport.authenticate('signup',
        {failureRedirect: '/users/failNewUser'}
    ),
    function(req, res) {
        // Send the message in the .send function
        res.send('User Created!!!');
    });

// If a new user signup strategy failed, it's redirected to this route
router.get('/failNewUser', (req, res)=>{
    res.send('NOPE!!! On the new user');
});

//******************************************************************
// ***************   Check if a user exists    *********************
//******************************************************************

// This is the "strategy" for checking for an existing user. If we don't assign a name to the strategy it defaults to local
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Local Strat");
        UserAuthCollection.findOne({ username: username }, function (err, user) {
            if (err) {console.log("1");
                return done(err); }
            if (!user) {
                console.log("2");
                return done(null, false, { message: 'Incorrect username.' });
            }
            // Check to see if the password typed into the form and the user's saved password is the same.
            if (!isValidPassword(user, password)) {
                console.log("3");
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log("4");
            console.log(user);
            return done(null, user, { user: user.username });
        });
    }
));

// If someone tries to login, run this route.
router.post('/login',
    passport.authenticate('local',
        {failureRedirect: '/users/loginfail' }),

    function(req, res) {
        console.log(req.body);
        req.session.username=req.user.username;
        res.send({
            username: req.user.username,
            password: req.user.password
        });
    });

// If the route authentication fails send an empty collection
router.get('/loginfail', (req, res)=>{
    res.send({});
});

// This route is called when the use clicks the Log Out button and is used to clear the cookies
router.get('/logout', (req, res, next) => {
    console.log(req.session);
    req.session = null;
});


module.exports = router;