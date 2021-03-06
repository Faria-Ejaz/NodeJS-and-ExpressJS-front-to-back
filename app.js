var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

// var logger = function(req,res,next){
//     console.log('logging--');
//     next();
// }
// app.use(logger);

//View Engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

//body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname,'public')));

//Global Vars
app.use(function(req,res,next) {
    res.locals.errors = null;
    next();
})

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param,msg,value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while (namespace.length) {
            formParam += '['+ namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


app.get('/', function(req,res){
    db.users.find(function (err, docs){
         res.render('index',{
            title: 'Customers',
            users: docs
        });     
    })
});

app.post('/users/add', function(req,res) {

    req.checkBody('firstname', 'First Name is Required').notEmpty();
    req.checkBody('lastname', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    
    var errors = req.validationErrors();

    if (errors) {
        res.render('index',{
            title: 'Customers',
            users: users,
            errors: errors
        });
        console.log('ERRORS');
    }else{
        var newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        }
        db.users.insert(newUser, function(err, result) {
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
    }
});
app.delete('/users/delete/:id', function(req,res) {
    db.users.remove({_id: ObjectId(req.params.id)}, function(err,result){
        if(err){
            console.log(err);
           }
            res.redirect('/');
        });
    });
app.listen(3000,function(){
    console.log('Server started on port 3000...');
})