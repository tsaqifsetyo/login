var express = require('express');
var router = express.Router();

/* GET Customer page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM item',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('item/list',{title:"Item",data:rows});
		});
     });
});
router.post('/add', function(req, res, next) {
	req.assert('merk', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_merk = req.sanitize( 'merk' ).escape().trim(); 
		v_name = req.sanitize( 'name' ).escape().trim();
		v_unit = req.sanitize( 'unit' ).escape().trim();
        v_quantity = req.sanitize( 'quantity' ).escape().trim();
        v_price = req.sanitize( 'price' ).escape();

		var item = {
            merk: v_merk,
			name: v_name,
			unit: v_unit,
			quantity: v_quantity,
			price : v_price
		}

		var insert_sql = 'INSERT INTO item SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, item, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('item/add-item', 
					{ 
                        merk: req.param('merk'),
						name: req.param('name'), 
						unit: req.param('unit'),
						quantity: req.param('quantity'),
						price: req.param('price'),
					});
				}else{
					req.flash('msg_info', 'Create Item success'); 
					res.redirect('/item');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('item/add-item', 
		{ 
			merk: req.param('merk'), 
			name: req.param('name')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'item/add-item', 
	{ 
		title: 'Add New Item',
		merk: '',
		name: '',
		unit:'',
        quantity:'',
        price:''
	});
});
router.get('/edit/(:code)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM item where code='+req.params.code,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/item'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Item can't be find!"); 
					res.redirect('/item');
				}
				else
				{	
					console.log(rows);
					res.render('item/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:code)', function(req,res,next){
	req.assert('merk', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_merk = req.sanitize( 'merk' ).escape().trim(); 
		v_name = req.sanitize( 'name' ).escape().trim();
		v_unit = req.sanitize( 'unit' ).escape().trim();
        v_quantity = req.sanitize( 'quantity' ).escape().trim();
        v_price = req.sanitize( 'price' ).escape();

		var item = {
			merk: v_merk,
			name: v_name,
			unit: v_unit,
            quantity : v_quantity,
            price: v_price
		}

		var update_sql = 'update item SET ? where code = '+req.params.code;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, item, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('item/edit', 
					{ 
						merk: req.param('merk'), 
						name: req.param('name'),
						unit: req.param('unit'),
                        quantity: req.param('quantity'),
                        price: req.param('price'),
					});
				}else{
					req.flash('msg_info', 'Update Item success'); 
					res.redirect('/item/edit/'+req.params.code);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('item/add-item', 
		{ 
			merk: req.param('merk'), 
			name: req.param('name')
		});
	}
});
router.delete('/delete/(:code)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var item = {
			code: req.params.code,
		}
		
		var delete_sql = 'delete from item where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, item, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/item');
				}
				else{
					req.flash('msg_info', 'Delete Item Success'); 
					res.redirect('/item');
				}
			});
		});
	});
});
module.exports = router;