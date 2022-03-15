const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');
const { render } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/cluckcluckDB');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var selectedTable = "";

const menuSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imgsrc: String,
    status: String,
    next: String
});

const listSchema = new mongoose.Schema({
    table: String,
    order: [menuSchema]
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Main = mongoose.model("main", menuSchema);
const Side = mongoose.model("side", menuSchema);
const Sauce = mongoose.model("sauce", menuSchema);
const Drink = mongoose.model("drink", menuSchema);
const List = mongoose.model("list", listSchema);
const Order = mongoose.model("orderlist", listSchema);
const User = mongoose.model("User", userSchema);

User.insertMany({ username: 'cluckitchen', password: '12345'});

const main1 = new Main({
    name: "Fried Chicken",
    description: "thin and crispy crust",
    price: 350,
    imgsrc: "/images/fried.jpeg",
    status: "",
    next: ""
});

const main2 = new Main({
    name: "Hot Fried Chicken",
    description: "thin, crispy, and spicy crust",
    price: 370,
    imgsrc: "/images/hotfried.jpeg",
    status: "",
    next: ""
});

const main3 = new Main({
    name: "Shocking Hot Chicken",
    description: "super hot spicy chicken that makes you cry",
    price: 420,
    imgsrc: "/images/shockinghot.jpeg",
    status: "",
    next: ""
});

const main4 = new Main({
    name: "Red Mayo Chicken",
    description: "fried chicken with special mayonnaise sauce",
    price: 450,
    imgsrc: "/images/redmayo.jpeg",
    status: "",
    next: ""
});

const main5 = new Main({
    name: "Creamy Onion Chicken",
    description: "fried chicken with fresh onion and sour cream sauce",
    price: 420,
    imgsrc: "/images/creamyonion.jpeg",
    status: "",
    next: ""
});

const main6 = new Main({
    name: "Cheese Snowing Chicken",
    description: "fried chicken with cheesep owder",
    price: 420,
    imgsrc: "/images/cheesesnowing.jpeg",
    status: "",
    next: ""
});

const side1 = new Side({
    name: "Cheese Ball",
    description: "chewy and savory cheese surrounded by crunchy crust",
    price: 65,
    imgsrc: "/images/cheeseball.jpeg",
    status: "",
    next: ""
});

const side2 = new Side({
    name: "French Fries",
    description: "soft and crispy french fries",
    price: 65,
    imgsrc: "/images/frenchfries.jpeg",
    status: "",
    next: ""
});

const side3 = new Side({
    name: "Tteokbokki",
    description: "a popular Korean food made of rice cake and red pepper paste",
    price: 100,
    imgsrc: "/images/tteokbokki.jpeg",
    status: "",
    next: ""
});

const sauce1 = new Sauce({
    name: "Shocking Hot Sauce",
    description: "super hot spicy sauce",
    price: 20,
    imgsrc: "/images/shockinghotsauce.jpeg",
    status: "",
    next: ""
});

const sauce2 = new Sauce({
    name: "Red Mayo Sauce",
    description: "special mayonnaise sauce",
    price: 20,
    imgsrc: "/images/redmayosauce.jpeg",
    status: "",
    next: ""
});

const sauce3 = new Sauce({
    name: "Creamy Onion Sauce",
    description: "sour cream sauce",
    price: 20,
    imgsrc: "/images/creamyonionsauce.jpeg",
    status: "",
    next: ""
});

const drink1 = new Drink({
    name: "Coke",
    description: "",
    price: 25,
    imgsrc: "/images/coke.png",
    status: "",
    next: ""
});

const drink2 = new Drink({
    name: "Sprite",
    description: "",
    price: 25,
    imgsrc: "/images/sprite.png",
    status: "",
    next: ""
});

const maindish = [main1, main2, main3, main4, main5, main6];
const sidedish = [side1, side2, side3];
const saucemenu = [sauce1, sauce2, sauce3];
const drinkmenu = [drink1, drink2];


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

app.get('/maindish', function(req, res) {
    Main.find({}, function (err, main) {
        if (main.length === 0) {
            Main.insertMany(maindish, function(err) {
                if (err)
                    console.log(err);
            });
            res.redirect("/maindish");
        } else {
            MongoClient.connect(url, function(err, db) {
                var dataBase = db.db("cluckcluckDB");
            
                dataBase.collection("lists").find({ table: selectedTable }).toArray(function (err, orders) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('maindish', { table: selectedTable, mainMenus: main, orderLists: orders[0].order });
                    }
                });
            });
        }
    });
})

app.get('/sidedish', function(req, res) {
    Side.find({}, function (err, side) {
        if (side.length === 0) {
            Side.insertMany(sidedish, function(err) {
                if (err)
                    console.log(err);
            });
            res.redirect("/sidedish");
        } else {
            MongoClient.connect(url, function(err, db) {
                var dataBase = db.db("cluckcluckDB");
            
                dataBase.collection("lists").find({ table: selectedTable }).toArray(function (err, orders) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('sidedish', { table: selectedTable, sideMenus: side, orderLists: orders[0].order });
                    }
                });
            });
        }
    });
})

app.get('/sauce', function(req, res) {
    Sauce.find({}, function (err, sauce) {
        if (sauce.length === 0) {
            Sauce.insertMany(saucemenu, function(err) {
                if (err)
                    console.log(err);
            });
            res.redirect("/sauce")
        } else {
            MongoClient.connect(url, function(err, db) {
                var dataBase = db.db("cluckcluckDB");
            
                dataBase.collection("lists").find({ table: selectedTable }).toArray(function (err, orders) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('sauce', { table: selectedTable, sauceMenus: sauce, orderLists: orders[0].order });
                    }
                });
            });
        }
    });
})

app.get('/drink', function(req, res) {
    Drink.find({}, function (err, drink) {
        if (drink.length === 0) {
            Drink.insertMany(drinkmenu, function(err) {
                if (err)
                    console.log(err);
            });
            res.redirect("/drink")
        } else {
            MongoClient.connect(url, function(err, db) {
                var dataBase = db.db("cluckcluckDB");
            
                dataBase.collection("lists").find({ table: selectedTable }).toArray(function (err, orders) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('drink', { table: selectedTable, drinkMenus: drink, orderLists: orders[0].order });
                    }
                });
            });
        }
    });
})

app.post("/maindish", function (req, res) {
    var newItemName = (req.body.add);
    var deleteItem = (req.body.remove);
    var orderConfirm = (req.body.confirm);
    
    MongoClient.connect(url, function(err, db) {
        var dataBase = db.db("cluckcluckDB");
        var query = { name: newItemName };
        dataBase.collection("mains").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err)
            } else {
                const newItem = new List({
                    table: selectedTable,
                    order: result
                });
                List.updateOne({ table: selectedTable }, { $push: { order: result } }, function (err) {
                    if (err) 
                        console.log(err);
                });
            }
        });
    });

    List.updateOne({ table: selectedTable }, { $pull: { order: { _id: deleteItem } } }, function (err) {
        if (err) 
            console.log(err);
    });

    if (orderConfirm === selectedTable) {
        MongoClient.connect(url, function(err, db) {
            var dataBase = db.db("cluckcluckDB");

            dataBase.collection("lists").find({ table: selectedTable }).toArray(function (err, orders) {
                if (err) {
                    console.log(err)
                } else {
                    var total = 0;
                    for (i = 0; i < orders[0].order.length; i++) {
                        total += orders[0].order[i].price;
                        orders[0].order[i].status = "Queue";
                        orders[0].order[i].next = "Cook";
                    }

                    const newOrder = new List({
                        table: selectedTable,
                        order: orders[0].order
                    });

                    Order.insertMany(newOrder, function(err) {
                        if (err)
                            console.log(err);
                    });

                    res.render('confirmed', { table: selectedTable, total: total, orderLists: orders[0].order });
                }
            });
        });
    } else {
        res.redirect("/maindish");
    }
});

app.post("/sidedish", function (req, res) {
    var newItemName = (req.body.add);
    var deleteItem = (req.body.remove);
    var orderConfirm = (req.body.confirm);

    MongoClient.connect(url, function(err, db) {
        var dataBase = db.db("cluckcluckDB");
        var query = { name: newItemName };
        dataBase.collection("sides").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err)
            } else {
                const newItem = new List({
                    table: selectedTable,
                    order: result
                });
                List.updateOne({ table: selectedTable }, { $push: { order: result} }, function (err) {
                    if (err) 
                        console.log(err);
                });
            }
        });
    });

    List.updateOne({ table: selectedTable }, { $pull: { order: { _id: deleteItem } } }, function (err) {
        if (err) 
            console.log(err);
    });

    if (orderConfirm === selectedTable) {
        MongoClient.connect(url, function(err, db) {
            var dataBase = db.db("cluckcluckDB");

            dataBase.collection("lists").find({ table: selectedTable }).toArray(function (err, orders) {
                if (err) {
                    console.log(err)
                } else {
                    var total = 0;
                    for (i = 0; i < orders[0].order.length; i++) {
                        total += orders[0].order[i].price;
                        orders[0].order[i].status = "queue";
                        orders[0].order[i].next = "Cook";
                    }

                    const newOrder = new List({
                        table: selectedTable,
                        order: orders[0].order
                    });

                    Order.insertMany(newOrder, function(err) {
                        if (err)
                            console.log(err);
                    });

                    res.render('confirmed', { table: selectedTable, total: total, orderLists: orders[0].order });
                }
            });
        })
    } else {
        res.redirect("/sidedish");
    }
});

app.post("/sauce", function (req, res) {
    var newItemName = (req.body.add);
    var deleteItem = (req.body.remove);
    var orderConfirm = (req.body.confirm);

    MongoClient.connect(url, function(err, db) {
        var dataBase = db.db("cluckcluckDB");
        var query = { name: newItemName };
        dataBase.collection("sauces").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err)
            } else {
                const newItem = new List({
                    table: selectedTable,
                    order: result
                });
                List.updateOne({ table: selectedTable }, { $push: { order: result} }, function (err) {
                    if (err) 
                        console.log(err);
                });
            }
        });
    });

    List.updateOne({ table: selectedTable }, { $pull: { order: { _id: deleteItem } } }, function (err) {
        if (err) 
            console.log(err);
    });

    if (orderConfirm === selectedTable) {
        MongoClient.connect(url, function(err, db) {
            var dataBase = db.db("cluckcluckDB");

            dataBase.collection("lists").find({ table: selectedTable }).toArray(function (err, orders) {
                if (err) {
                    console.log(err)
                } else {
                    var total = 0;
                    for (i = 0; i < orders[0].order.length; i++) {
                        total += orders[0].order[i].price;
                        orders[0].order[i].status = "queue";
                        orders[0].order[i].next = "Cook";
                    }

                    const newOrder = new List({
                        table: selectedTable,
                        order: orders[0].order
                    });

                    Order.insertMany(newOrder, function(err) {
                        if (err)
                            console.log(err);
                    });

                    res.render('confirmed', { table: selectedTable, total: total, orderLists: orders[0].order });
                }
            });
        })
    } else {
        res.redirect("/sauce");
    }
});

app.post("/drink", function (req, res) {
    var newItemName = (req.body.add);
    var deleteItem = (req.body.remove);
    var orderConfirm = (req.body.confirm);

    MongoClient.connect(url, function(err, db) {
        var dataBase = db.db("cluckcluckDB");
        var query = { name: newItemName };
        dataBase.collection("drinks").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err)
            } else {
                const newItem = new List({
                    table: selectedTable,
                    order: result
                });
                List.updateOne({ table: selectedTable }, { $push: { order: result} }, function (err) {
                    if (err) 
                        console.log(err);
                });
            }
        });
    });

    List.updateOne({ table: selectedTable }, { $pull: { order: { _id: deleteItem } } }, function (err) {
        if (err) 
            console.log(err);
    });

    if (orderConfirm === selectedTable) {
        MongoClient.connect(url, function(err, db) {
            var dataBase = db.db("cluckcluckDB");

            dataBase.collection("lists").find({ table: selectedTable }).toArray(function (err, orders) {
                if (err) {
                    console.log(err)
                } else {
                    var total = 0;
                    for (i = 0; i < orders[0].order.length; i++) {
                        total += orders[0].order[i].price;
                        orders[0].order[i].status = "queue";
                        orders[0].order[i].next = "Cook";
                    }

                    const newOrder = new List({
                        table: selectedTable,
                        order: orders[0].order
                    });

                    Order.insertMany(newOrder, function(err) {
                        if (err)
                            console.log(err);
                    });

                    res.render('confirmed', { table: selectedTable, total: total, orderLists: orders[0].order });
                }
            });
        })
    } else {
        res.redirect("/drink");
    }
});

app.get('/kitchen', function(req, res) {
    res.render('kitchen', { error: false });
});

app.post('/kitchen', function (req, res) {
    var userId = (req.body.id)
    var userPw = (req.body.pw)

    MongoClient.connect(url, function (err, db) {
        var dataBase = db.db('cluckcluckDB');

        dataBase.collection('users').find().toArray(function (err, login) {
            if (login[0].username === userId && login[0].password === userPw) {
                Order.find({}, function (err, list) {
                    res.render('order', { table: selectedTable, orderLists: list });
                });
            } 
        })
    })
})

app.post("/status", function (req, res) {
    var changetocook = (req.body.cook)

    MongoClient.connect(url, function (err, db) {
        var dataBase = db.db('cluckcluckDB');

        dataBase.collection('orderlists').find({ "order.$[].name": changetocook }).toArray(function (err, orders) {
            Order.updateOne({ "order.name": changetocook }, { $set: { "order.$[].status": "Cooking", "order.$[].next": "Serve" } }, function (err) {
                if (err) 
                    console.log(err);
            });

            Order.find({}, function (err, list) {
                res.render('order', { table: selectedTable, orderLists: list });
            });
        })
    })
})

app.get("/receipt", function (req, res) {
    MongoClient.connect(url, function(err, db) {
        var dataBase = db.db("cluckcluckDB");

        dataBase.collection("orderlists").find({ table: selectedTable }).toArray(function (err, orders) {
            if (err) {
                console.log(err)
            } else {
                var total = 0;
                for (i = 0; i < orders[0].order.length; i++) {
                    total += orders[0].order[i].price;
                }
                res.render('receipt', { table: selectedTable, total: total, orderLists: orders[0].order });
            }
        });
    })
})

app.get("/thankyou", function (req, res) {
    res.render("thankyou")
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});