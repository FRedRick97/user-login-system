const 
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/test');
// var db = mongoose.connection;

// User Schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true, // https://docs.mongodb.com/manual/indexes/#Indexes-CompoundKeys
    },
    password: {
        type: String
    },
    email: {
        type: String,
    },
    name: {
        type: String
    },
    profileImage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function(username, callback) {
    var query = {username};
    User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function (err, salt) {
        if(err) throw err;
        bcrypt.hash(newUser.password, salt,  function(err, hash){
            if(err) throw err;
            // set hashed password
            newUser.password = hash;
            newUser.save(callback);     
        });
    });
};
