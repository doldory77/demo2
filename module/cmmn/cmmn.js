const path = require('path')
const fs = require('fs')
const formidable = require('formidable')

const cmmnUtil = {
    /** 쿼리 공통 함수 */
    query : async function (nameSpace, id, params, emptyObject = []) {
        return new Promise((resolve, reject) => {
            let sql = global.sqlMap.getStatement(nameSpace, id, params, global.format)
            console.log(sql)
            global.dbPool.getConnection((err, conn) => {
                if (!err) {
                    conn.query(sql, (error, result) => {
                        // console.log(result)
                        if (error) reject(error)
                        resolve(result)
                    })
                } else {
                    reject(err)
                }
                conn.release()
            })
        }).then(result => {
            return result
        }).catch(error => {
            console.error(error)
            return emptyObject
        })
    },
    /** 쿼리 공통 함수(개선) */
    query2 : function (nameSpace, id, params) {
        return new Promise((resolve, reject) => {
            let sql = global.sqlMap.getStatement(nameSpace, id, params, global.format)
            if (global.isDebug) console.log(sql)
            global.dbPool.getConnection((err, conn) => {
                if (!err) {
                    conn.query(sql, (error, result) => {
                        if (global.isDebug) console.log(result)
                        if (error) reject(error)
                        resolve(result)
                    })
                } else {
                    reject(err)
                }
                conn.release()
            })
        })
    },
    /** mimetype으로 파일유형 공통코드 제공 */
    fileTypeCode(mimetype) {
        if (/image/.test(mimetype)) {
            return '0201'
        } else {
            return '0205'
        }
    },
    /** type으로 물리경로 제공  */
    fileRealPath(rootPath, type) {
        switch (type) {
            case 'portrait':
                return path.join(rootPath, 'public','img','portrait')
            case '0801':
                return path.join(rootPath, 'public','img','0801')
            case '0802':
                return path.join(rootPath, 'public','img','0802')
            case '0803':
                return path.join(rootPath, 'public','img','0803')
            case '0804':
                return path.join(rootPath, 'public','img','0804')
            case '0805':
                return path.join(rootPath, 'public','img','0805')
            case '0806':
                return path.join(rootPath, 'public','img','0806')
            case '0807':
                return path.join(rootPath, 'public','img','0807')
            default:
                return path.join(rootPath, 'public','etc')
        }
        
    },
    /** type으로 공개영역 경로 제공 */
    fileUrlPath(type) {
        switch (type) {
            case 'portrait':
                return '/img/portrait/'
            case '0801':
                return '/img/0801/'
            case '0802':
                return '/img/0802/'
            case '0803':
                return '/img/0803/'
            case '0804':
                return '/img/0804/'
            case '0805':
                return '/img/0805/'
            case '0806':
                return '/img/0806/'
            case '0807':
                return '/img/0807/'
            default:
                return '/etc/'
        }        
    },
    /** 파일의 확장자만 추출 */
    fileExt(orgFileNm) {
        if (/[.]/.test(orgFileNm)) {
            return '.' + orgFileNm.split('.')[1]
        } else {
            return orgFileNm
        }
    },
    /** 파일확장자로 파일유형 코드 제공 */
    fileTypeCodeByExt(fileName) {
        if (/[.](jpg|png|gif|jpeg|psd|pic|raw|tiff|bmp)$/i.test(fileName)) {
            return '0201'
        } else if (/[.](avi|flv|mkv|mov|mp3|mp4|wav|wma)$/i.test(fileName)) {
            return '0206'
        } else if (/[.](doc|docx|html|hwp|pdf|txt|xlx|xlsx|ppt|pptx)$/i.test(fileName)) {
            return '0203'
        } else if (/[.](zip|7z|rar|tar|alz|egg)$/i.test(fileName)) {
            return '0204'
        } else {
            return '0205'   // 기타
        }
    },
    /** 파일저장 공통함수 */
    setRouterForSaveFile(router, url, callbackFun) {
        let ctx = this
        if (router) {
            router.post(url, (req, res) => {
                var form = new formidable.IncomingForm();
                form.multiples = true
                form.keepExtensions = true
                form.parse(req, async (err, fields, files) => {
                    let rtn = await (function(){
                        return new Promise((resolve, reject) => {
                            if (err) reject(err)
                            let i = 0;
                            let f = undefined;
                            while (true) {
                                if (files['fileX'+i] == undefined) {
                                    break
                                }
                                f = files['fileX'+i]
                                
                                fs.rename(f.filepath, path.join(ctx.fileRealPath(global.appRoot, fields.file_path), f.newFilename + ctx.fileExt(f.originalFilename)), (err) => {
                                    if (err) reject(err)
                                })
                                ctx.query('sys', 'insertFile', {
                                    src_tbl_nm: fields.src_tbl_nm,
                                    rf_key: fields.rf_key,
                                    file_org_nm: f.originalFilename,
                                    file_real_path: ctx.fileRealPath(global.appRoot, fields.file_path).replace(/\\/gi, '\/'),
                                    file_path: ctx.fileUrlPath(fields.file_path),
                                    file_nm: f.newFilename + ctx.fileExt(f.originalFilename),
                                    file_kind_cd: ctx.fileTypeCodeByExt(f.originalFilename)
                                })
                                i++
                                if (i > 100) break
                            }       
                            resolve((i+1) + "")                          
                        }).then(result => {
                            return result
                        }).catch(error => {
                            return error
                        })
                    })()
                    console.log('fields: ', fields)
                    console.log('files: ', files)
                    if (callbackFun) callbackFun(fields, res, [rtn, fields.src_tbl_nm, fields.rf_key])
                })
            })
        }
    },
    /** 파일저장 공통함수(개선) */
    saveFile: function(req, callbackFun) {
        let ctx = this
        let form = new formidable.IncomingForm();
        form.multiples = true
        form.keepExtensions = true

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(':::[ERROR]::::', err)
                throw new Error('form parse error')
            }

            let i = 0;
            let f = undefined;
            while (true) {
                if (files['fileX'+i] == undefined) {
                    break
                }
                f = files['fileX'+i]
                let rtn = 'fail'
                try { 
                    rtn = await (function(){
                        return new Promise((rsl, rjt) => {
                            fs.rename(
                                f.filepath
                                , path.join(ctx.fileRealPath(global.appRoot, fields.file_path), f.newFilename + ctx.fileExt(f.originalFilename))
                                , (err) => {
                                    if (err) rjt(err)
                                    rsl('success')
                                }
                            )
                        })
                    })() 
                } catch (err) {
                    console.log(':::[ERROR]::::', err)
                    throw new Error('fs rename error')
                }
                try {
                    if (rtn === 'success') {
                        await ctx.query2('sys', 'insertFile', {
                            src_tbl_nm: fields.src_tbl_nm,
                            rf_key: fields.rf_key,
                            file_org_nm: f.originalFilename,
                            file_real_path: ctx.fileRealPath(global.appRoot, fields.file_path).replace(/\\/gi, '\/'),
                            file_path: ctx.fileUrlPath(fields.file_path),
                            file_nm: f.newFilename + ctx.fileExt(f.originalFilename),
                            file_kind_cd: ctx.fileTypeCodeByExt(f.originalFilename)
                        })
                        rtn = 'fail'
                    } 
                } catch (error) {
                    throw new Error('fs rename error')
                }
                i++
                if (i > 100) break
            }
            
            // console.log('fields: ', fields)
            // console.log('files: ', files)
            if (callbackFun) callbackFun((i+1) + "", fields)
        })
        
    },
    /** 파일삭제 공통함수
     * 제약: 20개까지 삭제 가능
     */
    setRouterForDeleteFileBySeqNo(router, url, callbackFun) {
        let ctx = this
        if (router) {
            router.post(url, (req, res) => {
                (async function(params){
                    // console.log(params)
                    for (let i=0; i<20; i++) {
                        if (params['file_del_yn'+i] !== undefined) {
                            let f = await ctx.query('sys', 'selectFile', {seq_no:params['file_del_yn'+i]})
                            fs.access(path.join(f[0].file_real_path, f[0].file_nm)
                                , fs.constants.F_OK
                                , err => {
                                    if (err) {
                                        console.log(err)
                                        return
                                    }
                                    fs.unlink(path.join(f[0].file_real_path, f[0].file_nm), err => {
                                        if (err) console.log(err)
                                    })
                                }
                            )
                            await ctx.query('sys', 'deleteFileBySeqNo', {
                                seq_no: params['file_del_yn'+i]
                            })
                        }
                    }
                    if (callbackFun) callbackFun(params, res)
                })(req.body)
            })
        }
    },
    /** 파일삭제 공통함수(개선)
     * 제약: 20개까지 삭제 가능
     */
    deleteFile: async function (req, callbackFun) {
        let ctx = this
        let j = 0
        let params = req.body
        // console.log(params)
        for (let i=0; i<20; i++) {
            if (params['file_del_yn'+i] !== undefined) {
                let f = []
                try { f = await ctx.query2('sys', 'selectFile', {seq_no:params['file_del_yn'+i]}) }
                catch (err) {
                    console.log(':::[ERROR]::::', err)
                    throw new Error('sql error')
                }
                let rtn = 'fail'
                try { 
                    rtn = await (function(){
                        return new Promise((rsl, rjt) => {
                            fs.unlink(
                                path.join(f[0].file_real_path, f[0].file_nm)
                                , err => {
                                    if (err) { /*rjt(err)*/ }
                                    j++
                                    rsl('success')
                                }
                            )
                        })
                    })()
                } catch (err) {
                    console.log(':::[ERROR]::::', err)
                    throw new Error('file delete error')
                }
                if (rtn === 'success') {
                    try {
                        await ctx.query2('sys', 'deleteFileBySeqNo', {
                            seq_no: params['file_del_yn'+i]
                        })
                        rtn = 'fail'
                    } catch (err) {
                        console.log(':::[ERROR]::::', err)
                        throw new Error('sql error')
                    }
                }
            }
        }
        if (callbackFun) callbackFun((j+1) + "")
    },
    boardInnerFileSave: async function(content, src_tbl_nm, callbackFun) {
        let ctx = this
        let orgFiles = []
        let matches = content.match(/data-filename=\"(.*?)\"/g)
        // console.log('matches : ', matches)
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
            matches = content.match(/src=\"data:image\/.{3,4};base64,(.*?)\"/g)
            if (matches) {
                matches.forEach(async (elem, idx) => {
                    let rtn = elem.match(/src=\"data:image\/.{3,4};base64,(.*)\"/)
                    content = content.replace(rtn[0], 'src="' + ctx.fileUrlPath(src_tbl_nm) + orgFiles[idx] + '"')
                    let xx = 'fail'
                    try {
                        xx = await (function(){
                            return new Promise((rsl, rjt) => {
                                fs.writeFile(
                                    path.join(ctx.fileRealPath(global.appRoot, src_tbl_nm), orgFiles[idx])
                                    ,rtn[1]
                                    ,'base64'
                                    ,function(err) {
                                        if (err) rjt(err)
                                        rsl('success')
                                    }
                                )
    
                            })    
                        })()
                    } catch (err) {
                        console.log(':::[ERROR]::::', err)
                        throw new Error('file write error')
                    }
                })
                // console.log(content)
            }
        }
        // console.log('1. content ==========> ', content)
        if (callbackFun) {
            callbackFun(content, orgFiles)
        }
    }
    
}

module.exports = {query: cmmnUtil.query, query2: cmmnUtil.query2, cmmnUtil}