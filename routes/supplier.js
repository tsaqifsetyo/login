var express = require('express');
var router = express.Router();

/* GET Customer page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM supplier',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('supplier/list',{title:"supplier",data:rows});
		});
     });
});
router.post('/add', function(req, res, next) {
	req.assert('kode', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
        v_email = req.sanitize( 'email' ).escape().trim();
        v_phone = req.sanitize( 'phone' ).escape();

		var supplier = {
            kode: v_kode,
			nama: v_nama,
			alamat: v_alamat,
			email: v_email,
			phone : v_phone
		}

		var insert_sql = 'INSERT INTO supplier SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/add-item', 
					{ 
                        kode: req.param('kode'),
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Create Item success'); 
					res.redirect('/supplier');
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
		res.render('supplier/add-item', 
		{ 
			kode: req.param('kode'), 
			nama: req.param('nama')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'supplier/add-item', 
	{ 
		title: 'Add New Supplier',
		kode: '',
		nama: '',
		alamat:'',
        email:'',
        phone:''
	});
});
router.get('/edit/(:id)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM supplier where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/supplier'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Supplier can't be find!"); 
					res.redirect('/supplier');
				}
				else
				{	
					console.log(rows);
					res.render('supplier/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id)', function(req,res,next){
	req.assert('kode', 'Please fill the code').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
        v_email = req.sanitize( 'email' ).escape().trim();
        v_phone = req.sanitize( 'phone' ).escape();

		var supplier = {
			kode: v_kode,
			nama: v_nama,
			alamat: v_alamat,
            email : v_email,
            phone: v_phone
		}

		var update_sql = 'update supplier SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/edit', 
					{ 
						kode: req.param('kode'), 
						nama: req.param('nama'),
						alamat: req.param('alamat'),
                        email: req.param('email'),
                        phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Update Supplier success'); 
					res.redirect('/supplier/edit/'+req.params.id);
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
		res.render('supplier/add-item', 
		{ 
			kode: req.param('kode'), 
			nama: req.param('nama')
		});
	}
});
router.delete('/delete/(:id)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var supplier = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from supplier where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/supplier');
				}
				else{
					req.flash('msg_info', 'Delete Supplier Success'); 
					res.redirect('/supplier');
				}
			});
		});
	});
});
module.exports = router;