const path = require('path')

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
    filePath(rootPath, type) {
        switch (type) {
            case 'portrait':
                return path.join(rootPath, 'public','img','portrait')
            default:
                return path.join(rootPath, 'public','etc')
        }
        
    },
    fileExt(orgFileNm) {
        if (/[.]/.test(orgFileNm)) {
            return '.' + orgFileNm.split('.')[1]
        } else {
            return orgFileNm
        }
    }
    
}