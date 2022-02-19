
var xlsx = require('node-xlsx');
var schedule = require("node-schedule");
var mysql = require('./promise');
var fs = require('fs');

var state = 0;

var auto = function(id){
	state++;
	var sql = `
	SELECT 'ID', '标题', '描述', '原价', '图片', '分组', '售价', '模块ID集合'
	FROM DUAL
	UNION ALL
	SELECT p_product.id, p_product.title, p_product.description, p_product.original_price
		, (
			SELECT f_file_storage.url
			FROM f_file_storage
			WHERE f_file_storage.id = (
				SELECT p_product_image.file_storage_id
				FROM p_product_image
				WHERE p_product_image.type = 0
					AND p_product_image.product_id = p_product.id
			)
		) AS product_images
		, (
			SELECT erp_admin_category.\`name\`
			FROM erp_admin_category
			WHERE erp_admin_category.id IN (
				SELECT erp_admin_category_product.category_id
				FROM erp_admin_category_product
				WHERE erp_admin_category_product.product_id = p_product.id
			)
			LIMIT 1
		), p_product.min_price
		, (
			SELECT GROUP_CONCAT(DISTINCT a_aggregate_module_product.aggregate_module_id SEPARATOR ' ')
			FROM a_aggregate_module_product
			WHERE a_aggregate_module_product.product_id = p_product.id
				AND a_aggregate_module_product.yn = 1
				AND a_aggregate_module_product.aggregate_module_id IN (
					SELECT a_aggregate_page_module.aggregate_module_id
					FROM a_aggregate_page_module
					WHERE a_aggregate_page_module.yn = 1
						AND a_aggregate_page_module.aggregate_page_id IN (
							SELECT a_aggregate_page.id
							FROM a_aggregate_page
							WHERE a_aggregate_page.yn = 1
								AND a_aggregate_page.scope_id = ${id}
						)
				)
		) AS moduleIds
	FROM p_product
	WHERE p_product.yn = 1
		AND p_product.\`status\` = 10
		AND p_product.id IN (
			SELECT a_aggregate_module_product.product_id
			FROM a_aggregate_module_product
			WHERE a_aggregate_module_product.yn = 1
				AND a_aggregate_module_product.aggregate_module_id IN (
					SELECT a_aggregate_page_module.aggregate_module_id
					FROM a_aggregate_page_module
					WHERE a_aggregate_page_module.yn = 1
						AND a_aggregate_page_module.aggregate_page_id IN (
							SELECT a_aggregate_page.id
							FROM a_aggregate_page
							WHERE a_aggregate_page.yn = 1
								AND a_aggregate_page.scope_id = ${id}
						)
				)
		);
	`
	var scopeName = ''
	switch(id){
		case 3: scopeName = "young";break;
		case 8: scopeName = "91up";break;
	}
	if(scopeName == ''){return}
	//查询数据,并转化成生成xlsx所需的格式
	mysql
		.query(sql)
		.then(function(rows){
			var datas = [];
			rows.forEach(function(row){
			var newRow = [];
				for(var key in row){
					newRow.push(row[key]);
				}
				datas.push(newRow);
			})
			return Promise.resolve(datas);
		})
		//生成xlsx文件
		.then(function(datas){
			var buffer = xlsx.build([{name: "dpa", data: datas}]);
			var xlsxname = `${scopeName}_${mysql.nowDate().split(' ')[0]}.csv`;
			return new Promise(function(resolve, reject){
				fs.writeFile(xlsxname, buffer, 'binary',function(err){
					if (err) {
						throw new error('创建excel异常');
						return;
					}
					resolve(xlsxname)
				})
			})
		})
		//发送邮件,返回信息
		.then(function(xlsxname){
			return mysql.sendMail(xlsxname);
		})
		.then(function(info){
			console.log(timeFormat(), info["response"], info["envelope"]);
			// console.log(info, mysql.nowDate());
		})
		//捕捉未处理的异常
		.catch(function(e){
			if(state < 2){
				auto(id)
			}else{
				console.log(e);				
				state = 0
			}
		});
	
}

// auto(3);
  
var rule      = new schedule.RecurrenceRule();
var t = [];
for (var i = 0; i < 60; i++) {
	t.push(i);
}
var times     = t;
rule.second   = times;
// 时间转换
var timeFormat = function () {
    var now = new Date()
    var year = now.getFullYear() // 年
    var month = String(now.getMonth() + 1).length == 1 ? '0' + String(now.getMonth() + 1) : now.getMonth() + 1 // 月
    var day = String(now.getDate()).length == 1 ? '0' + String(now.getDate()) : now.getDate() // 日
    var hour = String(now.getHours()).length == 1 ? '0' + String(now.getHours()) : now.getHours() // 时
    var minute = String(now.getMinutes()).length == 1 ? '0' + String(now.getMinutes()) : now.getMinutes() // 分
    var second = String(now.getSeconds()).length == 1 ? '0' + String(now.getSeconds()) : now.getSeconds() // 秒

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

schedule.scheduleJob('0 30 11 * * ?', function(){
	auto(3);
	auto(8);
});