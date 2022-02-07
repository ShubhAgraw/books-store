const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookUsersDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
  name : String,
  age : Number,
  email : String,
  password : String,
  address : String,
  books : [{
    id : Number,
    name : String,
    price : Number,
    quantity : Number
  }]

});

const User = mongoose.model("Users" , userSchema);


const app = express();

app.set("view engine", "ejs");



app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/", function(req, res)
{
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup", function(req, res)
{
  res.sendFile(__dirname + "/signup.html");
});

app.get("/main", function(req, res)
{

  User.find({email : mail}, function(err, data){
      var books = data[0].books;
      res.render("main", {name : username , books : books});
  })
});

app.post("/main", function(req, res)
{
  User.find({email : mail}, function(err, data){
      var books = data[0].books;
      res.render("main", {name : username , books : books});
  })
})
var username;
var address;
var books;
var mail;
app.post("/", function(req, res)
{

  mail = req.body.email;
  var password = req.body.password;
  User.find({email : mail}, function (err, docs) {
    if(docs.length > 0)
    {
      if(docs[0].password == password){
        username = docs[0].name;
        address = docs[0].address;
        books = docs[0].books;
        res.redirect("http://localhost:3000/main");
      }
      else{
        res.redirect("http://localhost:3000/#login");
      }
    }
    else{
      res.redirect("http://localhost:3000/#login");
    }

  });
})


const nameArray = ["War and Peace", "The last wish", "Everyone brave is forgiven", "Less", "Harry Potter", "To kill a Mochingbird", "Infinite jest" , "The Handmaids tale", "Song of Solomon"];
const priceArray = [27, 12, 21, 18, 14, 12, 25, 19, 11];

app.post("/addInCart", function(req, res){
  var books ;
  User.find({email : mail }, function(err, docs){
    books = docs[0].books;
    var id = req.body.data;
    if(books.length == 0)
    {
      var newBook = {
        id : id,
        name : nameArray[id - 1],
        price : priceArray[id - 1],
        quantity : 1
      }

      books.push(newBook);
      User.updateOne({email : mail}, {books : books}, function(err){

      });


    }
    else{
      var found = false;
      var index = 0;
      for(var i = 0; i < books.length ; i++)
      {
        if(books[i].id == id)
        {
          found = true;
          index = i;
          break;
        }
      }

      if(found)
      {
        var newBook = {
          id : id,
          name : nameArray[id - 1],
          price : priceArray[id - 1],
          quantity : books[i].quantity + 1
        }

        books[i] = newBook;

      }else{
        var newBook = {
          id : id,
          name : nameArray[id - 1],
          price : priceArray[id - 1],
          quantity : 1
        }
        books.push(newBook);
      }
      User.updateOne({email : mail}, {books : books}, function(err){

      });
    }
      res.render("main", {name : username , books : books});
  })


})

app.post("/remove", function(req, res){
  var id = req.body.data;
  User.find({email : mail} , function(err, data){
    var books = data[0].books;
    var index;
    for(var i = 0 ; i < books.length; i++)
    {
      if(books[i].id == id)
      {
        index = i;
        break;
      }
    }
    if(books[i].quantity == 1)
    {
      if(i == 0)
      {
        books.shift();
      }
      else if( i == books.length - 1)
      {
        books.pop();
      }
      else{
        books.splice(i,i);
      }
    }else{
      var newBook = {
        id : id,
        name : nameArray[id - 1],
        price : priceArray[id - 1],
        quantity : books[i].quantity - 1
      }

      books[index] = newBook;
    }

    User.updateOne({email : mail}, {books : books}, function(err){

    });
    res.render("main", {name : username , books : books});

  })
})

app.post("/transaction", function(req, res)
{
      User.updateOne({email : mail}, {books : []}, function(err){

      });
  mail = "";
  password = "";
  res.redirect("http://localhost:3000");

})

app.post("/toCheckout", function(req, res)
{
  User.find({email : mail}, function(err, data){
      var books = data[0].books;
      res.render("checkout", {name : username , books : books});
  })

})

app.post("/logout", function(req, res){
  mail = "";
  password = "";
  res.redirect("http://localhost:3000");
})

app.post("/signup", function(req, res){
  const name = req.body.name;
  const mail = req.body.mail;
  const password = req.body.password;
  const age = req.body.age;
  const address = req.body.address;
  const user = new User({
    name : name,
    email : mail,
    password : password,
    age : age,
    address : address,
    books : []
  });
  user.save();
  res.redirect("http://localhost:3000/#login");

})
app.listen(3000, function()
{
  console.log("Server Started");
});
