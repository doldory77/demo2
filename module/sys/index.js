const url = require('url');
const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs')
const path = require('path');
const { resolve } = require('path');
const { query } = require('../cmmn/cmmn')

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
    processCodeMng({}, res)
})

router.post('/code_mng', (req, res) => {
    processCodeMng(Object.assign({}, req.body), res)
})

async function processCodeMng(params, res) {
    console.log('params: ', params)
    let selectedParentCd = [{cd:'0100'}]
    let newParams = {}
    if (params && params.submit_mode == 'new_parent_save') {
        // 신규상위코드 저장
        newParams.cd = params.new_p_cd
        newParams.parent_cd = '0000'
        newParams.cd_nm = params.new_p_cd_nm
        newParams.ord_no = params.new_p_ord_no
        await query('sys', 'insertCode', newParams)
    } else if (params && params.submit_mode == 'mod_parent_save') {
        // 상위코드수정 저장
        newParams.cd = params.mod_p_cd
        newParams.cd_nm = params.mod_p_cd_nm
        newParams.ord_no = params.mod_p_ord_no
        await query('sys', 'updateCode', newParams)
    } else if (params && params.submit_mode == 'new_child_save') {
        // 신규하위코드 저장
        newParams.cd = params.new_c_cd
        newParams.parent_cd = params.new_c_parent_cd
        newParams.cd_nm = params.new_c_cd_nm
        newParams.ord_no = params.new_c_ord_no
        await query('sys', 'insertCode', newParams)
    } else if (params && params.submit_mode == 'mod_child_save') {
        // 하위코드수정 저장
        newParams.cd = params.mod_c_cd
        newParams.cd_nm = params.mod_c_cd_nm
        newParams.ord_no = params.mod_c_ord_no
        newParams.parent_cd = params.mod_c_parent_cd
        await query('sys', 'updateCode', newParams)
    }

    let parentCode = await query('sys', 'selectCodeByParentCd', {parent_cd:'0000'})
    if (params && params.selected_parent_cd) {
        newParams.parent_cd = params.selected_parent_cd
        selectedParentCd = await query('sys', 'selectCodeByCd', {cd:params.selected_parent_cd})
        console.log('selectedParentCd: ', selectedParentCd)
    } else {
        newParams.parent_cd = parentCode[0].cd
    }
    let childCode = await query('sys', 'selectCodeByParentCd', {parent_cd:newParams.parent_cd})

    res.render('sys/code/code_mng', {parentCode, childCode, selectedParentCd})
    
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