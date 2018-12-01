# odoo-rpc

class Odoo 
* 对外唯一的接口
* 参数 host, db, models
* db 可以不传, 可以在登录时传 db
* models 的作用是初始化所有的 odoo model
* odoo 中有些 model 的字段太多了, 如果缺省取所有的字段, 太多.
* odoo = Odoo({host,db,models}) 实例化Odoo
* odoo.\_env 存储所有的 odoo model
* odoo.\_rpc 是 RPC 的一个实例
* odoo.env(model) 获取一个odoo 模型, 是一个class
* session\_id = odoo.login({db,login,password})  初始化时不传参数db, 在登录时必须传
* odoo.login() 返回 session id
* odoo = Odoo.load(session\_id) 类方法 根据session\_id 取odoo实例
* odoo.logout() 销毁 session id

class RPC
* 参数 host db
* login / logout / call



function modelCreator
* 参数 model, fields, rpc, env
* 动态创建类, 对应 odoo 的模型

class : odoo 模型对应的类
* cls.\_name
* cls.\_rpc
* cls.\_env
* cls.\_fields\_raw
* cls.\_feilds
* cls.\_records
* cls.\_inited
* cls.init()
* cls.env(model)
* cls.call(method,args,kwargs)
* cls.search(domain)
* cls.read(id)
* cls.create(vals)
* cls.write(id,vals)
* cls.unlink(id)
* 实例方法
* list()
* byid(id)
* write(vals)
* unlink()
* attr(fld)
* look(fields)
* 实例化时, 参数 id or ids , 对应多条记录 / 单条记录
* 

