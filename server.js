var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('/mongodb://localhost/swag-shop', { useNewUrlParser: true });


var Product = require('./models/product');
var WishList = require('./models/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/products', function(req, res) {
  var product = new Product();
  product.title = req.body.title;
  product.price = req .body.price;
  product.save(function(err, savedProduct) {
    res.send(savedProduct);
  });
});

app.get('/products', function(req, res) {
  Product.find({}, function(err, products){
    res.send(products);
  })
});

app.post('/wishlist', function(req, res){
  var wishList = new WishList();
  wishList.title = req.body.title;

  wishList.save(function(err, newWishList){
    res.send(newWishList);
  });
});

app.get('/wishlist', function(req, res) {
  WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishLists){
    res.send(wishLists);
  })
});

app.put('/wishlist/add/product', function(req, res) {
  Product.findOne({_id: req.body.productId}, function(err, product) {
    WishList.update({_id: req.body.wishListId}, {$addToSet: {products: product._id}}, function(err, wishList){
      res.send("Added!");
    });
  });
});

app.listen(3000, function() {
  console.log("Swag-shop api on port 3000!");
})
