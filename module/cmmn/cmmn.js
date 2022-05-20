const path = require('path')
const fs = require('fs')

module.exports = {
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
    fileTypeCode(mimetype) {
        if (/image/.test(mimetype)) {
            return '0201'
        } else {
            return '0205'
        }
    },
    fileRealPath(rootPath, type) {
        switch (type) {
            case 'portrait':
                return path.join(rootPath, 'public','img','portrait')
            default:
                return path.join(rootPath, 'public','etc')
        }
        
    },
    fileUrlPath(type) {
        switch (type) {
            case 'portrait':
                return '/img/portrait/'
            default:
                return '/etc/'
        }        
    },
    fileExt(orgFileNm) {
        if (/[.]/.test(orgFileNm)) {
            return '.' + orgFileNm.split('.')[1]
        } else {
            return orgFileNm
        }
    },
    setRouterForDeleteFileBySeqNo(router, query, url, callbackFun) {
        if (router) {
            router.post(url, (req, res) => {
                (async function(params){
                    // console.log(params)
                    for (let i=0; i<10; i++) {
                        if (params['file_del_yn'+i] !== undefined) {
                            let f = await query('sys', 'selectFile', {seq_no:params['file_del_yn'+i]})
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
                            await query('sys', 'deleteFileBySeqNo', {
                                seq_no: params['file_del_yn'+i]
                            })
                        }
                    }
                    if (callbackFun) callbackFun(params, res)
                })(req.body)
            })
        }
    }
    
}