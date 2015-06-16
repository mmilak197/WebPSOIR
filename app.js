
	var os = require("os");
var crypto = require('crypto');
var fs = require('fs');

//obiekt do obsługi simple DB z aws-sdk
//var simpledb = new AWS.SimpleDB();
//GraphicsMagic
var gm = require('gm');

	var helpers = require("./helpers");
	var Queue = require("queuemanager");
	var SQSCommand = require("./sqscommand");

	var AWS_CONFIG_FILE = "./config.json";
	var APP_CONFIG_FILE = "./app.json";

	
		var AWS = require("aws-sdk");
		AWS.config.loadFromPath(AWS_CONFIG_FILE);		

	//var s3 = new AWS.S3(); 

	var appConfig = helpers.readJSONFile(APP_CONFIG_FILE);
	var queue = new Queue(new AWS.SQS(), appConfig.QueueUrl);
	var sqsCommand = new SQSCommand(queue);
	queue.receiveMessage(function(err, data){
				if(err) { callback(err); return; console.log("Brak wiadomosci")}
				console.log(data.Body) // wyswietla wiadomosc z kolejki SQS
				

// TEST 
				/*var handlerToDelete = data.Messages[0].ReceiptHandle;
				var messageinfo = JSON.parse(data.Messages[0].Body);
				console.log("Otrzymano wiadomosc: bucket - "+messageinfo.bucket+", key - "+messageinfo.key);
				*/
// END TEST

				var data = data.Body.split(":");

				console.log("Otrzymano wiadomosc: bucket - "+data[0]+", key - "+data[1]);
				
				
				var params = {
 					Bucket: 'milak/wait', /* required */
  					Key: data[0].substring(14)/* required */
				};
				//
				var s3 = new AWS.S3(); 
				
				var file = require('fs').createWriteStream('tmp/'+data[0].substring(14));
			var requestt = s3.getObject(params).createReadStream().pipe(file);
			console.log('jestem tu po zapisaniu pliku na dysk');
//
				

				s3.getObject(params, function(err, data) 
				{
  					if (err) console.log(err, err.stack); // an error occurred
					else {
						var algorithms = ['md5','sha1','sha256', 'sha512'];
						var loopCount = 1;
						var doc = data.Body;
	
	
						helpers.calculateMultiDigest(doc,algorithms, 
							function(err, digests) {
								//console.log(digests.join("<br>"));	
							}, 
						loopCount);

						}     // successful response
						});
});