const express = require('express');
const router = express.Router();
const { query, cmmnUtil } = require('../cmmn/cmmn')

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

router.get('/member_new', (req, res) => {
    (async function(rq, rs){
        let jikbun = await query('sys', 'selectCodeByParentCd', {parent_cd:'0300'})
        let mwgubun = await query('sys', 'selectCodeByParentCd', {parent_cd:'0900'})
        rs.render('sys/member/member_new', {jikbun, mwgubun})
    })(req, res)
})

router.post('/member_id_chk', (req, res) => {
    (async function(){
        let id = req.body.id
        if (!id) {
            res.json({msg:'아이디를 확인하세요', code:'0402'})
            return
        }
        let user = await query('sys', 'selectMember', {id})
        if (!user || !user[0]) {
            res.json({msg:'사용가능한 아이디 입니다.', code:'0000'})
        } else {
            res.json({msg:'이미 사용하고 있는 아이디 입니다.', code:'0402'})
        }
    })()
})

router.post('/member_add', (req, res) => {
    (async function(){
        let newParams = {}
        newParams.id = req.body.id
        newParams.name = req.body.name
        newParams.passwd = 'qwer1234'
        newParams.jikbun_cd = req.body.slt_jikbun
        newParams.mw_cd = req.body.slt_mw
        newParams.reg_dt = req.body.reg_dt
        let result = await query('sys', 'insertMember', newParams)
        console.log(result)
        res.redirect('/sys/member_dtl?seq_no='+result.insertId)
    })()
})

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
        res.redirect('/sys/member_dtl?seq_no=' + params.seq_no)
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
        // viewMemberDetail(params, res)
        res.redirect('/sys/member_dtl?seq_no=' + params.seq_no)
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
        // viewMemberDetail(params, res)
        res.redirect('/sys/member_dtl?seq_no=' + params.seq_no)
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
        // viewMemberDetail(params, res)
        res.redirect('/sys/member_dtl?seq_no=' + params.seq_no)
    })(req.body)
})

/** 파일저장 공통화 */
cmmnUtil.setRouterForSaveFile(router, '/member_portrait_add', (params, res, etc) => {
    console.log(etc[0])
    res.redirect('/sys/member_dtl?seq_no=' + etc[2])
})

/** 파일삭제 공통화 */
cmmnUtil.setRouterForDeleteFileBySeqNo(router, '/file_del/byseqno', (params, res) => {
    res.redirect('/sys/member_dtl?seq_no=' + params.seq_no)
})

module.exports = router;