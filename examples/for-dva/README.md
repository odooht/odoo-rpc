# 使用 odoo-rpc in dva

* 导入 Odoo
* odoo = Odoo({host,db,models}); 实例化Odoo
* 参数 host, db, models
* 在models中将本例中用到的所有的 odoo model 做定义
* 未在models定义的 odoo 模型 , 以后只可以访问 name字段

* session\_id = odoo.login({db,login,password}); 登录
* 注意暂存 session\_id
* odoo = Odoo.load(session\_id); 在其他地方可以根据session\_id 取odoo实例
* odoo.logout(); 销毁 session\_id

* const model\_name = 'res.partner'
* const Model = odoo.env(model\_name); 获取一个odoo 模型
* records = await Model.search(domain); 查询数据, 获取多条记录
* records = await Model.read(ids); 查询数据, 获取多条记录
* record  = await Model.read(id ); 查询数据, 获取单条记录
* record_list = records.list() ;  转列表
* record = records.byid(id)  ; 取一条记录
* record = Model.view(id)  ; 取一条记录

* record\_list = await records.look(fields); 可以嵌套查询
* record\_dict = await record.look(fields); 可以嵌套查询

* id = 99
* rec = Model.view(id)
* attr = 'name'; char field 
* rec\_name = rec.attr(attr)
* attr = 'age';  integer field
* rec\_age = rec.attr(attr)

* attr = 'company\_id';  many2one field
* company = await rec.attr(attr)
* company = await rec.attr(attr, 1)  ;  强制发送请求
* attr = 'category\_id';  many2many field
* categorys = await rec.attr(attr)
* categorys = await rec.attr(attr,1);  强制发送请求


