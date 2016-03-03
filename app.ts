import express = require('express');
var sensor = require('ds18x20');
var gpio = require('pi-gpio');
var app = express();
var server = app.listen(8334, function(){
    console.log("Lyssnar");
});

var io = require('socket.io').listen(server);

app.use(express.static('scripts'));
app.use(express.static('node_modules'))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

gpio.close(22, function(er){
console.log("close");
console.log(er);

op();

});

function op(){
	gpio.open(22, "output", function(err){
	console.log("open");
	console.log(err);
	gpio.write(22, 1, function(err){
	console.log("write" + err);	
	});
	});
}

function write(){
	gpio.write(22, false, function(err){
	if(err)
		console.log(err);
	});
	console.log('gpio write')
};


var isLoaded = sensor.isDriverLoaded();
console.log(isLoaded);
if(!isLoaded) {
    try {
        sensor.loadDriver();
        console.log('driver is loaded');
    } catch (err) {
        console.log('something went wrong loading the driver:', err)
    }
}

var sensorMapping = [];
sensorMapping["28-0000072e90ed"] = "Demosensor(baren)";
sensorMapping["28-000007308286"] = "HLT (Ut)";
sensorMapping["28-0000072fbb77"] = "MSK (In)";
sensorMapping["28-0000072e1eae"] = "MSK (Ut)";

var devices;
try {
    devices = sensor.list();
} catch(ex) {
    console.log(ex);
}
var debug = false;
var heatOn = false;
var targetTemp = 30;

// Send current time to all connected clients
function sendTemp() {
    try {
    for(var i = 0; i<devices.length;i++){
      io.emit('temp', { id: devices[i], name: sensorMapping[devices[i]], temp: sensor.get(devices[i])});  
    
        if(sensorMapping[devices[i]] == "MSK (In)")
	   {
		console.log(heatOn);
		var mskintemp = sensor.get(devices[i]);
		if(!heatOn)
		{
			gpio.write(22, 0, function(err){
				if(err)
					console.log(err);
				});
			console.log("heatOn = true");
			heatOn = true;
			console.log(heatOn);
		}
		else if(heatOn)
		{
			gpio.write(22, 1, function(err){
			console.log(err);
			});
			heatOn = false;
		}
	}    


    }
    } catch(ex) {
        console.log(ex);
        
    }
    if(debug) {
        io.emit('temp', { id:"28-0000072e90e1", name: "demo1", temp: 40 + Math.random()*10});
        io.emit('temp', { id:"28-0000072e90e2", name: "demo2", temp: 30 + Math.random()*20});
    } 
    //io.emit('temp', { temp: sensor.get(devices)});
}

function toggleDebug(val) {
    debug = val;
}

setInterval(sendTemp, 1000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
    socket.on('debug', toggleDebug);
});

app.get('/', function (req, res){
            //res.send('<h1>'+varde+'</h1>')
            res.render('monitor');
});




export = app;