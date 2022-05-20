const path = require('path')
const fs = require('fs')
const f = 'C:/Users/youngjae2.jeon/dev/node/demo2/public/img/portrait/4d8392f50889d2a2f4f276b01.png'
fs.access(f
    , fs.constants.F_OK
    , (err) => {
        if (err) {
            console.log(err)
            return 
        }
        fs.unlink(f, (err) => {
            if (err) {
                console.log(err)
            }
        })
    })