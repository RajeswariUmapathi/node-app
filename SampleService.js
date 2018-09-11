//var http = require("http");
const bodyParser = require("body-parser");
const app = require("express")();
const jwt = require('jsonwebtoken');
const lodash = require('lodash');
app.set('secretKey', 'secretToken');
var validUsers = ['Rajeswari', 'test', 'Pavithra'];

/*
http.createServer(function(req, res){
	res.write("Hello Rajeswari!!!");
	res.end();
}).listen(8080);
*/

app.get("/", function(req, res) {
	res.send("Hello Rajeswari!!!");
});

app.get("/login", function(req, res) {
	res.sendFile('/login/templates/login.html', { root: __dirname });
});

app.use(bodyParser.json());
app.post("/token", function(req, res) {
	//req.setHeader('Content-type', 'application/json');
	const JWTToken = jwt.sign({
		userName: req.body.userName,
		password: req.body.password
	}, app.get('secretKey'), {
    	expiresIn: '1h'
    });
	res.setHeader('x-access-token', JWTToken);
	res.send("SUCCESS");
});

app.get('/getToken', function(req, res) {
	var token = req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, app.get('secretKey'), function(err, decodeToken) {
			if (err) {
				res.json({success: false, message: 'Failed to Authenticate'});
			} else {
				var decodedObject = jwt.decode(token);
				if( lodash.includes(validUsers, decodedObject.userName) ) {
					console.log(decodedObject.userName);
					res.send("Token Decoded Successfully");
				}
			}
		});
	}
});
module.exports.express = app;

app.listen(3000);