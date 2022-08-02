const sharp = require('sharp')
const fs = require('fs')
fs.readFileSync('./public/img/noimg.png')
const image = sharp('./public/img/noimg.png')
image.metadata().then(meta => {
    console.log(meta.width, meta.height)
});

$.ajax({
	url: '/sys_menu/menu_mng_insert',
	dataType: 'json',
	type: 'POST',
	headers: {'Content-Type': 'application/json'},
	data: JSON.stringify({
		lv: 2,
		parent_menu_cd:'0600',
		menu_nm: '기타-2',
		url: '/etc2.do',
		use_yn: '1'
	}),
	success: function(res){
		console.log(res);
		if (res.result && res.result['affectedRows'] > 0) {
			alert('성공')
		}
	},
	error: function(xhr,status,error){
		console.error(xhr);
	},
	complete: function(data, textStatus) {
		console.log(textStatus);
	}
})

$.ajax({
	url: '/sys_menu/menu_mng_insert',
	dataType: 'json',
	type: 'POST',
	headers: {'Content-Type': 'application/json'},
	data: JSON.stringify({
		lv: 1,
		parent_menu_cd:'0000',
		menu_nm: 'HOME',
		url: '/',
		use_yn: '1'
	}),
	success: function(res){
		console.log(res);
		if (res.result && res.result['affectedRows'] > 0) {
			alert('성공')
		}
	},
	error: function(xhr,status,error){
		console.error(xhr);
	},
	complete: function(data, textStatus) {
		console.log(textStatus);
	}
})


