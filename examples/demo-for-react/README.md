# 使用 odoo-rpc

* 导入 Odoo
* odoo = Odoo({host,db,models}); 实例化Odoo

* session\_id = odoo.login({db,login,password}); 登录
* 注意暂存 session\_id
* odoo = Odoo.load(session\_id); 在其他地方可以根据session\_id 取odoo实例
* odoo.logout(); 销毁 session\_id
