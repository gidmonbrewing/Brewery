"use strict";
import express = require('express');
import Heater = require('./heater');
import Mash = require('./mash');
import Brewstatus = require('./brewstatus');
import Sparge = require('./sparge');
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
var mash = new Mash(60, 65);
var sparge = new Sparge(20,75);

function Brew() {
    try {
        var mskIn = sensor.get(tempSensors["MSK(IN)"]);
        var mskUt = sensor.get(tempSensors["MSK(UT)"]);
        var hltUt = sensor.get(tempSensors["HLT(UT)"]);
        if(mash.IsMashing) {
            var setHeater = mash.HeatOn(hltUt, mskUt, mskIn);
            if(setHeater)
                heater.On();
            else
                heater.Off();
        } else if(sparge.IsInPrePhase) {
            var setHeater = sparge.HeatOn(hltUt);
            if(setHeater)
                heater.On();
            else
                heater.Off();
        } else if(sparge.IsRunning) {
            heater.Off();
            sparge.CheckStatus();
        }
           
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
}

function StartBrew() {
    console.log("StartBrewing");
    Brew();
}

function SetNewMashTemp(val) {
    console.log("SetNewMashTemp to: " + val);
    mash.MashTemp = parseInt(val);
    mash.ResetHeatTolerance();
}

function StartMash() {
    mash.StartMash();
}

function StartSpargePrePhase() {
    sparge.StartPrePhase();
}

function StartSparge() {
    sparge.Start();
}

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
    socket.on('StartBrew', StartBrew);
    socket.on('SetNewMashTemp', SetNewMashTemp);
    socket.on('StartMash', StartMash);
    socket.on('StartSpargePrePhase', StartSpargePrePhase);
    socket.on('StartSparge', StartSparge);
});

app.get('/', function (req, res){
            res.render('monitor');
});

export = app;