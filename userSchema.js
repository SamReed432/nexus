const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
	username: {type: String, unique: true},
	password: String, 
	reviews: [],
	profile_picture_path: String,
	num_lists: Number,
	lists: []
});

const movieSchema = new Schema({
	movie_id: Number,
	num_reviews: Number,
	stars: Number,
	nexus: Boolean,
	average_cats: {
		cat1: Number,
		cat2: Number,
		cat3: Number,
		cat4: Number,
		cat5: Number
	},
	reviews: []
})

const reviewSchema = new Schema ({
	mov_id: Number,
	body: String,
	rating: Number,
	categories: {
		cat1: Number,
		cat2: Number,
		cat3: Number,
		cat4: Number,
		cat5: Number
	},
	username: String,
	date: String,
	user_id: Number,
	profile_picture_path: String
	
})

const listSchema = new Schema ({
	title: String,
	icon: String,
	user: String,
	date_updated: Date,
	description: String,
	movies: []
	
})

const User = mongoose.model('user', userSchema);
const Movie = mongoose.model('movie', movieSchema);
const Review = mongoose.model('review', reviewSchema);
const List = mongoose.model('list', listSchema);

module.exports = {
	User, Movie, Review, List
}