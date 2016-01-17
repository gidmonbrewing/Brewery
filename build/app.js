var express = require('express');
var sensor = require('ds18x20');
var app = express();
var server = app.listen(8334, function () {
    console.log("Lyssnar");
});
var io = require('socket.io').listen(server);
app.use(express.static('scripts'));
app.use(express.static('node_modules'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
var isLoaded = sensor.isDriverLoaded();
console.log(isLoaded);
if (!isLoaded) {
    try {
        sensor.loadDriver();
        console.log('driver is loaded');
    }
    catch (err) {
        console.log('something went wrong loading the driver:', err);
    }
}
var sensorMapping = [];
sensorMapping["28-0000072e90ed"] = "Demosensor(baren)";
var devices;
try {
    devices = sensor.list();
}
catch (ex) {
    console.log(ex);
}
var debug = false;
// Send current time to all connected clients
function sendTemp() {
    try {
        for (var i = 0; i < devices.length; i++) {
            io.emit('temp', { id: devices[i], name: sensorMapping[devices[i]], temp: sensor.get(devices[i]) });
        }
    }
    catch (ex) {
        console.log(ex);
    }
    if (debug) {
        io.emit('temp', { id: "28-0000072e90e1", name: "demo1", temp: 40 + Math.random() * 10 });
        io.emit('temp', { id: "28-0000072e90e2", name: "demo2", temp: 30 + Math.random() * 20 });
    }
    //io.emit('temp', { temp: sensor.get(devices)});
}
function toggleDebug(val) {
    debug = val;
}
setInterval(sendTemp, 1000);
// Emit welcome message on connection
io.on('connection', function (socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
    socket.on('debug', toggleDebug);
});
app.get('/', function (req, res) {
    //res.send('<h1>'+varde+'</h1>')
    res.render('monitor');
});
module.exports = app;
