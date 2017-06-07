//ovdje konstruramo dish router express objekt, za koristenja na /teams rut
var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(function(req,res,next){
    
})
.post(function(req,res,next){
    
})
.put(function(req,res,next){
    
})
.delete(function(req,res,next){
    
});

router.route('/:teamID')
.get(function(req,res,next){
    
})
.post(function(req,res,next){
    
})
.put(function(req,res,next){
    
})
.delete(function(req,res,next){
    
});

module.exports = router;