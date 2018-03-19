var monitor = require('active-window')
var fs = require("fs")
var file = "worklog.db"
var exists = fs.existsSync(file)
var sqlite3 = require("sqlite3").verbose()
var db = new sqlite3.Database(file)

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE log (app TEXT, title TEXT, start INT, stop INT)")
  }
})

var current = {
	app: "Work-log",
	title: "Just started logging",
	start: Date.now()
}

callback = function(window){
  try {
  	if(current.app !== window.app || current.title !== window.title) {
	    var stmt = db.prepare("INSERT INTO log (app, title, start, stop) VALUES (?, ?, ?, ?)");
	    stmt.run(current.app, current.title, current.start, Date.now())
	    stmt.finalize()
	    current.start = Date.now()
	  	current.app = window.app
	  	current.title = window.title
  	} else {
 	  	current.app = window.app
	  	current.title = window.title	
  	}
    //console.log("App: " + window.app);
    //console.log("Title: " + window.title);
  } catch(err) {
    console.log(err)
  } 
}
/*Watch the active window 
  @callback
  @number of requests; infinity = -1 
  @interval between requests
*/
monitor.getActiveWindow(callback,-1,1)

console.log("Logging work...");
//Get the current active window 
//monitor.getActiveWindow(callback);
