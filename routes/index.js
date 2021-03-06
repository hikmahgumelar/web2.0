var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Twit = require('twit');
var multer = require('multer');
var app = express();
var done=false;




var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/masuk');
}


module.exports = function(passport){

var mongoose = require('mongoose');
var Schema	= mongoose.Schema;

var postSchema = new Schema({
				isi : String,
				judul : String,
				tgl : Date,
				pengarang : String


});
/* add postingan ke database */
var posts = mongoose.model('posts', postSchema);
 router.post('/input',function(req, res){
var tanggal = new Date();
new posts({
    judul : req.body.judul,
    isi : req.body.isi,
    tgl   : tanggal,
    pengarang : req.body.author
  }).save(function(err, prd){
    if(err) res.json(err);
    else    
          res.redirect('/home');
  });
})
    
   
    /* GET PAGE utama */
    router.get('/', function(req, res){
    mongoose.model('posts').find(function(err, posts){
    	res.render('pageone', {title:"Halaman Utama", data:posts});
    });
	})
	/* GET login page. */
	router.get('/masuk', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});
	/*GET Detail */
	router.get('/detail/:id', function(req, res){

	mongoose.model('posts').findById(req.params.id,function(err, posts){

 	 res.render('detail', {title:"detail", data:posts});
	});  
	})
	/* ubah data */
	router.get('/ubah/:id', function(req, res){

	mongoose.model('posts').findById(req.params.id,function(err, posts){

 	 res.render('edit', {user: req.user, title:"detail", data:posts});
	});  
	})
	/*Cari data*/

	router.post('/cari', function(req, res){
	var temukan = req.body.judul;
	console.log(temukan);
	mongoose.model('posts').find({isi: new RegExp(temukan, "i")}, function(err, posts){
	res.render('cari', {title:"halaman cari", data:posts});
	
	});	
	})
	/*  Update  */
	router.post('/update/:id', function(req, res){
	var tambah = ({
		judul : req.body.judul,
    	isi : req.body.isi
	});
	mongoose.model('posts').findByIdAndUpdate(req.params.id,tambah,function(err, posts){
    res.redirect('/home');
 	 
	});  
	})
	/* hapus data */
	router.get('/hapus/:id', function(req, res){

	mongoose.model('posts').findByIdAndRemove(req.params.id,function(err, posts){
	res.redirect('/home'); 		
	});  
	})

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
	
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	
	router.post('/signup', passport.authenticate('signup', {

		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */

	router.get('/home', isAuthenticated, function(req, res){
		User.find(function(err, userss){
		mongoose.model('posts').find(function(err, posts){
		res.render('home', { user: req.user, title:"halaman admin", data:posts, datausers:userss});
	});
	})	
    })

/*twiter*/
/* update twitan */
router.get('/tweet', isAuthenticated, function(req, res){
User.find(function(err, userss){
mongoose.model('posts').find(function(err, posts){
var T = new Twit(require('../models/config.js'));
var caritwit = "lewatmana";
T.get('search/tweets', { q: caritwit, count:4}, function(err, datatwit){
	res.render('tweets', { user: req.user, datausers: userss, title:"Twitter Module", data1:datatwit.statuses, data:posts});
})
});
})
});
	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});   


router.post('/twetan', function(req, res){
var isitwet = req.body.twet;
var T = new Twit(require('../models/config.js'));
T.post('statuses/update', { status: isitwet }, function(err, data, response) {
console.log("response")

res.redirect('/tweet');
})
});
router.get('/timeline', function (req, res) {
res.sendfile('views/timeline.html');
});


/*-------*/	

	return router;
}

