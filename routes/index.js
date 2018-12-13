var express = require('express');
var router = express.Router();

let mysql = require('mysql');
let connection = mysql.createConnection({
  host: "localhost",
  database: "bunis",
  user: "root",
  password: ""
})

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

router.use(passport.initialize());

passport.use(new FacebookStrategy({
  clientID : '684570261937241',
  clientSecret : 'a32bde57395f06e7ed429cc66539bd63',
  callbackURL: 'https://7f6281d3.ap.ngrok.io/authFacebook/done',
  profileFields: ['id', 'name', 'email', 'photos']
}, function(accessToken, refreshToken, profile, done){
  return done(null, profile);
}))

passport.serializeUser(function(profile,done){
  return done(null, profile);
})

passport.deserializeUser(function(profile,done){
  return done(null, profile);
})

router.get('/authFacebook', passport.authenticate('facebook'));
router.get('/authFacebook/done', 
passport.authenticate('facebook', {
  failureRedirect: '/'
}),function(req,res){
  
  let facebook_id = req.user.id;

  let query = "SELECT * FROM users WHERE facebook_id=?"

  connection.query(query, [facebook_id], function(err, results){
    if(err)
    {
      res.json({msg: "error"})
      throw err;
    }

    if(results.length === 0)
    {
      return res.redirect('/register?facebook_id=' + facebook_id)
    }
    else
    {
      return res.json({msg: "user id is " + results[0].id})
    }
  })


});

router.get('/register', function(req, res){
  res.render('register');
})

router.post('/doRegister', function(req, res){
  let username = req.body.username;
  let facebook_id = req.body.facebook_id;
  let password = req.body.password;

  let query = "INSERT INTO users(facebook_id, username, password) VALUES(?, ?, ?)";
  let params = [facebook_id, username, password];

  connection.query(query, params, function(err, results){
    if(err)
    {
      res.json({msg:"error"})
      throw err;
    }

    res.json({msg: "register success"})
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
