var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mysql = require('mysql');
var multer = require('multer');
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');
var expressSession = require('express-session');
var fs = require('file-system');
var mime = require("mime");
var shortId = require("shortid");

var config = require('./config'); 

var connection = mysql.createConnection({
    host:     "localhost",
    user:     "root",
    password: "team3password",
    database: "mydb"
});
connection.connect();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    req.picId = './protected/' + req._passport.session.user.facebook_id;
    cb(null, req.picId)
  },
  filename: function (req, file, cb) {
    var filename = shortId.generate()+"."+ mime.extension(file.mimetype);
    req.picId += '/' +filename;
    cb(null, filename);
  }
});

var upload = multer({ storage: storage });

var app = express();

function authenticated(req,res,next){
    console.log(req.user)
    if(typeof req.user == "undefined"){
        res.send(402,"You need to be logged in to perform this action");
    }
    else next();
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(expressSession({secret:"secret", resave:true, saveUninitialized:false}));


//Passport
app.use(passport.initialize()); 
app.use(passport.session());
/*passport.use("local", new LocalStrategy(function(username, password, done) {
     connection.query('SELECT user_id,username,password FROM Users WHERE username = ?', username, function(err, rows, columns)
     {
     if (err) throw err
     else 
     bcrypt.compare(password, rows[0].password, function(err, res) {
     if(res) return done(null, {id:rows[0].user_id});
     else throw new Error("nije dobar pass") // ocito necemo kresat server kad neko krivo upise pas xD, promjeni
});
})
})); 
passport.use("local-signup",new LocalStrategy({passReqToCallback:true}, function(req, username, password, done){
//    connection.query('SELECT * FROM Users WHERE username = ?', username, function(err,result){
//        if(err) throw err;
//        if(result) console.log("Username taken")  return;
//    })
//    connection.query('SELECT * FROM Users WHERE email = ?', req.body.email, function(err,result){
//        if(err) throw err;
//        if(result) console.log("This email is already in use!") return;
//    })
            bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if(err) throw err;
                else connection.query('INSERT INTO Users(username, password, email) VALUES (?,?,?)', [username, hash,req.body.email],function(err, result){
                if (err) throw err;
                return done(null, {id:result.insertId});
            })    
        })
    })
})); */
passport.use(new FacebookStrategy({
    clientID: 224816561339578 ,
    clientSecret: "641bb26cb4213d76d8e9cef1a35ef859",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id','displayName','email','friends','picture.type(large)']
  },
  function(accessToken, refreshToken, profile, cb) {
    connection.query('SELECT * FROM Users WHERE facebook_id = ?', profile.id, function(err, rows){
        if(err) throw err;
        var friends = [];
        console.log(profile);
        for(x in profile._json.friends.data){friends.push(profile._json.friends.data[x].id)};
        if(rows.length == 0) {
            var email = (typeof profile.emails !== 'undefined') ? profile.emails[0].value : "noemail";
            connection.query('INSERT INTO Users(username, facebook_id, email, photo) VALUES (?,?,?,?)',[profile.displayName,profile.id, email, profile.photos[0].value],function(err,rows){
            if(err) throw err;
            fs.mkdir('./protected/'+profile.id);
            return cb(null, {id: rows.insertId , friends:friends, facebook_id: profile.id, picture : profile.photos[0].value, name:profile.displayName} )  
        })}
        else return cb(null, {id:rows[0].user_id, friends:friends, facebook_id: profile.id, picture : profile.photos[0].value, name:profile.displayName}) 
    })
}));
passport.serializeUser(function( user, done ) {
    //odredujemo sto spremamo u sesiju
    done(null, user);
}); 
passport.deserializeUser(function( user , done ) {
    //rehidracija, pomoci id retreiveamo informacije iz sesije
   done( null, user.id ); // user ce bit zakvacen za req.user req.logout() za logout
}); 

app.use(express.static(path.join(__dirname, 'public')));
app.get('/',function(req,res,next){
    if(typeof req.user != "undefined") res.redirect("/home");
    res.sendFile('index.html', { root: __dirname } )
})

//app.post('/signup', passport.authenticate('local-signup', {
//    successRedirect : '/images', 
//    failureRedirect : '/signup', 
//}));
//app.get('/login',function(req,res,next){
//    res.sendFile('login.html',{root: __dirname})
//});

app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['user_friends', 'email','public_profile'] })); //

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });
app.get('/home', function(req,res,next){
    if(typeof req.user == "undefined"){res.redirect("/")};
   res.sendFile('home.html', { root: __dirname } )
})

app.get('/user_profile',function(req,res){
    res.sendFile("user.html",{root:__dirname})
});
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})
app.get("/userData", function(req,res){
    connection.query('SELECT title,opis,marker_id,icon,privacy FROM markers WHERE Users_user_id = ? ORDER BY marker_id DESC',req._passport.session.user.id,function(err,rows){
        res.json(rows);
    })
})
// REST API
app.route('/users')
.get(function(req,res,next){
  res.json({name:req._passport.session.user.name,picture:req._passport.session.user.picture})
})
.post(passport.authenticate('local', {successRedirect:'/images'}), function(req,res,next){
    console.log("ovdje sam");
  
})
.put(function(req,res,next){
    
})
.delete(function(req,res,next){
    
});

app.route('/images')
//console.log(req._passport.session.user.friends); // array frendova na fejsu
.post(upload.any(), function(req,res,next){
    res.json(req.picId);
}) // unikatna imena multer
.put(function(req,res,next){
   
})
.delete(function(req,res,next){
    
});

app.get('/protected/:userFolder/:imageName', function(req,res,next){
   res.sendFile('./protected/'+req.params.userFolder+'/'+req.params.imageName,{root:__dirname})
});

app.route('/team')
.get(function(req,res,next){
    res.sendFile("tim.html",{root:__dirname});
});

app.route('/markers')
.get(function(req,res,next){
    if(typeof req.user != "undefined"){
    var prijatelji = [];
    for(x in req._passport.session.user.friends){prijatelji.push(req._passport.session.user.friends[x])}
    prijatelji.push(req._passport.session.user.facebook_id);
     connection.query('SELECT username,photo,title,opis,lat,lng,privacy,marker_id,path,icon FROM Users JOIN Markers ON user_id = Users_user_id WHERE facebook_id IN ('+ prijatelji.join()+ ') || privacy = 0 ORDER BY privacy ,marker_id ', function(err, rows){ 
        if (err) throw err;
        res.json(rows);
    })
    }
    else connection.query('SELECT username,photo,title,opis,lat,lng,privacy,marker_id,path,icon FROM Users JOIN Markers  ON Users_user_id = user_id WHERE privacy = 0 ORDER BY marker_id',function(err,rows){
        console.log(rows)
       if(err) throw err;
       res.json(rows);
   })
})
.post(authenticated, function(req,res,next){ // ovdje trenutacno radim
    var inc = req.body;
    if(inc.title == "" || typeof inc.lat == undefined){ res.sendStatus(422)}
    else{
    var opis = (inc.opis)? inc.opis : "" ;
    var slike = (inc.slike)? inc.slike : "" ;
    var icon = (inc.icon)? inc.icon : "./images/icon1.png";
    var privatnost = (inc.privatnost)? inc.privatnost : 3;
    connection.query('INSERT INTO Markers(title,opis,lat,lng,Users_user_id,privacy, path, icon) VALUES (?,?,?,?,?,?,?,?)',
                     [inc.title, opis, inc.lat, inc.lng, req.user, privatnost, slike, icon], function(err){
                     if(err) throw err;
                     })
    res.sendStatus(200);
    }
})
.put(function(req,res,next){
    
})
app.delete('/markers:id',function(req,res,next){
    connection.query('SELECT Users_user_id FROM Markers WHERE marker_id = ?', req.params.id,function(err, rows){
        if(err) throw err;
        if(rows[0].Users_user_id == req.user){
         connection.query('DELETE FROM Markers WHERE marker_id =?', req.params.id, function(err,rows){
             if(err) throw err;
             res.sendStatus(200);
         })
        }
        else res.sendStatus(401);
    })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
