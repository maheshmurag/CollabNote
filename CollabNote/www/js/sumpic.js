/*var summary = require('node-summary');
var url = require('url');
var https = require('https');

// Demo sample using ABBYY Cloud OCR SDK from Node.js

if (typeof process == 'undefined' || process.argv[0] != "node") {
    throw new Error("This code must be run on server side under NodeJS");
}

var appId = 'Quill for Mobile';
var password = 'T73GfohlMZywYvLo8k/ojnpF';

try {
    var ocrsdkModule = require('./ocrsdk.js');
    var ocrsdk = ocrsdkModule.create(appId, password);
    ocrsdk.serverUrl = "http://cloud.ocrsdk.com"; // change to https for secure connection
} catch (err) {
    console.log("Error: " + err.message);
}

function imageToText(imagePath, userCallback) {
    //userCallback = function(error, data) { ... }
    //data will be a string
    
    function downloadUrl(resultUrl) {
	var buffers = [];
	var parsed = url.parse(resultUrl);
	var req = https.request(parsed, function(response) {
	    response.on('data', function(data) {
		buffers.push(data);
	    });
	    response.on('end', function() {
		var concatd = Buffer.concat(buffers);
		var toStr = concatd.toString('utf8');
		userCallback(null, toStr);
	    });
	});
	req.on('error', function(e) {
	    userCallback(error);
	});
	req.end();
    }
    
    function processingCompleted(error, taskData) {
	if (error) {
	    console.log("Error: " + error.message);
	    return;
	}
	if (taskData.status != 'Completed') {
	    console.log("Error processing the task.");
	    if (taskData.error) {
		console.log("Message: " + taskData.error);
	    }
	    return;
	}
	
	console.log("Processing completed.");
	downloadUrl(taskData.resultUrl.toString());
	//	ocrsdk
	//	    .downloadResult(taskData.resultUrl.toString(), outputPath,
	//			    downloadCompleted);
    }
    
    function uploadCompleted(error, taskData) {
	if (error) {
	    console.log("Error: " + error.message);
	    return;
	}
	console.log("Upload completed.");
	console.log("Task id = " + taskData.id + ", status is " + taskData.status);
	if (!ocrsdk.isTaskActive(taskData)) {
	    console.log("Unexpected task status " + taskData.status);
	    return;
	}
	ocrsdk.waitForCompletion(taskData.id, processingCompleted);
    }
    try {
	var settings = new ocrsdkModule.ProcessingSettings();
	settings.language = "English"; // Can be comma-separated list, e.g. "German,French".
	settings.exportFormat = "txt"; // All possible values are listed in 'exportFormat' parameter description 
	// at http://ocrsdk.com/documentation/apireference/processImage/
	console.log("Uploading image..");
	ocrsdk.processImage(imagePath, settings, uploadCompleted);
    } catch (err) {
	console.log("Error: " + err.message);
    }
}

function imageToSentenceList(imagePath, numSentences, userCallback) {
  imageToText(imagePath,
              function(err, data) {
                if (err) { userCallback(err); return; }
                summary.getSortedSentences(data, numSentences, userCallback);)
              });
}

function imageToSummary(imagePath, userCallback) {
  imageToText(imagePath, function(err, data) {
    if (err) { 
    	userCallback(err); return; 
    }
    summary.summarize('', data, userCallback);
  });
}
*/