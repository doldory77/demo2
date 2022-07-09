var express = require('express');
var router = express.Router();
const { query } = require('../cmmn/cmmn')

router.get('/', async (req, res) => {
    let errors = []
    let board = []
    try { board = await query('usr', 'selectBoard', {board_no:'13'}) } 
    catch (error) {
        errors.push('sql error')
        console.log(':::[ERROR]::::', error)
    }
    res.render('usr/index', { board });
});

module.exports = router;