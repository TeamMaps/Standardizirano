//ovdje konstruramo dish router express objekt, za koristenja na /images rut
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
var user = "hehe";

var router = express.Router();
router.use(bodyParser.json());
var user = "tomislav";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temporary/'+user)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
});

var upload = multer({ storage: storage });

router.route('/')
.get(function(req,res,next){
    
})
.post( upload.any() ,function(req,res,next){  //upload je konfigurirana multer instanca, .any() skuplja sve fajlove
    console.log(req.body);
    res.end();
})
.put(function(req,res,next){
   
})
.delete(function(req,res,next){
    
});

router.route('/:imageID')
.get(function(req,res,next){
    
})
.post(function(req,res,next){
    
})
.put(function(req,res,next){
    
})
.delete(function(req,res,next){
    
});

module.exports = router;
