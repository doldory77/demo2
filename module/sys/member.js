const express = require('express');
const router = express.Router();
const { query, cmmnUtil } = require('../cmmn/cmmn')

router.get('/member_mng', (req, res) => {
    viewMember(Object.assign({}, req.query), res)
})

router.post('/member_mng', (req, res) => {
    viewMember(Object.assign({}, req.body), res)
})

async function viewMember(params, res) {
    console.log('params: ', params)
    let errors = []
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
    if (!params.page) {
        params.page = 1
    }
    let member = []
    try { member = await query('sys_member', 'selectMember', newParams) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let totalCnt = []
    totalCnt = await query('sys_member', 'selectMemberTotalCnt', newParams)
    let jikbun = []
    try { jikbun = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0300'}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let mwgubun = []
    try { mwgubun = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0900'}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }

    let paging = cmmnUtil.pagingObj(params.page, totalCnt)
    console.log('## paging info ##', paging)
    res.render('sys/member/member_mng', {member, jikbun, mwgubun, params, errors, paging})
}

router.get('/member_new', (req, res) => {
    (async function(){
        let jikbun = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0300'})
        let mwgubun = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0900'})
        res.render('sys/member/member_new', {jikbun, mwgubun})
    })()
})

router.post('/member_id_chk', (req, res) => {
    (async function(){
        let errors = []
        let id = req.body.id
        if (!id) {
            res.json({msg:'아이디를 확인하세요', code:'0402'})
            return
        }
        let user = []
        try { user = await query('sys_member', 'selectMember', {id}) }
        catch (error) {
            errors.push('sql error')
            console.log(':::[ERROR]::::', error)
        }
        if (!user || !user[0]) {
            res.json({msg:'사용가능한 아이디 입니다.', code:'0000', errors})
        } else {
            res.json({msg:'이미 사용하고 있는 아이디 입니다.', code:'0402', errors})
        }
    })()
})

router.post('/member_add', (req, res) => {
    (async function(){
        let errors = []
        let newParams = {}
        newParams.id = req.body.id
        newParams.name = req.body.name
        newParams.passwd = 'qwer1234'
        newParams.jikbun_cd = req.body.slt_jikbun
        newParams.mw_cd = req.body.slt_mw
        newParams.reg_dt = req.body.reg_dt
        newParams.birthday = req.body.birthday
        let result = {}
        try { result = await query('sys_member', 'insertMembe', newParams) }
        catch (error) {
            errors.push('sql error')
            console.log(':::[ERROR]::::', error)
            res.render('sys/error', {errors})
        }
        // console.log(result)
        res.redirect('/sys_member/member_dtl?seq_no='+result.insertId)
    })()
})

router.get('/member_dtl', (req, res) => {
    viewMemberDetail(Object.assign({}, req.query), res)
})

async function viewMemberDetail(params, res) {
    let errors = []
    let mem = []
    try { mem = await query('sys_member', 'selectMember', {seq_no:params.seq_no}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let jikbun = []
    try { jikbun = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0300'}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let mwgubun = []
    try { mwgubun = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0900'}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let contact_kind = []
    try { contact_kind = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0400'}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let contact = []
    try { contact = await query('sys_member', 'selectContactByMbSeqNo', {mb_seq_no:params.seq_no}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let addr = []
    try { addr = await query('sys_member', 'selectAddrByMbSeqNo', {mb_seq_no:params.seq_no}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let picture = []
    try { picture = await query('sys', 'selectFile', {src_tbl_nm:'member', rf_key:params.seq_no}) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    res.render('sys/member/member_dtl', {mem:mem[0]||{}, jikbun, mwgubun, contact_kind, contact, addr, picture, errors})
}

router.post('/member_contact_add', (req, res) => {
    (async function(params){
        // console.log(params)
        let errors = []
        let i = 0;
        while (true) {
            if (params['contack_no'+i] == undefined) {
                break;
            }
            try { 
                await query('sys_member', 'insertContact', {
                    mb_seq_no: params.seq_no,
                    kind_cd: params['slt_contact_kind'+i],
                    contact_no: params['contack_no'+i]
                }) 
            } catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                res.render('sys/error', {errors})
                break;
            }
            i++
            if (i > 100) break
        }
        res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
    })(req.body)
})

router.post('/member_addr_add', (req, res) => {
    (async function(params){
        // console.log(params)
        let errors = []
        let i = 0;
        while (true) {
            if (params['addr'+i] == undefined) {
                break;
            }
            try {
                await query('sys_member', 'insertAddr', {
                    mb_seq_no: params.seq_no,
                    postal_cd: params['postal_cd'+i],
                    addr: params['addr'+i],
                    addr_detail: params['detail'+i]
                })
            } catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                res.render('sys/error', {errors})
                break;
            }
            i++
            if (i > 100) break
        }
        // viewMemberDetail(params, res)
        res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
    })(req.body)
})

router.post('/member_contact_mod', (req, res) => {
    (async function(params){
        // console.log(params)
        let errors = []
        let i = 0;
        while (true) {
            if (params['contact_seq_no'+i] == undefined) {
                break;
            }
            if (params['contact_del_yn'+i] !== undefined) {
                try { await query('sys_member', 'deleteContactBySeqNo', {seq_no:params['contact_seq_no'+i]}) }
                catch (error) {
                    errors.push('sql error')
                    console.log(':::[ERROR]::::', error)
                    res.render('sys/error', {errors})
                    break;
                }
                i++
                continue
            }
            try {
                await query('sys_member', 'updateContact', {
                    kind_cd: params['slt_contact_kind'+i],
                    contact_no: params['contack_no'+i],
                    seq_no: params['contact_seq_no'+i]
                })
            } catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                res.render('sys/error', {errors})
                break;
            }
            // console.log(params['contact_seq_no'+i])
            i++
            if (i > 100) break
        }
        // viewMemberDetail(params, res)
        res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
    })(req.body)
})

router.post('/member_addr_mod', (req, res) => {
    (async function(params){
        // console.log(params)
        let errors = []
        let i = 0;
        while (true) {
            if (params['addr_seq_no'+i] == undefined) {
                break;
            }
            if (params['addr_del_yn'+i] !== undefined) {
                try { await query('sys_member', 'deleteAddrBySeqNo', {seq_no:params['addr_seq_no'+i]}) }
                catch (error) {
                    errors.push('sql error')
                    console.log(':::[ERROR]::::', error)
                    res.render('sys/error', {errors})
                    break;
                }
                i++
                continue
            }
            try {
                await query('sys_member', 'updateAddr', {
                    postal_cd: params['postal_cd'+i],
                    addr: params['addr'+i],
                    addr_detail: params['detail'+i],
                    seq_no: params['addr_seq_no'+i]
                })
            } catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                res.render('sys/error', {errors})
                break;
            }
            // console.log(params['contact_seq_no'+i])
            i++
            if (i > 100) break
        }
        // viewMemberDetail(params, res)
        res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
    })(req.body)
})

/** 파일저장 공통화 */
// cmmnUtil.setRouterForSaveFile(router, '/member_portrait_add', (params, res, etc) => {
//     console.log(etc[0])
//     res.redirect('/sys_member/member_dtl?seq_no=' + etc[2])
// })

/** 파일삭제 공통화 */
// cmmnUtil.setRouterForDeleteFileBySeqNo(router, '/file_del/byseqno', (params, res) => {
//     res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
// })

router.post('/member_portrait_add', (req, res) => {
    let errors = []
    try {
        cmmnUtil.saveFile(req, (addCnt, fields) => {
            res.redirect('/sys_member/member_dtl?seq_no=' + fields.rf_key)
        })
    } catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
        res.render('sys/error', {errors})
    }
})

router.post('/file_del/byseqno', (req, res) => {
    let errors = []
    cmmnUtil.deleteFile(req, dellCnt => {
        res.redirect('/sys_member/member_dtl?seq_no=' + req.body.seq_no)
    }).catch(error => {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
        res.render('sys/error', {errors})
    })
})

module.exports = router;