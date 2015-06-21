var os = require("os");
var crypto = require('crypto');
var fs = require('fs');

var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');


//obiekt do obsługi simple DB z aws-sdk
var simpledb = new AWS.SimpleDB();

//obiekt do obsługi simple DB z aws-sdk
//var simpledb = new AWS.SimpleDB();
//GraphicsMagic
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });

	var helpers = require("./helpers");
	var Queue = require("queuemanager");
	var SQSCommand = require("./sqscommand");

	var AWS_CONFIG_FILE = "./config.json";
	var APP_CONFIG_FILE = "./app.json";

	
		var AWS = require("aws-sdk");
		AWS.config.loadFromPath(AWS_CONFIG_FILE);		

	//var s3 = new AWS.S3(); 

	var myServer = function(){
	
	var appConfig = helpers.readJSONFile(APP_CONFIG_FILE);
	var queue = new Queue(new AWS.SQS(), appConfig.QueueUrl);
	var sqsCommand = new SQSCommand(queue);
	queue.receiveMessage(function(err, data){
				if(err) { console.log("Brak wiadomosci na kolejce"); }
				
				else
				{
					

				console.log(data.Body) // wyswietla wiadomosc z kolejki SQS
				

				
				var data = data.Body.split(":");

				console.log("Otrzymano wiadomosc: bucket - "+data[0]+", key - "+data[1]);
				
				var params = {
 					Bucket: 'lab4-weeia', 
  					Key: data[1]
				};
				//
				var s3 = new AWS.S3(); 
				
				var tmpdata = data[1].split("/"); // tmpdata[1] - przetrzymuje mi nazwe pliku
				
				var file = require('fs').createWriteStream('tmp/'+tmpdata[1]);
				var requestt = s3.getObject(params).createReadStream().pipe(file);
				
				requestt.on('finish', function()
				{
					console.log('jestem tu po zapisaniu pliku na dysk');
					
					gm('tmp/'+tmpdata[1])
					.implode(-1.2)
					.contrast(-6)
					.autoOrient()
					.write('tmp/'+tmpdata[1], function (err) {
						if (err) 
						{
							console.log(err);
						}
						
						else
						{
							console.log('Poprawnie przetworzony plik');
					
							var fileStream = require('fs').createReadStream('tmp/'+tmpdata[1]);
						
							fileStream.on('open', function() {
								
								var parsend = {
								Bucket:'lab4-weeia',
								Key: 'milak.processedfile/'+tmpdata[1],
								ACL: 'public-read',
								Body: fileStream,
								};
								
								s3.putObject(parsend, function(err, datasend) {
									
									if(err)
									{
										console.log(err, err.stack);
										
									}
									else
										console.log(datasend);
									console.log('UPLOAD zakonczony pomyslnie !!!');
									
									var parmsimpledb = {
										Attributes: [
											{ 
												Name: data[1],  //pelna sciezka do pliku mateusz.milak/nazwa pliku
												Value: "yes", 
												Replace: true
											}
										],
										DomainName: "mateusz.milak.simpledb", 
										ItemName: 'ITEM001'
									};
									
									simpledb.putAttributes(parmsimpledb, function(err, datasimpledb) {
										
										if(err)
										{
											console.log('Blad zapisu do bazy'+err, err.stack);
										}
										else
										{
											console.log("Zapis do bazy zakonczony pomyslnie");
											
										}
										
									});
									
								});
							});
						
						
						}
				});
				

					
				});
				
	}
				});
		setTimeout(myServer, 10000);
	}

	myServer();
	
	
	
	/*
	//Tworzy domene czyli tabele w bazie	
		
		var paramsXXX = {DomainName: 'mateusz.milak.simpledb'};
		simpledb.createDomain(paramsXXX, function(err, data) {
			if (err) console.log(err, err.stack); 
			else     console.log(data);  
		});
		var paramsXXX = {DomainName: 'mateusz.milak.log'};
		simpledb.createDomain(paramsXXX, function(err, data) {
			if (err) console.log(err, err.stack); 
			else     console.log(data);  
		});
		
		
		//Lista domen
		var paramsXX = {};
		simpledb.listDomains(paramsXX, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     console.log(data);           // successful response
		});
	*/
				
				/*imageMagick('tmp/Desert.jpg').rotate('green', 45).write('tmp/Deserttt.jpg', function (err) {
		if (!err) console.log('UDALO SIE !!!');
    else 
	{
		console.log(err);
		console.log('BLAD !!!');
	}
		});*/
		

				
				//gm('tmp/'+tmpdata[1])
				/*gm('tmp/Desert.jpg')
				.implode(-1.2)
				.contrast(-6)
				.autoOrient()
				.write('tmp/ppp.jpg', function (err) {
					if (err) 
					{
						console.log(err);
					}
				});*/
				
			
				
//
				
			//POBIERA MI WIADOMOSC Z KOLEJKI
				/*s3.getObject(params, function(err, data) 
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
						});*/
