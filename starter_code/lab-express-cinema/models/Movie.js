const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require('express');
const app = express();


const movies = new Schema({

    title: String,
    director: String,
    stars: Array,
    image: String,
    description: String,
    showtimes: Array

}, {
    timestamps: {
        createdAt: 'create_at',
        updatedAt: 'updated_at'
    }

});

const Movie = mongoose.model('Movie',movies);
module.exports = Movie;