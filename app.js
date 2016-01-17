var express = require('express');
var app = express();
//app.use(express.static('html'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function (req, res) {
    //res.send('<h1>Hello World!!</h1>');
    res.render('monitor');
});
app.listen(8334, function () {
    console.log("Lyssnar");
});
module.exports = app;
//# sourceMappingURL=app.js.map