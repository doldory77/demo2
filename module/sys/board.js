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
    if (params.chk_titl_or_ctnt && params.chk_titl_or_ctnt == '1') {
        newParams.subject = params.titl_or_ctnt
    } else if (params.chk_titl_or_ctnt && params.chk_titl_or_ctnt == '2') {
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
        // console.log('XXXX : ', req.body)
        let newParams = Object.assign({writer:req.session.userId}, req.body)
        
        // console.log(result)
        
        // res.redirect('/sys_board/board_dtl?board_no=' + result.insertId)
        let content = newParams.content
        // let matches = content.match(/src=\"data:image\/png;base64,(.*?)\"/g)
        let orgFiles = []
        let matches = content.match(/data-filename=\"(.*?)\"/g)
        if (matches) {
            matches.forEach((elem, idx) => {
                let rtn = elem.match(/data-filename=\"(.*)\"/)
                if (rtn) {
                    // console.log(rtn[1])
                    content = content.replace(rtn[0], '')
                    orgFiles.push(rtn[1])
                }
            })
        }
        if (orgFiles && orgFiles.length > 0) {
            matches = content.match(/src=\"data:image\/png;base64,(.*?)\"/g)
            if (matches) {
                matches.forEach((elem, idx) => {
                    let rtn = elem.match(/src=\"data:image\/png;base64,(.*)\"/)
                    content = content.replace(rtn[0], 'src="' + cmmnUtil.fileUrlPath(newParams.kind_cd) + orgFiles[idx] + '"')
                    fs.writeFile(
                            path.join(cmmnUtil.fileRealPath(global.appRoot, newParams.kind_cd), orgFiles[idx])
                            ,rtn[1]
                            ,'base64'
                            ,function(err) {
                                if (err) {
                                    console.log(err)
                                }
                            }
                    )
                })
                console.log(content)
            }
        }

        newParams.content = content
        console.log(newParams)
        
        let result = await query('sys_board', 'insertBoard', newParams)
        // for (let i=0; i<orgFiles.length; i++) {
        // }
        orgFiles.forEach(async (elem, idx) => {
            await query('sys', 'insertFile', {
                src_tbl_nm: newParams.kind_cd,
                rf_key: result.insertId,
                file_org_nm: elem,
                file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.kind_cd).replace(/\\/gi, '\/'),
                file_path: cmmnUtil.fileUrlPath(newParams.kind_cd),
                file_nm: elem,
                file_kind_cd: '0201'
            })
        })
        res.redirect('/sys_board/board_dtl?board_no='+result.insertId)
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

// router.post('/member_contact_add', (req, res) => {
//     (async function(params){
//         // console.log(params)
//         let i = 0;
//         while (true) {
//             if (params['contack_no'+i] == undefined) {
//                 break;
//             }
//             await query('sys_member', 'insertContact', {
//                 mb_seq_no: params.seq_no,
//                 kind_cd: params['slt_contact_kind'+i],
//                 contact_no: params['contack_no'+i]
//             })
//             i++
//             if (i > 100) break
//         }
//         res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
//     })(req.body)
// })

// router.post('/member_addr_add', (req, res) => {
//     (async function(params){
//         // console.log(params)
//         let i = 0;
//         while (true) {
//             if (params['addr'+i] == undefined) {
//                 break;
//             }
//             await query('sys_member', 'insertAddr', {
//                 mb_seq_no: params.seq_no,
//                 postal_cd: params['postal_cd'+i],
//                 addr: params['addr'+i],
//                 addr_detail: params['detail'+i]
//             })
//             i++
//             if (i > 100) break
//         }
//         // viewMemberDetail(params, res)
//         res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
//     })(req.body)
// })

// router.post('/member_contact_mod', (req, res) => {
//     (async function(params){
//         // console.log(params)
//         let i = 0;
//         while (true) {
//             if (params['contact_seq_no'+i] == undefined) {
//                 break;
//             }
//             if (params['contact_del_yn'+i] !== undefined) {
//                 await query('sys_member', 'deleteContactBySeqNo', {seq_no:params['contact_seq_no'+i]})
//                 i++
//                 continue
//             }
//             await query('sys_member', 'updateContact', {
//                 kind_cd: params['slt_contact_kind'+i],
//                 contact_no: params['contack_no'+i],
//                 seq_no: params['contact_seq_no'+i]
//             })
//             // console.log(params['contact_seq_no'+i])
//             i++
//             if (i > 100) break
//         }
//         // viewMemberDetail(params, res)
//         res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
//     })(req.body)
// })

// router.post('/member_addr_mod', (req, res) => {
//     (async function(params){
//         // console.log(params)
//         let i = 0;
//         while (true) {
//             if (params['addr_seq_no'+i] == undefined) {
//                 break;
//             }
//             if (params['addr_del_yn'+i] !== undefined) {
//                 await query('sys_member', 'deleteAddrBySeqNo', {seq_no:params['addr_seq_no'+i]})
//                 i++
//                 continue
//             }
//             await query('sys_member', 'updateAddr', {
//                 postal_cd: params['postal_cd'+i],
//                 addr: params['addr'+i],
//                 addr_detail: params['detail'+i],
//                 seq_no: params['addr_seq_no'+i]
//             })
//             // console.log(params['contact_seq_no'+i])
//             i++
//             if (i > 100) break
//         }
//         // viewMemberDetail(params, res)
//         res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
//     })(req.body)
// })

// /** 파일저장 공통화 */
// cmmnUtil.setRouterForSaveFile(router, '/member_portrait_add', (params, res, etc) => {
//     console.log(etc[0])
//     res.redirect('/sys_member/member_dtl?seq_no=' + etc[2])
// })

// /** 파일삭제 공통화 */
// cmmnUtil.setRouterForDeleteFileBySeqNo(router, '/file_del/byseqno', (params, res) => {
//     res.redirect('/sys_member/member_dtl?seq_no=' + params.seq_no)
// })

module.exports = router;