'use strict';

var express = require('express');
var router = express.Router();

var users = require('../lib/users');

router.get('/', function(req, res, next) {
    req.session.destroy();
  res.render('index', { title: 'Express' });
});
router.post('/',loginHandler);
router.get('/plain',ensureLoggedinIn,index);
router.post('/plain',hvada,index);
router.get('/create',create);
router.post('/create',createHandler);

module.exports = router;

/** route middlewares **/
function hvada(req,res,next){
  var x = req.body.butt1;
  var y = req.body.butt2;
  if(x==1){
    vista(req,res,next);
  } 
  if(y==2){
    eyda(req,res,next);
  }
}

function create(req, res, next){
  res.render('create', { title: 'Create user' });
}

function createHandler(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  users.createUser(username, password, function (err, status) {
    if (err) {
      console.error(err);
    }

    var success = true;

    if (err || !status) {
      success = false;
    }
    res.render('', { title: 'Create user', post: true, success: success })
  });
}

function ensureLoggedinIn(req, res, next) {
  if (req.session.user) {
    next(); // köllum í næsta middleware ef við höfum notanda
  } else {
    res.redirect('/');
  }
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

function eyda(req,res,next){
  var title=req.body.text;
  var user=req.session.user.username;
  console.log(title)
  console.log(user)
    users.deleteFromDatabase(user, title, function (err, status) {
    if (err) {
      console.error(err);
    }

    var success = true;

    if (err || !status) {
      success = false;
    }
    next();
  });
}

function vista(req,res,next){
  var title=req.body.text;
  var text=req.body.texti;
  if(title=="") return;
  var user=req.session.user.username;
  console.log(title)
  console.log(user)
    users.deleteFromDatabase(user, title, function (err, status) {
    if (err) {
      console.error(err);
    }

    var success = true;

    if (err || !status) {
      success = false;
    }
  });
  users.insertIntoDatabase(user, title, text, function (err, status) {
    if (err) {
      console.error(err);
    }

    var success = true;

    if (err || !status) {
      success = false;
    }
    next();
  });
}

function loginHandler(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  users.auth(username, password, function (err, user) {
    if (user) {
      req.session.regenerate(function (){
        req.session.user = user;
        res.redirect('/plain');
      });
    } else {
      var data = {
        title: 'Login',
        username: username,
        error: true
      };
      res.render('', data);
    }
  });
}


function index(req, res, next) {
  var user = req.session.user.username;
  users.listUsers(user, function (err, result) {
    var i=0;
    var text = [];
    var title = [];
    var date = [];
    console.log(result.rows);
    while(i<result.rows.length){
      text[i]=result.rows[i].text;
      title[i]=result.rows[i].title;
      date[i]=result.rows[i].entrydate;
      i++;
    }
    var data={
      item:text,
      title:title,
      dat:date
    };
    res.render('plain',data);

  })
}

