const url = require('url');
const express = require('express')
const session = require('express-session')
const path = require('path')
const app = express();
const { logger } = require('./config/logger')
const morgan = require('morgan')

app.use(express.json({limit: "30mb"}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
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
mapper.createMapper([
    './mapper/test.xml', 
    './mapper/sys.xml',
    './mapper/sys_menu.xml',
    './mapper/sys_code.xml',
    './mapper/sys_member.xml',
    './mapper/sys_board.xml',
    './mapper/sys_media.xml',
    './mapper/sys_dept.xml',
    
    './mapper/usr.xml'
])

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'view'))
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

/** 웹 요청 로그 
if (global.isDebug) {
    app.use(morgan('dev', { stream: { write: msg => logger.http(msg) } }))
}
*/

/** 세션체크 */
app.use((req, res, next) => {
    let reqUrl = url.parse(req.url).pathname
    if (/\/sys_login/.test(reqUrl)) {
        next()
    } else if (/\/sys(_|\/){1}/.test(reqUrl)) {
        console.log(':::::: [', reqUrl, '] ::::::')
        if (req.session && req.session.isLoggedIn === true) {
            next()
        } else {
            res.redirect('/sys/sys_login')
        }
    } else {
        next()
    }
})

// const user_router = require('./module/user/index')
// app.use('/user', user_router);
app.use('/sys', require('./module/sys/index'));
app.use('/sys_code', require('./module/sys/code'));
app.use('/sys_menu', require('./module/sys/menu'));
app.use('/sys_member', require('./module/sys/member'));
app.use('/sys_board', require('./module/sys/board'));
app.use('/sys_media', require('./module/sys/media'));
app.use('/sys_dept', require('./module/sys/dept'));

app.use('/', require('./module/usr/index'));

app.use(express.static('public'));
global.appRoot = path.resolve(__dirname)
global.sqlMap = mapper
global.dbPool = pool
// global.isDebug = true
global.format = { language: 'sql', indent: '  ' }
global.rowCnt = 10
global.blockCnt = 5
global.limitImgWidth = 100

// app.get('/', (req, res) => {
//     res.render('index');
// });

app.listen(8080, () => {
    console.log("start! express server no port 8080")
});