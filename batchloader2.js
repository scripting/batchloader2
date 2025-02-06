const myVersion = "0.4.0", myProductName = "batchloader2"; 

const fs = require ("fs");
const utils = require ("daveutils");
const davehttp = require ("davehttp");
const s3folderloader = require ("s3folderloader");

const servername = "dallas";

var config = {
	port: process.env.PORT || 1408,
	flLogToConsole: true,
	flAllowAccessFromAnywhere: true, 
	timeOutSecs: 3,
	s3path: "/allservers.scripting.com/" + servername + "/pagepark/",
	basefolder: "/root/" + servername + "/pagepark/"
	}

function readConfig (f, config, callback) {
	fs.readFile (f, function (err, jsontext) {
		if (!err) {
			try {
				var jstruct = JSON.parse (jsontext);
				for (var x in jstruct) {
					config [x] = jstruct [x];
					}
				}
			catch (err) {
				console.log ("Error reading " + f);
				}
			}
		callback ();
		});
	}

readConfig ("config.json", config, function ()  {
	console.log ("config == " + utils.jsonStringify (config));
	davehttp.start (config, function (theRequest) {
		function returnOpml (opmltext) {
			theRequest.httpReturn (200, "text/xml", opmltext);
			}
		function returnData (jstruct) {
			if (jstruct === undefined) {
				jstruct = {};
				}
			theRequest.httpReturn (200, "application/json", utils.jsonStringify (jstruct));
			}
		function returnError (jstruct) {
			theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
			}
		function httpReturn (err, jstruct) {
			if (err) {
				returnError (err);
				}
			else {
				returnData (jstruct);
				}
			}
		switch (theRequest.lowerpath) {
			case "/now":
				theRequest.httpReturn (200, "text/plain", new Date ().toUTCString ());
				return;
			case "/reload":
				s3folderloader.load (config.s3path, config.basefolder, function (jsontext) {
					returnData (JSON.parse (jsontext));
					});
				return;
			default:
				theRequest.httpReturn (404, "text/plain", "Not found.");
				return;
			}
		});
	});


