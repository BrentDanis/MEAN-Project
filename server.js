var express = require('express');
var app = express();
var bodyParser = require('body-parser');  // Require body-parser (to receive post data from clients)
app.use(bodyParser.urlencoded({ extended: true })); // Integrate body-parser with our App

app.use(bodyParser.json());


var path = require('path'); // Require path

app.use(express.static( __dirname + '/petBeltExam/dist/petBeltExam' ));


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/petsDb');
var PetSchema = new mongoose.Schema({
    petName: { type: String, required: true },
    petType: { type: String, required: true },
    description: { type: String, required: true },
    skillone: {type:String, default: ''},
    skilltwo: {type:String, default:''},
    skillthree: {type:String, default: ''},
    likes: {type: Number, default: 0},
    //quotes: [{type: mongoose.Schema.ObjectId, ref: "Quote"}]

}, {timestamps: true });
//placeholder secondary schema
// var QuoteSchema = new mongoose.Schema({
//     quotes: {type: String, required: true },
//     votes: {type: Number, default: 0 },
// }, {timestamps: true });


const Pet = mongoose.model('Pet', PetSchema);
//const Quote = mongoose.model('Quote', QuoteSchema);

// Use native promises
mongoose.Promise = global.Promise;


// Routes
// 1. Retrieve all Pets
app.get('/pets', function (req, res) {
    Pet.find({}, function (err, data) {
        if (err) {
            console.log("Returned error", err);
            res.json({ message: "Error", error: err });
        } else {
            res.json(data);
        }
    })
})

// 2. Retrieve one Pet by ID
app.get('/pets/:id', function (req, res) {
    Pet.findOne({ _id: req.params.id }, function (err, data) {
        if (err) {
            console.log("Returned error", err);
            res.json({ message: "Error", error: err });
        } else {
            res.json(data);
        }
    })
})

// 3. Create a Pet
app.post('/pets', function (req, res) {
    console.log("POST /pets");
    console.log(req.body);
    var pet = new Pet(req.body);

    pet.save(function (err) {
        if (err) {
            res.json({ message: "Error", error: err })
        } else {
            res.json({ message: "Success", data: pet })
        }
    })

})

// 4. Update a Pet by ID
app.put('/pets/:id', function (req, res) {
    var obj = {};
    if (req.body.petName) { //if in the body your passing a new firstName.
        obj['petName'] = req.body.petName;
    }
    if (req.body.petType) {
        obj['petType'] = req.body.petType;
    }
    obj['updated_at'] = Date.now();
    Pet.update({ _id: req.params.id }, {
        $set: obj
    }, function (err, data) {
        if (err) {
            res.json({ message: "Error", error: err })
        } else {
            res.json({ message: "Success", data: data })
        }
    });
})

// // 5. Delete a Pet by ID
app.delete('/pets/:id', function (req, res) {
    Pet.remove({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ message: "Error", error: err })
        } else {
            res.json({ message: "Success"})
        }
    });
})

// Create a Quote from second schema to push to data base
// app.post('/quotes/:id', function (req, res) {
//     console.log("POST /quotes");
//     console.log(req.body);
//     var newquote = new Quote(req.body);
//     var authorId = req.params.id;
//     Author.findOne({_id: authorId}, function(err, authordata){
//         if(err) {
//             console.log('returned error', err);
//             res.json({ message: "Error", error: err })
//         } else {
//             console.log(authordata);
//             console.log("######\n", newquote._id, "######\n", newquote, "######\n", newquote.quotes, "######\n");
//             authordata.quotes.push(newquote); //author schema, find quotes, and push to newquote
//             authordata.save(authordata);
//             newquote.save(function (err) {
//                 if (err) {
//                     res.json({ message: "Error", error: "There was an error saving your quote" })
//                 } else {
//                     console.log("######\n", newquote._id, "######\n", newquote, "######\n", newquote.quotes, "######\n");
//                     res.json({ message: "Success", data: newquote })
//                 }
//             })
//         }
//     })
// })

// // Retrieve Quote from second schema
// app.get('/quotes', function (req, res) {
//     Quote.find({}, function (err, data) {
//         if (err) {
//             console.log("Returned error", err);
//             res.json({ message: "Error", error: err });
//         } else {
//             res.json(data);
//         }
//     })
// })


// Setting our Server to Listen on Port: 9991
app.listen(9991, function () {
    console.log("listening to tunes on port 9991");
})
