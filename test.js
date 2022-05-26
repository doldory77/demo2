const path = require('path')
const fs = require('fs')
const f = 'D:/sample.txt'


// (function(){
//     console.log('A')
//     new Promise((resolve, reject) => {
//         let result = undefined
//         fs.readFile(f, 'utf8', (err, result) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(result)
//             }
//         })
//     }).then(result => {
//         console.log(result)
//         return result
//     }).catch(err => {
//         return err
//     })
//     console.log('C')
// })()
// (async function(){
//     let xx = await (async function(){
//         setTimeout(() => {
//             let result = 'setTimeout result'
//             return result
//         }, 2000)
//     })()
//     console.log(xx)
// })()

// async function xx() {
//     setTimeout(() => {
//         return 'setTimeout xx return'
//     }, 2000)
// }

// let yy = async function() {
//     xx().then(rtn => { console.log(rtn) })
    
//     setTimeout(() => {
//         return 'setTimeout yy return'
//     }, 1000)
// }

// yy()

let xx = () => {
    return new Promise((rsl, rjt) => {
        setTimeout(() => {
            // rsl('success')
            rjt('fail')
        }, 2000)
    })
    .then(rtn => {
        return rtn
    })
    .catch(err => {
        return 'exception fire'
    })
}

let yy = () => {
    return new Promise((rsl, rjt) => {
        fs.readFile(f, 'utf8', (err, result) => {
            if (err) {
                rjt('fail')
            } else {
                rsl(result)
            }
        })        
    })
}

// xx().then(rtn => { console.log(rtn) }).catch(err => { console.log(err) })
(async function(){
    let rtn = await xx()
    console.log(rtn)
    rtn = await yy()
    console.log(rtn)
    console.log('exit')
})()


