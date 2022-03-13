const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/cluckDB');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var selectedTable = "";

app.get('/', function(req, res) {
    res.render('home');
})

app.get('/table', function(req, res) {
    res.render('table');
})

app.post('/table', function(req, res) {
    selectedTable = (req.body.table);

    const newItem = new List({
        table: selectedTable
    });

    List.insertMany(newItem, function (err) {
        if (err) 
          console.log(err);
    });

    res.redirect('/maindish');
})

app.listen(8800, function() {
    console.log("Server started on port 8000");
})
