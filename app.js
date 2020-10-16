var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Insta = require("instamojo-nodejs");
var json = require('json');

var API_KEY = "test_f4af45051ca7a9fdc1756caf474" ;

var AUTH_KEY = "test_9b2e54ff55e2b03d1af3afedfe3" ;

Insta.setKeys(API_KEY, AUTH_KEY);

Insta.isSandboxMode(true);

app.use(express.static('views'));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index.ejs');
});
app.get('/form', function (req, res) {
    res.render('details.ejs');
})
app.post('/pay', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var amount = req.body.amount;

    var data = new Insta.PaymentData();

    const REDIRECT_URL = "http://localhost:3000/success";

    data.setRedirectUrl(REDIRECT_URL);
    data.send_email = "True";
    data.purpose = "Test"; // REQUIRED
    data.amount = amount;
    data.name = name;
    data.email = email; // REQUIRED

    Insta.createPayment(data, function (error, response) {
        if (error) {
            // some error
            console.log(err);
        } else {
            console.log(response);
            console.log(data);
            const x = JSON.parse(response);
            const y = x.payment_request.longurl;
            // Payment redirection link at response.payment_request.longurl
            
            res.redirect(y);
        }
    });
});


app.get('/success',function(req,res){

    res.render('success.ejs');
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started");
});