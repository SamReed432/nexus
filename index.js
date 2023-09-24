const https = require('https');
var mongo=require('mongodb');
const express=require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var cookie = require('cookie')

const app = express();

const server = app.listen(process.env.PORT || 3000, function() {
	console.log("Listening on port 3000");
})

const { Server } = require("socket.io");
const io = new Server(server);


let fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');
var MongoClient=mongo.MongoClient;
var url = "mongodb+srv://main:nexus@nexusmovies.ka2cn.mongodb.net/Nexus?retryWrites=true&w=majority";
var thisUser;
mongoose.connect(url, { useNewUrlParser: true});
const { User, Movie, List, Review} = require('./userSchema.js');
const db = mongoose.connection;
const key = "011002260fff189303f2786eca5598b0";

const { createServer } = require('node:http');
const { join } = require('node:path');

 
app.use(express.static(__dirname + 'public'));

app.use(cookieParser({
  secure: true, // Enable secure cookies for HTTPS
  sameSite: 'None', // Set the SameSite attribute as needed
}));

mongoose.set('strictQuery', true);

//Connects to the databse
db.once('open', _=>{
	console.log("Successfully connected to Mongo")
})
   
db.on('error', err => {
	console.error('connection error: ' + err)
})

//Initializes the body parser 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.set('view enigne', 'ejs');


//Home/Welcome page
app.get('/', function(req, res){
	res.sendFile(__dirname + '/home.html');
})

//Chat Page
app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/chat.html');
})



//SIGNUP FOR NEW USERS
app.get('/signUp', function(req, res){
	res.sendFile(__dirname + '/signUp.html');
})

//SIGN UP ADD TO DATABASE
app.post('/newUser', (req, res) => {
	console.log(req.body); 
	if(req.body.password == ''){
		res.redirect('/signUp?taken=true');
		return;
	}
	var userIn = new User ({
		username: req.body.username,
		password: req.body.password, 
		saved: [],
		num_lists: 0,
		lists: []
	})
	userIn.save(function (error, document) {
		if (error) console.log(error);
		if(document == undefined){
			res.redirect('/signUp?taken=true') 
		} else {
			res.cookie("user", req.body.username);
			res.redirect('/');
		}
	})
})

//LOGIN FOR EXISTING USER
app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/login.html');
})

//Checks the make sure correct username and password used
app.post('/loginCheck', (req, res) => {
	User.findOne({ username: req.body.username})
	.then (userIn => {
		if(userIn == null){
			console.log("login failed")
			res.redirect('/login?taken=true')
		}else if(req.body.password == userIn.password){
			res.cookie("user", req.body.username);
			console.log("Logged In Successfully");
			res.redirect('/');
		} else {
			console.log("login failed")
			res.redirect('/login?taken=true')
		}
	})
})

app.get('/search_movies', (req, res) => {
	const http = require('http');
	if (req.query.id == null){
		var query_string = 'https://api.themoviedb.org/3/search/movie?api_key=011002260fff189303f2786eca5598b0&language=en-US&query=' + req.query.search;
	console.log(query_string);
		https.get(query_string, (resp)=> {
			let data = '';
			
			resp.on('data', (chunk) => {
				data += chunk;
			});
				  
			resp.on('end', () => {
				res.status(200).json(data);
				//res.write(pared);
			});
		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
		
	} else {
		var query_string = "https://api.themoviedb.org/3/movie/" + req.query.id + 
			"?api_key=011002260fff189303f2786eca5598b0&language=en-US";
		
		https.get(query_string, (resp)=> {
			let data = '';
			
			resp.on('data', (chunk) => {
				data += chunk;
			});
				  
			resp.on('end', () => {
				res.status(200).json(data);
			});
		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}	
})

app.get('/top_films', (req,res) => {
	res.sendFile(__dirname + '/top_films.html');
})

app.get('/get_top_films', (req, res) => {
	console.log(req.query.id);
	if (req.query.id == "tv") {
		console.log("TV");
		var query_string = 'https://api.themoviedb.org/3/tv/popular?language=en-US&sort_by=popularity.desc&with_origin_country=US&api_key=011002260fff189303f2786eca5598b0&page=1';
	} else {
		console.log("MOVIE");
		var query_string = 'https://api.themoviedb.org/3/movie/popular?api_key=011002260fff189303f2786eca5598b0&language=en&origin_country=US';
	}
	https.get(query_string, (resp)=> {
			let data = '';
			
			resp.on('data', (chunk) => {
				data += chunk;
			});
				  
			resp.on('end', () => {
				res.status(200).json(data);
			}); 
		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
})


app.get('/get_reviews', async (req, res) => {
	var curr_id = parseInt(req.query.id);
	
	var data_array = ['test'];

		const curr_movie = await Movie.findOne({movie_id: curr_id})
		.then (curr_movie => {
			if(curr_movie == null){
				console.log("no movie found (get_revs)");
			}else {
				res.json(curr_movie);
			}
		})
	})

app.get('/get_review', async (req, res) => {
	console.log(req.query.id);	
	var ObjectId = require('mongodb').ObjectId; 
	var id = req.query.id;       
	var o_id = new ObjectId(id);
	
	const curr_rev = await Review.findOne({_id: o_id})
		.then (curr_rev => {
			if(curr_rev == null){
				console.log("no review found");
			}else {
				res.json(curr_rev);
			}
		})
	});

app.put('/add_review', (req, res) => {

	var mycookie = req.headers.cookie;
	console.log(mycookie);
	if (mycookie === undefined){
		res.body = "FAILURE";
		res.send("yoyo");
		return; 
	}
	
	let cats = [0, parseFloat(req.body.cat1), parseFloat(req.body.cat2), parseFloat(req.body.cat3), parseFloat(req.body.cat4), parseFloat(req.body.cat5)];
	
	console.log("CATS: " + ((cats[1] + cats[2] + cats[3] + cats[4] + cats[5]) / 5));
	
	var cookieArray = mycookie.split('=');	
	
	console.log(req.body);
	
	const myUser = User.findOne({ username: cookieArray[1]});
	
	var new_review = new Review ({
		mov_id: req.body.movie_id,
		body: req.body.description,
		username: cookieArray[1],
		user_id: myUser._id,
		profile_picture_path: myUser.profile_picture_path,
		date: new Date,
		rating: ((cats[1] + cats[2] + cats[3] + cats[4] + cats[5]) / 5),
		categories: {
			cat1: cats[1],
			cat2: cats[2],
			cat3: cats[3],
			cat4: cats[4],
			cat5: cats[5]
	},
	});
	
	var id = 0;
	
	new_review.save(function (error, document) {
		if (error) console.log(error);
		if(document == undefined){
			console.log("add_failed");
		} else {
			id = "" + (document._id);
			const myUser2 = User.findOne({ username: cookieArray[1]})
			.then (myUser2 => {
				if(myUser2 == null){
						console.log("user not found");
				} else {
					myUser2.reviews.push(id);
					myUser2.save();
					console.log("added review to user");
				}
			})

			curr_id = parseInt(req.body.movie_id);
			console.log("Curr Id:" + curr_id);
			const curr_movie = Movie.findOne({movie_id: curr_id})
				.then (curr_movie => {
					if(curr_movie == null){
							console.log("no movie found");
					}else  {
						console.log("Movie found on mongo");
						curr_movie.reviews.push(id);
						let num_revs = curr_movie.num_reviews;
						
						console.log("curr cat1:" + curr_movie.average_cats.cat1 + " num_revs: " + num_revs + "  body.cat1: " + cats[1]);
						
						curr_movie.average_cats.cat1 = ((curr_movie.average_cats.cat1 * num_revs) + cats[1])/(num_revs + 1);
						
						curr_movie.average_cats.cat2 = ((curr_movie.average_cats.cat2 * num_revs) + cats[2])/(num_revs + 1);
						curr_movie.average_cats.cat3 = ((curr_movie.average_cats.cat3 * num_revs) + cats[3])/(num_revs + 1);
						curr_movie.average_cats.cat4 = ((curr_movie.average_cats.cat4 * num_revs) + cats[4])/(num_revs + 1);
						curr_movie.average_cats.cat5 = ((curr_movie.average_cats.cat5 * num_revs) + cats[5])/(num_revs + 1);
						 
						curr_movie.num_reviews = num_revs + 1;
						
						
						curr_movie.stars = (curr_movie.average_cats.cat1 + curr_movie.average_cats.cat2 + curr_movie.average_cats.cat3 + curr_movie.average_cats.cat4 + curr_movie.average_cats.cat5) / 5;
						
						console.log(curr_movie); 
						 
						curr_movie.save();
					}
				})
			}
	})
	
	
})



app.get('/movie', (req, res) => {
	
	//Adds a movie to the db if it is not there already
	const myMovie = Movie.findOne({movie_id: req.query.id})
	.then (myMovie => {
		
		if(myMovie == null){
			console.log(req.query.id);
			const newMovie = new Movie ({
				movie_id: req.query.id,
				num_reviews: 0,
				stars: 0,
				nexus: false,
				average_cats: {
					cat1: 0,
					cat2: 0, 
					cat3: 0,
					cat4: 0,
					cat5: 0
				}
			})
		    newMovie.save(function (error, document) {
		if (error) console.log(error);
		if(document == undefined){
			console.log("add failed");
		} else {
			console.log("add worked");
		}
	})
		}
	})
	res.sendFile(__dirname + '/movie.html')
})

/*********  LIST METHODS  ************/

app.get('/lists', (req, res) => {
	res.sendFile(__dirname + '/lists_home.html')
})

app.get('/get_lists', (req, res) => {
	const currUser = User.findOne({ username: req.cookies.user})
		.then(myUser => {
			if(myUser == null){
				console.log("User Not Found");
			} else {
				res.json(myUser.lists);
			}
		});
})

app.get('/get_listTitle', (req, res) => {
	const currUser = User.findOne({ username: req.cookies.user})
		.then(myUser => {
			if(myUser == null){
				console.log("User Not Found");
			} else {
				console.log(req.headers.list_id);
				const myList = List.findOne({_id: req.headers.list_id})
				.then (myList => {
					if (myList == null){
						console.log("No List Found :(*");
						return;
					}
					console.log(myList);
					res.json(myList);
				})
			}
		});
})

app.get('/add_to_list', (req, res) => {
	const currUser = User.findOne({ username: req.cookies.user})
		.then(myUser => {
			if(myUser == null){
				console.log("User Not Found");
			} else {
				const currList = List.findOne({ _id: req.cookies.curr_list})
				.then(currList => {
					if(currList == null){
						console.log("List Not Found");
					} else {
						console.log(currList);
						currList.movies.push(req.headers.mov_id);
						currList.save();
						console.log("Mov added to list!");
						res.end();
			}
		});
			} 
		});
})


app.get('/get_list_info', (req, res) => {
	const myList = List.findOne({_id: req.cookies.curr_list})
	.then (myList => {
		if (myList == null){
			console.log("No List Found :(");
			return;
		} 
		console.log(myList);
		res.json(myList);
	});
})

app.get('/update_list_info', (req, res) => {
	
	const myList = List.findOne({_id: req.headers.list_id})
	.then (myList => {
		if (myList == null){
			console.log("No List Found :(_");
			return;
		}
		myList.title = req.headers.list_title;
		myList.description = req.headers.list_description;
		myList.save();
		res.redirect('/lists');
	});
})

/*********  LIST EDITOR  ************/

app.get('/list_editor', (req, res) => {
	var list = req.cookies.curr_list
	if (req.query.list_id != null){
		res.cookie("curr_list", req.query.list_id);
		list = req.query.list_id;
	}
	const thisList = List.findOne({_id:list})
	.then (myList => {
		if (myList == null){
			console.log("No List Found ): List: " + list);
			return;
		}
		let passingList = JSON.stringify(myList);
		res.sendFile(__dirname + '/lists_editor.html');
	})
})

//Create a new empty list and save the id to the users's lists array
app.get('/new_list', (req, res) => {
	
	const currUser = User.findOne({ username: req.cookies.user})
	.then(myUser => {
		if (myUser == null){
			console.log("No User Found!");
			return;
		}
		
		console.log(myUser);
	
		const newList = new List({
			title: "My New List"
		});
	
		newList.save();
		myUser.lists.push(newList._id);
		myUser.save();
		
		res.redirect('/list_editor?list_id=' + newList._id);
	})
})

app.post('/list_search', (req, res) => {
	res.redirect("/list_search?query=" + req.body.name);
})

app.get('/list_search', (req, res) => {
	res.sendFile(__dirname + '/list_search.html');
})


//app.put('/add_movToList', (req, res) => {
//
//	var mycookie = req.headers.cookie;
//	console.log(mycookie);
//	if (mycookie === undefined){
//		res.body = "FAILURE";
//		res.send("yoyo");
//		return; 
//	}
//	
//	var cookieArray = mycookie.split('=');	
//	
//	console.log(req.body);
//	
//	const myUser = User.findOne({ username: cookieArray[1]});
//	
//	
//			const myUser2 = User.findOne({ username: cookieArray[1]})
//			.then (myUser2 => {
//				if(myUser2 == null){
//						console.log("user not found");
//				} else {
//					myUser2.reviews.push(id);
//					myUser2.save();
//					console.log("added review to user");
//				}
//			})
//})

app.get('/rem_movToList', (req, res) => {
	const myList = List.findOne({_id: req.cookies.curr_list})
			.then (myList => {
				if(myList == null){
					console.log("lsit not found");
				} else {
					myList.movies = myList.movies.filter(item => item != req.headers.mov_id);
					myList.save();
					console.log("removed mov from list");
				}
			})
})

//Swap the order of elements in the list
app.get('/swap_list_order', (req, res) => {
	const myList = List.findOne({_id: req.cookies.curr_list})
			.then (myList => {
				console.log(myList.movies);
				if(myList == null){
					console.log("List not found");
				} else {
					index = myList.movies.indexOf(req.headers.mov_id);
					var temp;
					console.log("direction: " + req.headers.direction);
					if(req.headers.direction == "up"){
						if (index == 0) return;
						temp = myList.movies[index - 1];
						myList.movies[index - 1] = req.headers.mov_id;
					} else {
						if (index == (myList.movies.length - 1)){return};
						temp = myList.movies[index + 1];
						myList.movies[index + 1] = req.headers.mov_id;
					}
					myList.movies[index] = temp;
					console.log(myList.movies);
					myList.save();
					console.log("Swapped List Order!");
					res.send;
				}
			})
})



app.post('/movie_page', (req, res) => {
	res.redirect("/movie_page?query=" + req.body.name);
})
app.get('/movie_page', (req, res) => {
	res.sendFile(__dirname + '/movie_page.html')
})

app.get('/add_movie', (req, res) => {
	res.sendFile(__dirname + '/add_movie.html')
})


//****************** SOCKET IO CODE *********************//
const users = {}; //store connected urser to servers


io.on('connection', (socket) => {
	console.log('User connected to socket');
	var cooks = cookie.parse(socket.request.headers.cookie);
	
	console.log(cooks.user)
	const authenticatedUser = cooks.user;
	
	users[authenticatedUser] = socket;
	
	socket.broadcast.emit('user-joined', authenticatedUser);
	
	socket.on('disconnect', () => {
		console.log('user disconnected');
		delete users[authenticatedUser];
		socket.broadcast.emit('user-left', authenticatedUser);
	})
	
	socket.on('chat message', (msg) => {
		io.emit('chat message', {username: authenticatedUser, msg});
	});
	
	
})




//***************** END SOCKET IO CODE ******************//




//res.render('saved.ejs', {username: cookieArray[1], results: resultsIn});
