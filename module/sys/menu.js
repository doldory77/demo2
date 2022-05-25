const express = require('express');
const router = express.Router();
const { query } = require('../cmmn/cmmn')

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
        await query('sys_menu', 'insertCode', newParams)
    } else if (params && params.submit_mode == 'mod_parent_save') {
        // 상위코드수정 저장
        newParams.cd = params.mod_p_cd
        newParams.cd_nm = params.mod_p_cd_nm
        newParams.ord_no = params.mod_p_ord_no
        await query('sys_menu', 'updateCode', newParams)
    } else if (params && params.submit_mode == 'new_child_save') {
        // 신규하위코드 저장
        newParams.cd = params.new_c_cd
        newParams.parent_cd = params.new_c_parent_cd
        newParams.cd_nm = params.new_c_cd_nm
        newParams.ord_no = params.new_c_ord_no
        await query('sys_menu', 'insertCode', newParams)
    } else if (params && params.submit_mode == 'mod_child_save') {
        // 하위코드수정 저장
        newParams.cd = params.mod_c_cd
        newParams.cd_nm = params.mod_c_cd_nm
        newParams.ord_no = params.mod_c_ord_no
        newParams.parent_cd = params.mod_c_parent_cd
        await query('sys_menu', 'updateCode', newParams)
    }

    let parentMenu = await query('sys_menu', 'selectMenu', {parent_menu_cd:'0000'})
    if (params && params.selected_parent_menu_cd) {
        newParams.parent_menu_cd = params.selected_parent_menu_cd
        selectedParentMenu = await query('sys_menu', 'selectMenu', {menu_cd:params.selected_parent_menu_cd})
        console.log('selectedParentMenu: ', selectedParentMenu)
    } else {
        newParams.parent_menu_cd = parentMenu[0].menu_cd
    }
    let childMenu = await query('sys_menu', 'selectMenu', {parent_menu_cd:newParams.parent_menu_cd})

    res.render('sys/menu/menu_mng', {parentMenu, childMenu, selectedParentMenu})
    
}

module.exports = router;