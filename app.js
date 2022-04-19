var express = require('express')
var path = require('path')
var app = express();
const mysql = require('mysql')
var dbconfig = require('./config/database.js')
var pool = mysql.createPool(dbconfig)
const mapper = require('mybatis-mapper')
mapper.createMapper(['./mapper/test.xml'])
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'view'))
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

var module_user = require('./module/user/index')

app.use('/user', module_user);
app.use(express.static('public'));
global.appRoot = path.resolve(__dirname);

app.get('/', (req, res) => {
    // res.sendFile(__dirname + "/public/main.html")
    res.render('index');
});

app.get('/main', (req, res) => {
    // res.sendFile(__dirname + "/public/main.html")
    var param = { cd:'0001' }
    var format = { language: 'sql', indent: '  ' }
    var query = mapper.getStatement('test', 'test', param, format)
    console.log(query)

    pool.getConnection((err, conn) => {
        if (!err) {
            conn.query(query, (error, rows, fields) => {
                if (error) throw error;
                console.log('code info is: ', rows)
            })
        }
        conn.release()
    })
    res.render('index');
});



app.listen(8080, () => {
    console.log("start! express server no port 8080")
});