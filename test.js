const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello World</h1>');
	
/*
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
*/
	
	
	
	

	
});

server.listen(port,() => {
  console.log(`Server running at port `+port);
});