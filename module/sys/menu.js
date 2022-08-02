const express = require('express');
const router = express.Router();
const { query } = require('../cmmn/cmmn')

router.get('/menu_mng', (req, res) => {
    // processMenuMng({}, res)
    menuMng(req, res)
})

router.post('/menu_mng', (req, res) => {
    // processMenuMng(Object.assign({}, req.body), res)
    menuMng(req, res)
})

async function menuMng(req, res) {
    let menus = await query('sys_menu', 'selectMenu', {})
    res.render('sys/menu/menu_mng2', {menus})
}

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

router.post('/menu_mng_insert', async (req, res) => {
    let menuCd
    let ordNo
    if (req.body.lv == 1) {
        menuCd = await query('sys_menu', 'selectBigMenuCd', {})
        menuCd = menuCd[0].next_big_menu_cd
        ordNo = await query('sys_menu', 'selectBigOrdNo', {})
        ordNo = ordNo[0].next_big_ord_no
    } else if (req.body.lv == 2) {
        menuCd = await query('sys_menu', 'selectSmallMenuCd', {parent_menu_cd:req.body.parent_menu_cd})
        menuCd = menuCd[0].next_small_menu_cd
        ordNo = await query('sys_menu', 'selectSmallOrdNo', {parent_menu_cd:req.body.parent_menu_cd})
        ordNo = ordNo[0].next_small_ord_no
    }

    if (req.body['ord_no']) {
        ordNo = req.body['ord_no']
    }
    let result = await query('sys_menu', 'insertMenu', {
        parent_menu_cd: req.body.parent_menu_cd,
        menu_cd: menuCd,
        menu_nm: req.body.menu_nm,
        url: req.body.url || '',
        use_yn: req.body.use_yn || '1',
        ord_no: ordNo
    })
    res.send({result})
})

module.exports = router;