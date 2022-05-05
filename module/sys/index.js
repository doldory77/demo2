const url = require('url');
const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

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
    
    // global.dbPool.getConnection((err, conn) => {
    //     if (!err) {
    //         let sql = global.sqlMap.getStatement('sys', 'selectCodeByParentCd', {parent_cd:'0000'}, global.format)
    //         console.log(sql)
    //         conn.query(sql, (error, result) => {
    //             if (error) console.error(error)
    //             res.render('sys/code/code_mng', {parentCode: result})    
    //         })
    //     } else {
    //         console.error(err)
    //         res.render('sys/code/code_mng', {parentCode: []})
    //     }
    // })
    xx(req, res)
})

router.post('/code_mng', (req, res) => {
    xx(req, res)
})

function xx(req, res) {
    global.dbPool.getConnection((err, conn) => {
        if (!err) {
            let sql = global.sqlMap.getStatement('sys', 'selectCodeByParentCd', {parent_cd:'0000'}, global.format)
            console.log(sql)
            conn.query(sql, (error, result) => {
                if (error) console.error(error)
                res.render('sys/code/code_mng', {parentCode: result})    
            })
        } else {
            console.error(err)
            res.render('sys/code/code_mng', {parentCode: []})
        }
    })
}

router.post('/child_code', (req, res) => {
    global.dbPool.getConnection((err, conn) => {
        if (!err) {
            let sql = global.sqlMap.getStatement('sys', 'selectCodeByParentCd', {parent_cd:req.body.parent_cd}, global.format)
            console.log(sql)
            conn.query(sql, (error, result) => {
                if (error) console.error(error)
                res.json(Object.assign({code:'0', msg:'success'}, {childCode: result})
                )
            })
        } else {
            console.error(err)
            res.json({code:'-1', msg:'err'})
        }
    })
})

router.post('/code_process', (req, res) => {
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