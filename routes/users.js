const 
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


var upload=multer({dest: './uploads'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
    res.render('register', {
        'title': 'Register'
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        'title': 'Login'
    });
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
    // Get Form Validate
    var 
        name = req.body.name,
        email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        password2 = req.body.password2;

    // Check for image field
    if(req.file) {
        console.log('uploading File.......');
        
        //  File Info
        var 
            profileImageOriginalName = req.file.originalname,
            profileImageName = req.file.name,
            profileImageMine = req.file.minetype,
            profileImagePath = req.file.path,
            profileImageExt = req.file.extension,
            profileImageSize = req.file.size;
    } else {
        //  Set a Default Image
        var profileImageName = 'noimage.png';
    }

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email field is required').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Password field is required').equals(req.body.password);

    //  Check for errors
    
    var errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileImage: profileImageName
        });

        // Create User
        User.createUser(newUser, function(err, user) {
            if(err) throw err;
            console.log(JSON.stringify(user, undefined, 2));
        });

        //  Success Message
        req.flash('success', 'You are now registered and may log in');
        res.location('/');
        res.redirect('/');
    }
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if(err) throw err;
            if(!user) {
                console.log('Unknown User');
                return done(null, false, req.flash('error', 'Unknown User'));
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, req.flash('error', 'Invalid Password'));
                }
            });
        });
    }
));

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username or password' }), function(req, res) {
   console.log('Authentication Successful') ;
   req.flash('success', 'You are logged in');
   res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout(); 
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');

});

module.exports = router;
