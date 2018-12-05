
# odoo-rpc


导入 odoo-rpc

```
import ODOO from ./odoo/odoo-rpc
```

初始化参数, 创建odoo实例
* models 参数, 初始化所有的odoo模型
* 未通过models参数初始化的odoo模型, 以后在使用时仅可以访问 和 name 字段

```
const host = 'http://192.168.x.x:8069'
const db = 'my_database_name'
const models = {
    'res.partner': ['name','email', 'company_id','category_id'],
    'res.users': ['name','login', 'company_id']
}
const odoo = ODOO({host,db,models})
```

登录, 使用 session\_id, 注销   
* 登录后, 返回 session\_id
* 可以使用 session\_id 重新获取 ODOO 实例
* 注销时, 将销毁session\_id

```
const session_id = await odoo.login({login:'my_account',password:'my_password'})
const odoo = ODOO.load(session_id)
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
* 在 使用search, read 方法时, 注意要 配置fields参数

```
const company = partner.attr( company_id )
company.attr('name')
company.attr('email')
```

访问o2m,m2m字段
* 如果在前面初始化时, 未声明对应模型, 则只能使用对应模型的 id 字段
* 在 使用search, read 方法时, 注意要 配置fields参数
 
```
const categorys = partner.attr( category_id )
const categ0 = categorys.list()[0]
const categ1 = categorys.list()[1]
const categ0_name = categ0.attr(name)
const categ1_name = categ1.attr(name)

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
