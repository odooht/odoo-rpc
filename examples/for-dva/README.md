# 使用 odoo-rpc in dva

* 导入 Odoo
* 初始化参数 host, db, models
* 在models中将本例中用的所有的 odoo model 做定义
* 未在models定义的 odoo model , 以后只可以访问 name字段
* odoo = Odoo({host,db,models}) 实例化Odoo
* odoo.env(model\_name) 获取一个odoo 模型
* session\_id = odoo.login({db,login,password}) 登录
* 注意暂存 session id
* odoo = Odoo.load(session\_id) 在其他地方可以根据session\_id 取odoo实例
* odoo.logout() 销毁 session id
* const model = odoo.env(model\_name)
* model 是一个类
* model.look(fields) 可以嵌套查询
* records = model.search(domain)
* recs = records.list()
* records.byid(id)
* records.look(fields)
* rec = recs[0]
* rec.look(fields)
* rec.attr(char\_fld)
* rec.attr(integer\_fld)
* await rec.attr(many2one\_flg)
* await rec.attr(many2one\_fld, 1)
* await rec.attr(many2many\_flg)
* await rec.attr(many2many\_flg,1)


