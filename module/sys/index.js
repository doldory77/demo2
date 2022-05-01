const url = require('url');
const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const form = formidable({multiples: true, uploadDir: path.join(__dirname, 'upload')})

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

router.get('/code_mng', (req, res) => {
    res.render('sys/code/code_mng')
})

router.post('/code_process', (req, res) => {
    console.log('xxxxxxxxxxxxx')
    var form = new formidable.IncomingForm();
    form.multiples = true
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        fs.rename(files.file1.filepath, 'C:/Users/doldo/dev-workspace/node/xxx.png', err => {
            if (err) throw err;
        })
        console.log('fields: ', fields)
        console.log('files: ', files)
    })
    res.render('sys/code/code_mng')
})

router.get('/menu_mng', (req, res) => {
    // let param = { parent_menu_cd:'0000' }
    // let query = global.sqlMap.getStatement('sys', 'selectMenu', param, global.format)
    // console.log(query)

    // global.dbPool.getConnection((err, conn) => {
    //     if (!err) {
    //         conn.query(query, (error, rows, fields) => {
    //             if (error) throw error;
    //             console.log('menu info is: ', rows)
    //             res.render('sys/menu/menu_mng', {rows})
    //         })
    //     }
    //     conn.release()
    // })
    let param = {
        id: 'x2',
        name: 'xxx',
        passwd: 'xxx',
        jikbun_cd: '0304',
        mw_cd: '0901'
    }
    let query = global.sqlMap.getStatement('sys', 'insertMember', param, global.format)
    console.log(query)

    global.dbPool.getConnection((err, conn) => {
        if (!err) {
            new Promise((resolve, reject) => {
                var param = {
                    id: 'x2',
                    name: 'xxx',
                    passwd: 'xxx',
                    jikbun_cd: '0304',
                    mw_cd: '0901'
                }
                var sql = global.sqlMap.getStatement('sys', 'insertMember', param, global.format)
                conn.query(sql, (error, result) => {
                    if (error) reject(error)
                    resolve(result.insertId)
                })
            }).then(insertId => {
                return new Promise((resolve, reject) => {
                    var param = {
                        mb_seq_no: insertId,
                        kind_cd: '0403',
                        contact_no: '01062597052',
                    }   
                    var sql = global.sqlMap.getStatement('sys', 'insertContact', param, global.format)
                    conn.query(sql, (error, result) => {
                        if (error) reject(error)
                        resolve(result.insertId)
                    })
                })
            }).then((insrtId) => {
                console.log(insrtId)
                res.render('sys/menu/menu_mng')
            })
            
        }
        conn.release()
    })

})

module.exports = router;