var express = require('express')
var path = require('path');
var app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'view'));
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

var module_user = require('./module/user/index');

app.use('/user', module_user);
app.use(express.static('public'));
global.appRoot = path.resolve(__dirname);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/main.html")
});

app.get('/main', (req, res) => {
    res.sendFile(__dirname + "/public/main.html")
});



app.listen(3000, () => {
    console.log("start! express server no port 3000")
});