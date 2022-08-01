const sharp = require('sharp')
const fs = require('fs')
fs.readFileSync('./public/img/noimg.png')
const image = sharp('./public/img/noimg.png')
image.metadata().then(meta => {
    console.log(meta.width, meta.height)
});



