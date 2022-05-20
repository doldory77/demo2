const url = require('url');
const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs')
const path = require('path');
const { resolve } = require('path');
const { query, fileTypeCode, fileRealPath, fileUrlPath, fileExt, setRouterForDeleteFileBySeqNo } = require('../cmmn/cmmn')

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
    let selectedParentCd = [{cd:''}]
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

// router.post('/child_code', (req, res) => {
//     global.dbPool.getConnection((err, conn) => {
//         if (!err) {
//             let sql = global.sqlMap.getStatement('sys', 'selectCodeByParentCd', {parent_cd:req.body.parent_cd}, global.format)
//             console.log(sql)
//             conn.query(sql, (error, result) => {
//                 if (error) console.error(error)
//                 res.json(Object.assign({code:'0', msg:'success'}, {childCode: result})
//                 )
//             })
//         } else {
//             console.error(err)
//             res.json({code:'-1', msg:'err'})
//         }
//     })
// })



router.get('/menu_mng', (req, res) => {
    processMenuMng({}, res)
})

router.post('/menu_mng', (req, res) => {
    processMenuMng(Object.assign({}, req.body), res)
})

async function processMenuMng(params, res) {
    console.log('params: ', params)
    let selectedParentMenu = [{menu_cd:''}]
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

    let parentMenu = await query('sys', 'selectMenu', {parent_menu_cd:'0000'})
    if (params && params.selected_parent_menu_cd) {
        newParams.parent_menu_cd = params.selected_parent_menu_cd
        selectedParentMenu = await query('sys', 'selectMenu', {menu_cd:params.selected_parent_menu_cd})
        console.log('selectedParentMenu: ', selectedParentMenu)
    } else {
        newParams.parent_menu_cd = parentMenu[0].menu_cd
    }
    let childMenu = await query('sys', 'selectMenu', {parent_menu_cd:newParams.parent_menu_cd})

    res.render('sys/menu/menu_mng', {parentMenu, childMenu, selectedParentMenu})
    
}

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

router.get('/member_mng', (req, res) => {
    viewMember({}, res)
})

router.post('/member_mng', (req, res) => {
    viewMember(Object.assign({}, req.body), res)
})

async function viewMember(params, res) {
    console.log('params: ', params)
    newParams = {seq_no:''}
    if (params.chk_id_or_name && params.slt_id_or_name == '1') {
        newParams.name = params.id_or_name
    } else if (params.chk_id_or_name && params.slt_id_or_name == '2') {
        newParams.id = params.id_or_name
    }
    if (params.chk_jikbun) {
        newParams.jikbun_cd = params.slt_jikbun
    }
    if (params.chk_mw) {
        newParams.mw_cd = params.slt_mw
    }
    if (params.chk_reg_dt) {
        newParams.start_reg_dt = params.start_reg_dt
        newParams.end_reg_dt = params.end_reg_dt
    }
    let member = await query('sys', 'selectMember', newParams)
    let jikbun = await query('sys', 'selectCodeByParentCd', {parent_cd:'0300'})
    let mwgubun = await query('sys', 'selectCodeByParentCd', {parent_cd:'0900'})
    res.render('sys/member/member_mng', {member, jikbun, mwgubun, params})
}

router.get('/member_dtl', (req, res) => {
    viewMemberDetail(Object.assign({}, req.query), res)
})

async function viewMemberDetail(params, res) {
    let mem = await query('sys', 'selectMember', {seq_no:params.seq_no})
    let jikbun = await query('sys', 'selectCodeByParentCd', {parent_cd:'0300'})
    let mwgubun = await query('sys', 'selectCodeByParentCd', {parent_cd:'0900'})
    let contact_kind = await query('sys', 'selectCodeByParentCd', {parent_cd:'0400'})
    let contact = await query('sys', 'selectContactByMbSeqNo', {mb_seq_no:params.seq_no})
    let addr = await query('sys', 'selectAddrByMbSeqNo', {mb_seq_no:params.seq_no})
    let picture = await query('sys', 'selectFile', {src_tbl_nm:'member', rf_key:params.seq_no})
    res.render('sys/member/member_dtl', {mem:mem[0]||{}, jikbun, mwgubun, contact_kind, contact, addr, picture})
}

router.post('/member_contact_add', (req, res) => {
    (async function(params){
        // console.log(params)
        let i = 0;
        while (true) {
            if (params['contack_no'+i] == undefined) {
                break;
            }
            await query('sys', 'insertContact', {
                mb_seq_no: params.seq_no,
                kind_cd: params['slt_contact_kind'+i],
                contact_no: params['contack_no'+i]
            })
            i++
            if (i > 100) break
        }
        viewMemberDetail(params, res)
    })(req.body)
})

router.post('/member_addr_add', (req, res) => {
    (async function(params){
        // console.log(params)
        let i = 0;
        while (true) {
            if (params['addr'+i] == undefined) {
                break;
            }
            await query('sys', 'insertAddr', {
                mb_seq_no: params.seq_no,
                postal_cd: params['postal_cd'+i],
                addr: params['addr'+i],
                addr_detail: params['detail'+i]
            })
            i++
            if (i > 100) break
        }
        viewMemberDetail(params, res)
    })(req.body)
})

router.post('/member_contact_mod', (req, res) => {
    (async function(params){
        // console.log(params)
        let i = 0;
        while (true) {
            if (params['contact_seq_no'+i] == undefined) {
                break;
            }
            if (params['contact_del_yn'+i] !== undefined) {
                await query('sys', 'deleteContactBySeqNo', {seq_no:params['contact_seq_no'+i]})
                i++
                continue
            }
            await query('sys', 'updateContact', {
                kind_cd: params['slt_contact_kind'+i],
                contact_no: params['contack_no'+i],
                seq_no: params['contact_seq_no'+i]
            })
            // console.log(params['contact_seq_no'+i])
            i++
            if (i > 100) break
        }
        viewMemberDetail(params, res)
    })(req.body)
})

router.post('/member_addr_mod', (req, res) => {
    (async function(params){
        // console.log(params)
        let i = 0;
        while (true) {
            if (params['addr_seq_no'+i] == undefined) {
                break;
            }
            if (params['addr_del_yn'+i] !== undefined) {
                await query('sys', 'deleteAddrBySeqNo', {seq_no:params['addr_seq_no'+i]})
                i++
                continue
            }
            await query('sys', 'updateAddr', {
                postal_cd: params['postal_cd'+i],
                addr: params['addr'+i],
                addr_detail: params['detail'+i],
                seq_no: params['addr_seq_no'+i]
            })
            // console.log(params['contact_seq_no'+i])
            i++
            if (i > 100) break
        }
        viewMemberDetail(params, res)
    })(req.body)
})

router.post('/member_portrait_add', (req, res) => {
    var form = new formidable.IncomingForm();
    form.multiples = true
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        let rtn = await (function(){
            return new Promise((resolve, reject) => {
                let i = 0;
                let f = undefined;
                while (true) {
                    if (files['fileX'+i] == undefined) {
                        break
                    }
                    f = files['fileX'+i]
                    
                    fs.rename(f.filepath, path.join(fileRealPath(global.appRoot, fields.file_path), f.newFilename + fileExt(f.originalFilename)), (err) => {
                        if (err) reject(err)
                    })
                    query('sys', 'insertFile', {
                        src_tbl_nm: fields.src_tbl_nm,
                        rf_key: fields.rf_key,
                        file_org_nm: f.originalFilename,
                        file_real_path: fileRealPath(global.appRoot, fields.file_path).replace(/\\/gi, '\/'),
                        file_path: fileUrlPath(fields.file_path),
                        file_nm: f.newFilename + fileExt(f.originalFilename),
                        file_kind_cd: fileTypeCode(f.mimetype)
                    })
                    i++
                    if (i > 100) break
                }       
                resolve((i+1) + "")                          
            }).then(result => {
                return result
            }).catch(error => {
                return error
            })
        })()
        // console.log('fields: ', fields)
        // console.log('files: ', files)
        res.redirect('/sys/member_dtl?seq_no=' + fields.rf_key)
        // viewMemberDetail({seq_no:fields.rf_key}, res)
    })
})

/** 파일삭제 공통화 */
setRouterForDeleteFileBySeqNo(router, query, '/file_del/byseqno', (params, res) => {
    res.redirect('/sys/member_dtl?seq_no=' + params.seq_no)
})


module.exports = router;