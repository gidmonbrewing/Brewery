"use strict";
import express = require('express');
import Heater = require('./heater');
import Mash = require('./mash');
import Brewstatus = require('./brewstatus');
var sensor = require('ds18x20');
var app = express();
var server = app.listen(8334, function(){
    console.log("Lyssnar");
});

var io = require('socket.io').listen(server);
app.use(express.static('scripts'));
app.use(express.static('node_modules'))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var heater = new Heater();

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

var tempSensors = [];
tempSensors["HLT(UT)"] = "28-000007308286";
tempSensors["MSK(IN)"] = "28-0000072fbb77";
tempSensors["MSK(UT)"] = "28-0000072e1eae";

var devices;
try {
    devices = sensor.list();
} catch(ex) {
    console.log(ex);
}
var debug = false;
var mash = new Mash(60, 60);

function Brew() {
    try {
        
    
    var mskIn = sensor.get(tempSensors["MSK(IN)"]);
    var mskUt = sensor.get(tempSensors["MSK(UT)"]);
    var hltUt = sensor.get(tempSensors["HLT(UT)"]);
    
    var setHeater = mash.HeatOn(hltUt, mskUt, mskIn);
    if(setHeater)
        heater.On();
    else
        heater.Off();
        
    var status = new Brewstatus(hltUt, mskUt, mskIn, mash.TimeLeft(), mash.MashTemp);
    io.emit('status', status);
    setTimeout(Brew, 1000);
    }
    catch(err)
    {
        console.log(err);
    }
}


// Send current time to all connected clients
function sendTemp() {
    try {
    for(var i = 0; i<devices.length;i++){
       io.emit('temp', { id: devices[i], name: sensorMapping[devices[i]], temp: sensor.get(devices[i])});  
    
       if(sensorMapping[devices[i]] == "MSK (In)")
	   {
		console.log(heater.Status);
		var mskintemp = sensor.get(devices[i]);
		if(!heater.Status)
		{
			heater.On();
			console.log(heater.Status);
		}
		else if(heater.Status)
		{
			heater.Off();
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

function StartBrew() {
    console.log("StartBrewing");
    Brew();
}

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
    socket.on('debug', toggleDebug);
    socket.on('StartBrew', StartBrew);
});

app.get('/', function (req, res){
            //res.send('<h1>'+varde+'</h1>')
            res.render('monitor');
});


export = app;