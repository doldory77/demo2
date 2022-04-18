var express = require('express');
var router = express.Router();

// router.use((req, res, next) => {
//     console.log('start user module...');
//     next();
// })

router.get('/', (req, res) => {
    // res.sendFile(global.appRoot.concat('/view/user/index.html'))
    res.render('user/index', {name:'doldory', email: 'doldory33@gmail'});
});

router.get('/about', (req, res) => {
    res.send(`<h1>hi user</h1>`);
})

module.exports = router;