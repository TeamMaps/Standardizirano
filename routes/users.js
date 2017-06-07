//ovdje konstruramo dish router express objekt, za koristenja na /users rut
var express = require('express');
var bodyParser = require('body-parser');
var connection = require('connection');
connection.connect();

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(function(req,res,next){
   connection.query('SELECT * FROM Users',function(err, rows, fields) {
    if (err) throw err;
    res.send(rows[0]);
   })
})
.post(function(req,res,next){
    
})
.put(function(req,res,next){
    
})
.delete(function(req,res,next){
    
});

router.route('/:userID')
.get(function(req,res,next){
    
})
.post(function(req,res,next){
    
})
.put(function(req,res,next){
    
})
.delete(function(req,res,next){
    
});

router.route('/login')
.get(function(req,res,next){
     res.sendFile("login.html", { root: __dirname });
});

module.exports = router;
