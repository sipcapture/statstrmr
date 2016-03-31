/*  statstrmr PoC 		*/
/*  (c) 2016 QXIP BV 		*/
/*  http://qxip.net 		*/

var fs = require("fs");
var _config_ = require("./config");

var version = '0.0.2';
var debug = false;
var exit = false;
var stats = {rcvd: 0, parsed: 0, sent: 0, err: 0 }; 

console.log("statstrmr v"+version+" (http://sipcapture.org)");
console.log("Press CTRL-C to Exit...");

if (!_config_.API_SERVER) { console.log('missing server configuration!'); process.exit(0); }
if (!_config_.API_PATH) { console.log('missing path configuration!'); process.exit(0); }

if(process.argv.indexOf("-d") != -1){
    debug = true;
}

if(process.argv.indexOf("-c") != -1){
    _config_ = require(process.argv[process.argv.indexOf("-c") + 1]); 
}

var logs = _config_.LOGS;
var scripts = _config_.SCRIPTS;

/* REQUEST */

request = require('request-json');
var client = request.createClient(_config_.API_SERVER);

/* SCRIPTS */
if (scripts && scripts.length > 0){

	// Start executing all scripts in config.SCRIPTS array
	for (var i = 0; i < scripts.length; i++) {
		console.log("["+new Date+"]"+ " Executing '"+scripts[i].name+"' ("+scripts[i].timer+")");
		if (scripts[i].exec && scripts[i].timer){
			(function(index) {
			  	setInterval(function(){
			    	     stats.rcvd++;
				     try {
					     var data = JSON.parse(scripts[index].exec());
				     } catch(err) { console.log('parsing error!'); return; }
				     stats.parsed++;
			    	     var datenow =  new Date().getTime();
				     if (debug) console.log('LINE:',data);
				     try {
						if (debug) console.log(data);
						// post string to API server
						client.post(_config_.API_PATH, data, function(err, res, body) {
						  if (err) { stats.err++; if (debug) console.log(err);
						  } else { stats.sent++; if (debug) console.log(res.statusCode); }
						});

				     } catch (err) {
					    stats.err++; if (debug) console.log(err)
			             }

				}, scripts[i].timer);
			})(i);
		}
	}

}

/* LOGS */
if (logs && logs.length > 0){

	// Start watching all files in config.LOGS array
	for (var i = 0; i < logs.length; i++) {
	   watchFile(logs[i]);
	}

	// Main functions  
	function watchFile(logSet){
	  var path = logSet.path;
	  // get current file-size...
	  var currSize = fs.statSync(path).size;
	  console.log("["+new Date+"]"+ " Watching '"+path+"' ("+currSize+")");

	  // now watch every x msec for file-size changes...
	  setInterval(function(){
	    var newSize = fs.statSync(path).size;
	    if (newSize > currSize) {
	      // additions were applied to file...
	      readChanges(logSet, currSize, newSize);
	      currSize = newSize;
	    }
	    else {
	      // deletions were applied to file
	      if (newSize < currSize) {
	        currSize = newSize;
	      }
	    }
	  }, 1000);
	}

	function readChanges(logSet, from, to){
	  var file = logSet.path;
	  var tag = logSet.tag;
	  var host = logSet.host;
	  var pattern = logSet.pattern;
	  var rgx = new RegExp(_config_.pattern, "");

	  var rstream = fs.createReadStream(file, {
	    encoding: 'utf8',
	    start: from,
	    end: to
	  });
	  rstream.on('data', function(chunk) {
	    var last = "";
	    data = chunk.trim();
	    var lines, i;

	    lines = (last+chunk).split("\n");
	    for(i = 0; i < lines.length - 1; i++) {
	    	     var datenow =  new Date().getTime();
	    	     stats.rcvd++;
		     // if (debug) console.log('LINE:',lines[i]);
		     try {
		       	     var doc = JSON.parse(lines[i]);
			     if (doc.type == pattern || doc.type.match(pattern)) {
				// post process string
				doc.host = host;
				stats.parsed++;
				if (debug) console.log(doc);
				// post string to API server
				client.post(_config_.API_PATH, doc, function(err, res, body) {
				  if (err) { stats.err++; if (debug) console.log(err); 
				  } else { stats.sent++; if (debug) console.log(res.statusCode); }
				});

			     }
		     } catch (err) {
			    stats.err++; if (debug) console.log(err)
	             }
	    }

	  });
	}
}


/* Exit */

process.on('SIGINT', function() {
    console.log();
    console.log('Stats:',stats);
    if (exit) {
    	console.log("Exiting...");
        process.exit();
    } else {
    	console.log("Press CTRL-C within 2 seconds to Exit...");
        exit = true;
	setTimeout(function () {
    	  // console.log("Continuing...");
	  exit = false;
	}, 2000)
    }
});
