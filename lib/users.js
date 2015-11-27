'use strict';

var hash = require('../lib/pass').hash;
var pg = require('pg');

var DATABASE = process.env.DATABASE_URL;

function createUserWithHashAndSalt (username, salt, hash, cb) {
  pg.connect(DATABASE, function (error, client, done) {
    if (error) {
      return cb(error);
    }

    var values = [username, salt, hash, new Date()];
    console.log(values)
    var query = 'INSERT into users (username, salt, hash, date) VALUES($1, $2, $3, $4)';
    client.query(query, values, function (err, result) {
      done();

      if (err) {
        console.log("error")
        return cb(error);
      } else {
        return cb(null, true);
      }
    });
  });
}
module.exports.deleteFromDatabase= function deleteFromDatabase(user,title,cb){
  pg.connect(DATABASE, function (error, client, done) {
    if (error) {
      return cb(error);
    }
    var values = [user,title];
    console.log(values);
    var query = 'DELETE FROM entry WHERE "User" = $1 AND title = $2';
    client.query(query, values, function (err, result) {
      done();

      if (err) {
        console.log("error");
        return cb(error);
      } else {
        return cb(null, result);
      }
    });
  });
}
module.exports.insertIntoDatabase = function insertIntoDatabase(user,title,text,cb){
  pg.connect(DATABASE, function (error, client, done) {
    if (error) {
      return cb(error);
    }
    var datetime=new Date().toLocaleString();
    var datetimeComponents = datetime.split(' ');
    var dateComponents = datetimeComponents[0].split('/');
    var day=dateComponents[1];
    var month=dateComponents[0];
    var year=dateComponents[2].slice(0,-1);
    dateComponents[0]=day;
    dateComponents[1]=month;
    dateComponents[2]=year;
    dateComponents=dateComponents.join('.');
    datetimeComponents[0]=dateComponents;
    datetimeComponents[2]="";
    datetimeComponents=datetimeComponents.join(' ');
    var values = [user,title,text, datetimeComponents];
    console.log(values);
    var query = 'INSERT INTO entry ("User",title,text,entrydate) VALUES($1,$2,$3,$4)';
    client.query(query, values, function (err, result) {
      done();

      if (err) {
        return cb(error);
      } else {
        return cb(null, result);
      }
    });
  });
}
function findUser (username, cb) {
  pg.connect(DATABASE, function (error, client, done) {
    if (error) {
      return cb(error);
    }

    var values = [username];
    var query = 'SELECT username, salt, hash FROM users WHERE username = $1';
    client.query(query, values, function (err, result) {
      done();

      if (err) {
        return cb(error);
      } else {
        return cb(null, result.rows);
      }
    });
  });
}

module.exports.createUser = function createUser (username, password, cb) {
  hash(password, function (err, salt, hash) {
    if (err) {
      return cb(err);
    }

    createUserWithHashAndSalt(username, salt, hash, cb);
  });
};

module.exports.listUsers = function listUsers (username, cb) {
  pg.connect(DATABASE, function (error, client, done) {
    if (error) {
      return cb(error);
    }
    var values = [username];
    var query = 'SELECT * FROM entry WHERE "User" = $1';
    client.query(query,values, function (err, result) {
      done();
      if (err) {
        console.log("error");
        return cb(error);
      } else {
        return cb(null, result);
      }
    });
  });
};

module.exports.auth = function auth (name, pass, fn) {
  findUser(name, function (err, result) {
    var user = null;

    if (result.length === 1) {
      user = result[0];
    }

    if (!user) {
      return fn(new Error('cannot find user'));
    }

    hash(pass, user.salt, function(err, hash){
      if (err) {
        return fn(err);
      }
      
      if (hash === user.hash) {
        return fn(null, user);
      }

      fn(new Error('invalid password'));
    });
  });
}

