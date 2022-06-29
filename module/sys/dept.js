const router = require('express').Router();
const { query, cmmnUtil } = require('../cmmn/cmmn')
const { logger } = require('../../config/logger')

router.get('/dept_mng', (req, res) => {
    viewDept(Object.assign({}, req.query), res)
})

router.post('/dept_mng', (req, res) => {
    viewDept(Object.assign({}, req.body), res)
})

async function viewDept(params, res) {
    
    logger.debug(params)
    let errors = []
    newParams = {}
    if (params.chk_ctg) {
        newParams.dept_ctg_cd = params.slt_ctg
    }
    if (params.chk_dept) {
        newParams.church_dept_cd = params.slt_dept
    }
    if (!params.page) {
        params.page = 1
    }
    newParams.row_cnt = global.rowCnt
    newParams.start_row = global.rowCnt * (Number(params.page) - 1)

    let dept = []
    try { dept = await query('sys_dept', 'selectDeptForList', newParams) }
    catch (error) {
        errors.push(error)
        logger.error(error)
        // console.log(':::[ERROR]::::', error)
    }
    let totalCnt = []
    totalCnt = await query('sys_dept', 'selectDeptForListTotalCnt', newParams)
    let ctg_cd = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'1000'})
    let dept_cd = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0600'})
  
    let paging = cmmnUtil.pagingObj(params.page, totalCnt)

    // console.log('## paging info ##', paging)
    logger.debug(paging)
    res.render('sys/dept/dept_mng', {dept, ctg_cd, dept_cd, params, errors, paging})
}

router.post('/dept_update', async (req, res) => {
    let errors = []
    let newParams = Object.assign({writer:req.session.userId}, req.body)
    let content = newParams.content

    await cmmnUtil.boardInnerFileSave(content, newParams.slt_dept, async (content, orgFiles) => {
        newParams.content = content
        // console.log('2. content ==========> ', newParams.content)
        try { await query('sys_dept', 'updateDept', newParams) }
        catch (error) {
            errors.push('sql error')
            // console.log(':::[ERROR]::::', error)
            logger.error(error)
            res.render('sys/error', {errors})
        }
        try {
            for (let i=0; i<orgFiles.length; i++) {
                await query('sys', 'insertFile', {
                    src_tbl_nm: newParams.slt_dept,
                    rf_key: newParams.seq_no,
                    file_org_nm: orgFiles[i],
                    file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.slt_dept).replace(/\\/gi, '\/'),
                    file_path: cmmnUtil.fileUrlPath(newParams.slt_dept),
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
        res.redirect('/sys_dept/dept_dtl?seq_no='+newParams.seq_no)
    }).catch(error => {
        errors.push('sql error')
        // console.log(':::[ERROR]::::', error)
        logger.error(error)
        res.render('sys/error', {errors})
    })

})

router.get('/dept_write', async (req, res) => {
    let ctg_cd = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'1000'})
    let dept_cd = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0600'})
    res.render('sys/dept/dept_write', {ctg_cd, dept_cd})
})

router.post('/dept_write_process', async (req, res) => {
    let errors = []
    let newParams = Object.assign({writer:req.session.userId}, req.body)
    let content = newParams.content
    
    await cmmnUtil.boardInnerFileSave(content, newParams.church_dept_cd, async (content, orgFiles) => {
        newParams.content = content
        // console.log('2. content ==========> ', newParams.content)
        let result = {}
        try { result = await query('sys_dept', 'insertDept', newParams) }
        catch (error) {
            errors.push('sql error')
            console.log(':::[ERROR]::::', error)
            logger.error(error)
            res.render('sys/error', {errors})
        }
        try {
            for (let i=0; i<orgFiles.length; i++) {
                await query('sys', 'insertFile', {
                    src_tbl_nm: newParams.church_dept_cd,
                    rf_key: result.insertId,
                    file_org_nm: orgFiles[i],
                    file_real_path: cmmnUtil.fileRealPath(global.appRoot, newParams.church_dept_cd).replace(/\\/gi, '\/'),
                    file_path: cmmnUtil.fileUrlPath(newParams.church_dept_cd),
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
        res.redirect('/sys_dept/dept_dtl?seq_no='+result.insertId)
    }).catch(error => {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
        logger.error(error)
        res.render('sys/error', {errors})
    })
    
})

router.get('/dept_dtl', (req, res) => {
    viewDeptDetail(Object.assign({}, req.query), res)
})

async function viewDeptDetail(params, res) {
    let errors = []
    let media = undefined
    let file = undefined
    let ctg_cd = undefined
    let dept_cd = undefined
    try {
        dept = await query('sys_dept', 'selectDeptBySeqNo', {seq_no:params.seq_no})
        file = await query('sys', 'selectFile', {
            src_tbl_nm: dept[0].church_dept_cd,
            rf_key: dept[0].seq_no
        })
        ctg_cd = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'1000'})
        dept_cd = await query('sys_code', 'selectCodeByParentCd', {parent_cd:'0600'})
    } catch (error) {
        errors.push('sql error')
        // console.log(':::[ERROR]::::', error)
        logger.error(error)
        res.render('sys/error', {errors})
    }
    res.render('sys/dept/dept_dtl', {dept:dept[0], file, ctg_cd, dept_cd})
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