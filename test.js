var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('Hello World!');
console.log("Server Setup: Sucess");
	

var mongo=require('mongodb');
var MongoClient=mongo.MongoClient;
var url = "mongodb+srv://nexus:nexus@nexusmovies.ka2cn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
	
MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if(err) { console.log("Connection err: " + err); return; }
    var dbo = db.db("reviews");
    var collection = dbo.collection('movies');
	
	collection.find().toArray(function(err, items){
		if(err){
			console.log("Error: No Movie Found" + err);
		} else {
			console.log("Items Length: " + items.length);
			for(var i = 0; i < items.length; i++){
				console.log(items[i].user);
			}
		}
	})
   });
	
	
	
	
	

	
	
  res.end();
}).listen(8080);