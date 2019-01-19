# odoojs

odoojs是一个前端的js库, 封装了odoo api.  
使用odoojs, 可以视作odoojs是一个服务.  
换言之, page页面, 直接调用 odoojs, 获取数据. 

odoo api 是 odoo 对外的接口规范. 参看文档:  
https://github.com/odooht/odoo-docs/tree/master/api

因为odoojs 已经封装 odoo api, 所以在使用odoojs的情况下, 掌握odoo api, 重点是:  
1 odoo定义的数据类型
2 search/search_read方法的参数 domain 的格式  
3 create / write 方法的参数 vals 的格式  
 

odoo model 参考文档  
https://github.com/odooht/odoo-docs/tree/master/model  


# odoojs 使用教程

导入 odoojs

```
import ODOO from ./odoo/odoojs
```

初始化参数, 创建odoo实例
* modules 参数, 指明odoo中已经安装到模块
* 所有的odoo模块在 ODOO.addons 中
* modules 参数, 也包含odoo的第三方模块
* models 参数, 初始化使用到到所有的odoo模型
* models 中的模型, 指明了包括哪些字段. 若为空, 则是全部字段.
* callbackerror 是网络请求出错时的回调函数

```
import ODOO from ./odoo/odoojs
import third_partner_module from ./odoo/odoo.addons.third_partner_module

const host = 'http://192.168.x.x:8069'
const db = 'my_database_name'
const {crm,project,product} = Odoo.addons
const modules = {crm,project,product,third_partner_module}

const models = {
    'res.partner': ['name','email', 'company_id','category_id'],
    'res.users': ['name','login', 'company_id'],
    'rec.partner.category': []
}

const callbackerror = (url,params,error)=>{
    console.log('rpc call error:', url, params, error);
}

const odoo = ODOO({host,db,modules, models,callbackerror})
```

登录, 使用 session\_id, 注销, 获取登录用户的登录信息 
* 登录后, 返回 session\_id
* 可以使用 session\_id 重新获取 ODOO 实例
* 登录后, 可以查询登录用户的信息
* 注销时, 将销毁session\_id
```
const session_id = await odoo.login({login:'my_account',password:'my_password'})
const odoo = ODOO.load(session_id)
const fields = {name:1,login:1}
const user = odoo.user(fields)
const result = await odoo.logout()
```


获取 odoo 模型    
```
const PartnerModel = odoo.env('res.partner')
```

使用 odoo 模型, 调用 odoo服务中的方法  
* 需要先登录
* 所有方法都为异步方法, 需要用await
```
const method = 'search_read'
const domain = [['is_company','=',true]]
const fields = ['name','email']
const args = [domain, fields]
const kwargs = {limit=100, offset=10, order='name'}
cosnt partnerData = await PartnerModel.call(method, args, kwargs)
```

条件查询数据  
* search 返回结果集(含多个记录)
* search_read 返回 list
* fields 参数, 指定嵌套查询的 m2o, o2m, m2m 字段

```
const domain = [['is_company','=',false]]
const fields = {
    company_id : {}
    category_id : {}
}

cosnt partners = await PartnerModel.search(domain, fields)
cosnt partners_list = await PartnerModel.search_read(domain, fields)
```

获取结果集 转为 列表(数组)形式
```
cosnt partner_list = partners.list()
```

以 id 为参数获取其中的一条记录, 不发送网络请求
```
const id = 99
const partner = partners.byid(id)
const partner = PartnerModel.view(id)
```

以 id 为参数获取一条记录, 需要发送网络请求
* browse 返回结果 (含一条记录)
* read 返回 dist 或 list, 依赖于 参数 id 是 integer 或 list
* fields 参数, 指定嵌套查询的 m2o, o2m, m2m 字段

```
const id = 99
const fields = {
    company_id : {}
    category_id : {}
}
const partner = await PartnerModel.browse(id, fields)
const partner_dict_or_list = await PartnerModel.read(id, fields)
```


访问字段  
* 如果在前面初始化时, 未声明该模型, 则只能使用该模型的 id, name 字段

```
const partner_id = partner.attr('id')
const partner_name = partner.attr('name')
const partner_email = partner.attr('email')
const company =  partner.attr( company_id )
const categorys =  partner.attr( category_id )

```

访问m2o字段, 以及对应模型的字段, 
* 如果在前面初始化时, 未声明对应模型, 则只能使用对应模型的 id, name 字段
* 如果m2o字段的数据需要访问网络请求, 重新获取数据, 请指定参数 ref 和 ref_fields

```
const company = partner.attr( company_id )
company.attr('name')
company.attr('email')

const company2 = await partner.attr( company_id, 1, {name:1,email:1} )
company2.attr('name')
company2.attr('email')

```

访问o2m,m2m字段
* 如果在前面初始化时, 未声明对应模型, 则只能使用对应模型的 id 字段
* 如果o2m字段的数据需要访问网络请求, 重新获取数据, 请指定参数 ref 和 ref_fields
 
```
const categorys = partner.attr( category_id )
const categ0 = categorys.list()[0]
const categ1 = categorys.list()[1]
const categ0_name = categ0.attr(name)
const categ1_name = categ1.attr(name)

const categorys2 = await partner.attr( category_id, 1, {name:1} )

```

一次访问多个字段  
* 如果调用者是单条记录, 则返回一个对象
* 如果调用者是多条记录, 则返回一个数组
* 参数fields为一个字段列表, 可以嵌套读取m2o,o2m,m2m字段对应模型的字段

```
const fields = {
    name:null,
    company_id:{name:null,email:null},
    category_id:{name:null}
}

const partner_dict =  partner.look(fields)
const partners_list = partners.look(fields)

```

创建、编辑、删除
* 都是异步方法
* 

```
const partner = await PartnerModel.create({name:'new_partner'})
const result = await partner.write({name:'other_name'})
const result = await partner.unlink()

const id = 99
const result = await PartnerModel.write(id, {name:'other_name'})
const result = await PartnerModel.unlink(id)

```

