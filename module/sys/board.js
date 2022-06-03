// const express = require('express');
const router = require('express').Router();
const { query2, cmmnUtil } = require('../cmmn/cmmn')
// const fs = require('fs')
// const path = require('path');
// const { query } = require('express');
const { logger } = require('../../config/logger')

router.get('/board_mng', (req, res) => {
    viewBoard(Object.assign({}, req.query), res)
})

router.post('/board_mng', (req, res) => {
    viewBoard(Object.assign({}, req.body), res)
})

async function viewBoard(params, res) {
    
    logger.debug(params)
    let errors = []
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
    if (!params.page) {
        params.page = 1
    }
    newParams.row_cnt = global.rowCnt
    newParams.start_row = global.rowCnt * (Number(params.page) - 1)

    let board = []
    try { board = await query2('sys_board', 'selectBoardForList', newParams) }
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    let totalCnt = []
    totalCnt = await query2('sys_board', 'selectBoardForListTotalCnt', newParams)
    let kind = await query2('sys_code', 'selectCodeByParentCd', {parent_cd:'0800'})

    // let paging = {rowCnt : global.rowCnt}
    // paging.totalCnt = totalCnt[0].total_cnt
    // paging.totalPage = Math.ceil(totalCnt[0].total_cnt / global.rowCnt)
    // paging.currPage = params.page
    // paging.totalBlock = Math.ceil(paging.totalPage / global.blockCnt)
    // paging.currBlock = Math.floor((paging.currPage-1)/global.blockCnt)+1
    // paging.startPage = (paging.currBlock - 1) * global.blockCnt + 1
    // paging.endPage = paging.startPage + global.blockCnt - 1
    // paging.endPage = paging.totalPage < paging.endPage ? paging.totalPage : paging.endPage
    // paging.prevPage = paging.startPage - 1 > 0 ? paging.startPage - 1 : -1
    // paging.nextPage = paging.endPage + 1 <= paging.totalPage ? paging.endPage + 1 : -1
    let paging = cmmnUtil.pagingObj(params.page, totalCnt)

    console.log('## paging info ##', paging)
    res.render('sys/board/board_mng', {board, kind, params, errors, paging})
}

router.post('/board_update', (req, res) => {
    (async function(){
        let errors = []
        let newParams = Object.assign({writer:req.session.userId}, req.body)
        let content = newParams.content
        // await cmmnUtil.boardInnerFileSave(content, newParams.kind_cd, async (content, orgFiles) => {
        //     newParams.content = content
        //     // console.log('2. content ==========> ', newParams.content)
        //     await query('sys_board', 'updateBoard', newParams)
        //     orgFiles.forEach(async (elem, idx) => {
        //         console.log(elem)
        //         await query('sys', 'insertFile', {
        //             src_tbl_nm: newParams.kind_cd,
        //             rf_key: newParams.board_no,
        //             file_org_nm: elem,
        //             file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.kind_cd).replace(/\\/gi, '\/'),
        //             file_path: cmmnUtil.fileUrlPath(newParams.kind_cd),
        //             file_nm: elem,
        //             file_kind_cd: cmmnUtil.fileTypeCodeByExt(elem)
        //         })
        //     })
        //     res.redirect('/sys_board/board_dtl?board_no='+newParams.board_no)
        // })

        await cmmnUtil.boardInnerFileSave(content, newParams.kind_cd, async (content, orgFiles) => {
            newParams.content = content
            // console.log('2. content ==========> ', newParams.content)
            try { await query2('sys_board', 'updateBoard', newParams) }
            catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                res.render('sys/error', {errors})
            }
            try {
                for (let i=0; i<orgFiles.length; i++) {
                    await query2('sys', 'insertFile', {
                        src_tbl_nm: newParams.kind_cd,
                        rf_key: newParams.board_no,
                        file_org_nm: orgFiles[i],
                        file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.kind_cd).replace(/\\/gi, '\/'),
                        file_path: cmmnUtil.fileUrlPath(newParams.kind_cd),
                        file_nm: orgFiles[i],
                        file_kind_cd: cmmnUtil.fileTypeCodeByExt(orgFiles[i])
                    })
                }
            } catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                res.render('sys/error', {errors})
            }
            res.redirect('/sys_board/board_dtl?board_no='+newParams.board_no)
        }).catch(error => {
            errors.push('sql error')
            console.log(':::[ERROR]::::', error)
            res.render('sys/error', {errors})
        })

    })()

})

router.get('/board_write', (req, res) => {
    (async function(){
        let errors = []
        let rtn = []
        try { rtn = await query2('sys_code', 'selectCdNm', {cd:req.query.kind_cd}) }
        catch (error) {
            errors.push('sql error')
            console.log(':::[ERROR]::::', error)
            res.render('sys/error', {errors})
        }
        let board_kind = {
            kind_cd:req.query.kind_cd, 
            kind_cd_nm: rtn[0].cd_nm 
        }
        res.render('sys/board/board_write', {board_kind})
    })()
})

router.post('/board_write_process', (req, res) => {
    (async function(){
        let errors = []
        let newParams = Object.assign({writer:req.session.userId}, req.body)
        let content = newParams.content
        
        await cmmnUtil.boardInnerFileSave(content, newParams.kind_cd, async (content, orgFiles) => {
            newParams.content = content
            // console.log('2. content ==========> ', newParams.content)
            let result = {}
            try { result = await query2('sys_board', 'insertBoard', newParams) }
            catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                res.render('sys/error', {errors})
            }
            try {
                for (let i=0; i<orgFiles.length; i++) {
                    await query2('sys', 'insertFile', {
                        src_tbl_nm: newParams.kind_cd,
                        rf_key: result.insertId,
                        file_org_nm: orgFiles[i],
                        file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.kind_cd).replace(/\\/gi, '\/'),
                        file_path: cmmnUtil.fileUrlPath(newParams.kind_cd),
                        file_nm: orgFiles[i],
                        file_kind_cd: cmmnUtil.fileTypeCodeByExt(orgFiles[i])
                    })
                }
            } catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                res.render('sys/error', {errors})
            }
            res.redirect('/sys_board/board_dtl?board_no='+result.insertId)
        }).catch(error => {
            errors.push('sql error')
            console.log(':::[ERROR]::::', error)
            res.render('sys/error', {errors})
        })
        
    })()
})

router.get('/board_dtl', (req, res) => {
    viewBoardDetail(Object.assign({}, req.query), res)
})

async function viewBoardDetail(params, res) {
    let errors = []
    let board = undefined
    let file = undefined
    try {
        board = await query2('sys_board', 'selectBoardByBoardNo', {board_no:params.board_no})
        file = await query2('sys', 'selectFile', {
            src_tbl_nm: board[0].kind_cd,
            rf_key: board[0].board_no
        })
    } catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
        res.render('sys/error', {errors})
    }
    res.render('sys/board/board_dtl', {board:board[0], file})
}

/** 파일저장 공통화 */
// cmmnUtil.setRouterForSaveFile(router, '/board_file_add', (params, res, etc) => {
//     console.log(etc[0])
//     res.redirect('/sys_board/board_dtl?board_no=' + etc[2])
// })

/** 파일삭제 공통화 */
// cmmnUtil.setRouterForDeleteFileBySeqNo(router, '/file_del/byboardno', (params, res) => {
//     res.redirect('/sys_board/board_dtl?board_no=' + params.board_no)
// })

router.post('/board_file_add', (req, res) => {
    let errors = []
    try {
        cmmnUtil.saveFile(req, (addCnt, fields) => {
            res.redirect('/sys_board/board_dtl?board_no=' + fields.rf_key)
        })
    } catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
        res.render('sys/error', {errors})
    }
})

router.post('/file_del/byboardno', (req, res) => {
    let errors = []
    cmmnUtil.deleteFile(req, dellCnt => {
        res.redirect('/sys_board/board_dtl?board_no=' + req.body.board_no)
    }).catch(error => {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
        res.render('sys/error', {errors})
    })
})

module.exports = router;