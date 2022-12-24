const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'FGVxjxaLbnLT' //process.env.SECRETKEY;


let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {

    let user ={id:'1'} //getUser({ id: jwt_payload.id });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});



module.exports = {jwtOptions , ExtractJwt , JwtStrategy, strategy };