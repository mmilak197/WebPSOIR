
	var os = require("os");
var crypto = require('crypto');
var fs = require('fs');

//obiekt do obsługi simple DB z aws-sdk
//var simpledb = new AWS.SimpleDB();
//GraphicsMagic
//var gm = require('gm');

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
				if(err) { callback(err); return; }
				console.log(data.Body)



				var data = data.Body.split(":");

				var params = {
 					Bucket: data[0], /* required */
  					Key: data[1]/* required */
				};

				var s3 = new AWS.S3(); 

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