const url = require('url');
const express = require('express');
const router = express.Router();

/** 세션체크 */
router.use((req, res, next) => {
    let reqUrl = url.parse(req.url).pathname
    console.log(reqUrl)
    if (reqUrl === '/sys_login' || reqUrl === '/sys_login_process') {
        next()
    } else {
        if (req.session && req.session.isLoggedIn === true) {
            next()
        } else {
            res.redirect('/sys/sys_login')
        }
    }
})

router.get('/', (req, res) => {
    console.log(req.session);
    if (req.session && req.session.isLoggedIn === true) {
        res.render('sys/index', {userId: req.session.userId})
    } else {
        res.redirect('/sys/sys_login')
    }
});

router.get('/sys_login', (req, res) => {
    res.render('sys/sys_login', {id:'doldory', pw:'1234', code:'0000', msg:''});
})

router.post('/sys_login_process', (req, res) => {
    if (req.body.id === 'doldory' && req.body.pw === '1234') {
        req.session.isLoggedIn = true
        req.session.userId = req.body.id
        req.session.save()
        res.redirect('/sys')
    } else {
        res.render('sys/sys_login', {id:'', code:'4000', msg:'아이디 또는 패스워드를 확인하세요!'})
    }
})

router.get('/menu_mng', (req, res) => {
    let param = { parent_menu_cd:'0000' }
    let query = global.sqlMap.getStatement('sys', 'selectMenu', param, global.format)
    console.log(query)

    global.dbPool.getConnection((err, conn) => {
        if (!err) {
            conn.query(query, (error, rows, fields) => {
                if (error) throw error;
                console.log('menu info is: ', rows)
                res.render('sys/menu/menu_mng', {rows})
            })
        }
        conn.release()
    })

})

module.exports = router;