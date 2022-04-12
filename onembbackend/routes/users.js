var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var User = require('../models/user');
var userServices = require('../services/userServices');
const req = require('express/lib/request');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser,authenticate.verifyAdmin,(req, res) =>  {
  User.find({}).then((users)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(users);
  },(err)=>next(err))
  .catch((err)=>next(err));
  // res.send('respond with a resource');
});

router.post('/signup',(req,res,next)=>{
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      if(req.body.dob)
        user.dob = req.body.dob;
      if(req.body.email)
        user.email = req.body.email;
      if(req.body.company)
        user.company = req.body.company;
      if(req.body.areaofexp)
        user.areaofexp = req.body.areaofexp;
      if(req.body.designation)
        user.designation = req.body.designation;
      if(req.body.admin)
        user.admin = req.body.admin;
      user.save((err,user)=>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login',passport.authenticate('local'),(req, res) => {
  var token = authenticate.getToken({_id:req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true,token:token, status: 'You are successfully logged in!'});
});

router.post('/logout', authenticate.verifyUser,(req, res,next) => {
  if (req.session) {
    req.session = null;
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;