const router = require('express').Router();
const { query, cmmnUtil } = require('../cmmn/cmmn')
const { logger } = require('../../config/logger')

router.get('/media_mng', (req, res) => {
    viewMedia(Object.assign({}, req.query), res)
})

router.post('/media_mng', (req, res) => {
    viewMedia(Object.assign({}, req.body), res)
})

async function viewMedia(params, res) {
    
    logger.debug(params)
    let errors = []
    newParams = {}
    if (params.chk_kind) {
        newParams.kind_cd = params.slt_kind
    }
    if (params.chk_ctnt && params.slt_ctnt == '1') {
        newParams.event_nm = params.srch_ctnt
    } else if (params.chk_ctnt && params.slt_ctnt == '2') {
        newParams.preacher = params.srch_ctnt
    } else if (params.chk_ctnt && params.slt_ctnt == '3') {
        newParams.subject = params.srch_ctnt
    } else if (params.chk_ctnt && params.slt_ctnt == '4') {
        newParams.content = params.srch_ctnt
    }
    if (params.chk_event_dt) {
        newParams.start_event_dt = params.start_event_dt
        newParams.end_event_dt = params.end_event_dt
    }
    if (!params.page) {
        params.page = 1
    }
    newParams.row_cnt = global.rowCnt
    newParams.start_row = global.rowCnt * (Number(params.page) - 1)

    let media = []
    try { media = await query('sys_media', 'selectMediaForList', newParams) }
    catch (error) {
        errors.push('sql error')
        logger.error(error)
        // console.log(':::[ERROR]::::', error)
    }
    let totalCnt = []
    totalCnt = await query('sys_media', 'selectMediaForListTotalCnt', newParams)
    let kind = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0500'})
  
    let paging = cmmnUtil.pagingObj(params.page, totalCnt)

    // console.log('## paging info ##', paging)
    logger.debug(paging)
    res.render('sys/media/media_mng', {media, kind, params, errors, paging})
}

router.post('/media_update', (req, res) => {
    (async function(){
        let errors = []
        let newParams = Object.assign({writer:req.session.userId}, req.body)
        let content = newParams.content

        await cmmnUtil.boardInnerFileSave(content, newParams.kind_cd, async (content, orgFiles) => {
            newParams.content = content
            // console.log('2. content ==========> ', newParams.content)
            try { await query('sys_media', 'updateMedia', newParams) }
            catch (error) {
                errors.push('sql error')
                // console.log(':::[ERROR]::::', error)
                logger.error(error)
                res.render('sys/error', {errors})
            }
            try {
                for (let i=0; i<orgFiles.length; i++) {
                    await query('sys', 'insertFile', {
                        src_tbl_nm: newParams.kind_cd,
                        rf_key: newParams.seq_no,
                        file_org_nm: orgFiles[i],
                        file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.kind_cd).replace(/\\/gi, '\/'),
                        file_path: cmmnUtil.fileUrlPath(newParams.kind_cd),
                        file_nm: orgFiles[i],
                        file_kind_cd: cmmnUtil.fileTypeCodeByExt(orgFiles[i])
                    })
                }
            } catch (error) {
                errors.push('sql error')
                // console.log(':::[ERROR]::::', error)
                logger.error(error)
                res.render('sys/error', {errors})
            }
            res.redirect('/sys_media/media_dtl?seq_no='+newParams.seq_no)
        }).catch(error => {
            errors.push('sql error')
            // console.log(':::[ERROR]::::', error)
            logger.error(error)
            res.render('sys/error', {errors})
        })

    })()

})

router.get('/media_write', (req, res) => {
    (async function(){
        let errors = []
        let rtn = []
        try { rtn = await query('sys_code', 'selectCdNm', {cd:req.query.kind_cd}) }
        catch (error) {
            errors.push('sql error')
            // console.log(':::[ERROR]::::', error)
            logger.error(error)
            res.render('sys/error', {errors})
        }
        let media_kind = {
            kind_cd:req.query.kind_cd, 
            kind_cd_nm: rtn[0].cd_nm 
        }
        res.render('sys/media/media_write', {media_kind})
    })()
})

router.post('/media_write_process', (req, res) => {
    (async function(){
        let errors = []
        let newParams = Object.assign({writer:req.session.userId}, req.body)
        let content = newParams.content
        
        await cmmnUtil.boardInnerFileSave(content, newParams.kind_cd, async (content, orgFiles) => {
            newParams.content = content
            // console.log('2. content ==========> ', newParams.content)
            let result = {}
            try { result = await query('sys_media', 'insertMedia', newParams) }
            catch (error) {
                errors.push('sql error')
                console.log(':::[ERROR]::::', error)
                logger.error(error)
                res.render('sys/error', {errors})
            }
            try {
                for (let i=0; i<orgFiles.length; i++) {
                    await query('sys', 'insertFile', {
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
                errors.push(error)
                console.log(':::[ERROR]::::', error)
                logger.error(error)
                res.render('sys/error', {errors})
            }
            res.redirect('/sys_media/media_dtl?seq_no='+result.insertId)
        }).catch(error => {
            errors.push('sql error')
            console.log(':::[ERROR]::::', error)
            logger.error(error)
            res.render('sys/error', {errors})
        })
        
    })()
})

router.get('/media_dtl', (req, res) => {
    viewMediaDetail(Object.assign({}, req.query), res)
})

async function viewMediaDetail(params, res) {
    let errors = []
    let media = undefined
    let file = undefined
    try {
        media = await query('sys_media', 'selectMeidaBySeqNo', {seq_no:params.seq_no})
        file = await query('sys', 'selectFile', {
            src_tbl_nm: media[0].kind_cd,
            rf_key: media[0].seq_no
        })
    } catch (error) {
        errors.push('sql error')
        // console.log(':::[ERROR]::::', error)
        logger.error(error)
        res.render('sys/error', {errors})
    }
    res.render('sys/media/media_dtl', {media:media[0], file})
}

router.post('/media_file_add', (req, res) => {
    let errors = []
    try {
        cmmnUtil.saveFile(req, (addCnt, fields) => {
            res.redirect('/sys_media/media_dtl?board_no=' + fields.rf_key)
        })
    } catch (error) {
        errors.push('sql error')
        // console.log(':::[ERROR]::::', error)
        logger.error(error)
        res.render('sys/error', {errors})
    }
})

router.post('/file_del/byseqno', (req, res) => {
    let errors = []
    cmmnUtil.deleteFile(req, dellCnt => {
        res.redirect('/sys_media/media_dtl?seq_no=' + req.body.seq_no)
    }).catch(error => {
        errors.push('sql error')
        // console.log(':::[ERROR]::::', error)
        logger.error(error)
        res.render('sys/error', {errors})
    })
})

module.exports = router;