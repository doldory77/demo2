const express = require('express')
const session = require('express-session')
const path = require('path')
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    HttpOnly: true,
    secure: false,
    secret: 'aabbccddee',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 24000 * 60 * 60}
}));

const mysql = require('mysql')
const dbconfig = require('./config/database.js')
const pool = mysql.createPool(dbconfig)
const mapper = require('mybatis-mapper')
mapper.createMapper(['./mapper/test.xml', './mapper/sys.xml'])

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'view'))
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

const user_router = require('./module/user/index')
const sys_router = require('./module/sys/index')
app.use('/user', user_router);
app.use('/sys', sys_router);


app.use(express.static('public'));
global.appRoot = path.resolve(__dirname);
global.sqlMap = mapper;
global.dbPool = pool;
global.format = { language: 'sql', indent: '  ' }

app.get('/', (req, res) => {
    // res.sendFile(__dirname + "/public/main.html")
    res.render('index');
});

app.get('/main', (req, res) => {
    // res.sendFile(__dirname + "/public/main.html")
    let param = { cd:'0001' }
    let query = global.sqlMap.getStatement('test', 'test', param, global.format)
    console.log(query)

    global.dbPool.getConnection((err, conn) => {
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