const UsersModel = require('../models/user')
var passport = require('passport')
const localStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, cb) {
    console.log('2222222222222222222222222222222');
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    console.log('333333333333333333333333333333333');
    User.findById(id, function (err, user) {
        cb(err, user);
    });
});

// passport.use(
//     'login',
//     new localStrategy(
//         {
//             username: 'username',
//             hash: 'hash'
//         },
//         async (username, hash, cb) => {
//             try {
//                 const user = await UsersModel.fincb({ username });

//                 if (!user) {
//                     return cb(null, false, { message: 'User not found' });
//                 }

//                 const validate = await user.isValidPassword(hash);

//                 if (!validate) {
//                     return cb(null, false, { message: 'Wrong Password' });
//                 }

//                 return cb(null, user, { message: 'Logged in Successfully' });
//             } catch (error) {
//                 return cb(error);
//             }
//         }
//     )
// );

passport.use(new localStrategy(
    function (username, password, cb) {
        console.log('444444444444444444444444444444444444444<<<');
        Usersmodel.fincb({ username: username }, function (err, user) {
            if (err) { return cb(err); }
            if (!user) {
                return cb(null, false, { message: 'Incorrect username.' });
            }

            if (!user.validPassword(password)) {
                return cb(null, false, { message: 'Incorrect password.' });
            }
            return cb(null, user);
        });
    }
));


module.exports = passport