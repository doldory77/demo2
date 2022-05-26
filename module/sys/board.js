const express = require('express');
const router = express.Router();
const { query, cmmnUtil } = require('../cmmn/cmmn')
const fs = require('fs')
const path = require('path')

router.get('/board_mng', (req, res) => {
    viewBoard({}, res)
})

router.post('/board_mng', (req, res) => {
    viewBoard(Object.assign({}, req.body), res)
})

async function viewBoard(params, res) {
    console.log('params: ', params)
    newParams = {}
    if (params.chk_kind) {
        newParams.kind_cd = params.slt_kind
    }
    if (params.chk_titl_or_ctnt && params.slt_titl_or_ctnt == '1') {
        newParams.subject = params.titl_or_ctnt
    } else if (params.chk_titl_or_ctnt && params.slt_titl_or_ctnt == '2') {
        newParams.content = params.titl_or_ctnt
    }
    if (params.chk_write_dt) {
        newParams.start_write_dt = params.start_write_dt
        newParams.end_write_dt = params.end_write_dt
    }
    let board = await query('sys_board', 'selectBoardForList', newParams)
    let kind = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0800'})
    res.render('sys/board/board_mng', {board, kind, params})
}

router.post('/board_update', (req, res) => {
    (async function(){
        let newParams = Object.assign({writer:req.session.userId}, req.body)
        let content = newParams.content
        await cmmnUtil.boardInnerFileSave(content, newParams.kind_cd, async (content, orgFiles) => {
            newParams.content = content
            // console.log('2. content ==========> ', newParams.content)
            await query('sys_board', 'updateBoard', newParams)
            orgFiles.forEach(async (elem, idx) => {
                console.log(elem)
                await query('sys', 'insertFile', {
                    src_tbl_nm: newParams.kind_cd,
                    rf_key: newParams.board_no,
                    file_org_nm: elem,
                    file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.kind_cd).replace(/\\/gi, '\/'),
                    file_path: cmmnUtil.fileUrlPath(newParams.kind_cd),
                    file_nm: elem,
                    file_kind_cd: cmmnUtil.fileTypeCodeByExt(elem)
                })
            })
            res.redirect('/sys_board/board_dtl?board_no='+newParams.board_no)
        })
    })()

})

router.get('/board_write', (req, res) => {
    (async function(){
        let rtn = await query('sys_code', 'selectCdNm', {cd:req.query.kind_cd})
        let board_kind = {
            kind_cd:req.query.kind_cd, 
            kind_cd_nm: rtn[0].cd_nm 
        }
        res.render('sys/board/board_write', {board_kind})
    })()
})

router.post('/board_write_process', (req, res) => {
    (async function(){

        let newParams = Object.assign({writer:req.session.userId}, req.body)
        let content = newParams.content
        
        await cmmnUtil.boardInnerFileSave(content, newParams.kind_cd, async (content, orgFiles) => {
            newParams.content = content
            // console.log('2. content ==========> ', newParams.content)
            let result = await query('sys_board', 'insertBoard', newParams)
            orgFiles.forEach(async (elem, idx) => {
                console.log(elem)
                await query('sys', 'insertFile', {
                    src_tbl_nm: newParams.kind_cd,
                    rf_key: result.insertId,
                    file_org_nm: elem,
                    file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.kind_cd).replace(/\\/gi, '\/'),
                    file_path: cmmnUtil.fileUrlPath(newParams.kind_cd),
                    file_nm: elem,
                    file_kind_cd: cmmnUtil.fileTypeCodeByExt(elem)
                })
            })
            res.redirect('/sys_board/board_dtl?board_no='+result.insertId)
        })
        
    })()
})

router.get('/board_dtl', (req, res) => {
    viewBoardDetail(Object.assign({}, req.query), res)
})

async function viewBoardDetail(params, res) {
    let board = await query('sys_board', 'selectBoardByBoardNo', {board_no:params.board_no})
    let file = await query('sys', 'selectFile', {
        src_tbl_nm: board[0].kind_cd,
        rf_key: board[0].board_no
    })
    res.render('sys/board/board_dtl', {board:board[0], file})
}

/** 파일저장 공통화 */
cmmnUtil.setRouterForSaveFile(router, '/board_file_add', (params, res, etc) => {
    console.log(etc[0])
    res.redirect('/sys_board/board_dtl?board_no=' + etc[2])
})

/** 파일삭제 공통화 */
cmmnUtil.setRouterForDeleteFileBySeqNo(router, '/file_del/byboardno', (params, res) => {
    res.redirect('/sys_board/board_dtl?board_no=' + params.board_no)
})

module.exports = router;