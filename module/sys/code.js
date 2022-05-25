const url = require('url');
const express = require('express');
const router = express.Router();
const { query, cmmnUtil } = require('../cmmn/cmmn')

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
        await query('sys_code', 'insertCode', newParams)
    } else if (params && params.submit_mode == 'mod_parent_save') {
        // 상위코드수정 저장
        newParams.cd = params.mod_p_cd
        newParams.cd_nm = params.mod_p_cd_nm
        newParams.ord_no = params.mod_p_ord_no
        await query('sys_code', 'updateCode', newParams)
    } else if (params && params.submit_mode == 'new_child_save') {
        // 신규하위코드 저장
        newParams.cd = params.new_c_cd
        newParams.parent_cd = params.new_c_parent_cd
        newParams.cd_nm = params.new_c_cd_nm
        newParams.ord_no = params.new_c_ord_no
        await query('sys_code', 'insertCode', newParams)
    } else if (params && params.submit_mode == 'mod_child_save') {
        // 하위코드수정 저장
        newParams.cd = params.mod_c_cd
        newParams.cd_nm = params.mod_c_cd_nm
        newParams.ord_no = params.mod_c_ord_no
        newParams.parent_cd = params.mod_c_parent_cd
        await query('sys_code', 'updateCode', newParams)
    }

    let parentCode = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0000'})
    if (params && params.selected_parent_cd) {
        newParams.parent_cd = params.selected_parent_cd
        selectedParentCd = await query('sys_code', 'selectCodeByCd', {cd:params.selected_parent_cd})
        console.log('selectedParentCd: ', selectedParentCd)
    } else {
        newParams.parent_cd = parentCode[0].cd
    }
    let childCode = await query('sys_code', 'selectCodeByParentCd', {parent_cd:newParams.parent_cd})

    res.render('sys/code/code_mng', {parentCode, childCode, selectedParentCd})
    
}

module.exports = router;