const myVersion = "0.4.0", myProductName = "batchloader2"; 

const fs = require ("fs");
const utils = require ("daveutils");
const davehttp = require ("davehttp");
const s3folderloader = require ("s3folderloader");

const servername = "peru";

var config = {
	port: process.env.PORT || 1408,
	flLogToConsole: true,
	flAllowAccessFromAnywhere: true, 
	timeOutSecs: 3,
	s3path: "/allservers.scripting.com/" + servername + "/pagepark/",
	basefolder: "/root/" + servername + "/pagepark/"
	}

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
