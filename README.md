
# odoo-rpc


```
// 导入 odoo-rpc
import ODOO from ./odoo/odoo-rpc

// 初始化参数
host = 'http://192.168.x.x:8069'
db = 'my_database_name'
models = {
    'res.partner': ['name','email', 'company_id','category_id'],
    'res.users': ['name','login', 'company_id']
}

// 创建实例
const odoo = ODOO({host,db,models})

// 登录
await odoo.login({login:'my_account',password:'my_password'})

// 注销
await odoo.logout()

// 获取 odoo 模型
const PartnerModel = odoo.env('res.partner')


// 使用 odoo 模型, 需要先登录
// 调用 odoo 方法
const method = 'search_read'
const domain = [['is_company','=',true]]
const fields = ['name','email']
const args = [domain, fields]
const kwargs = {limit=100, offset=10, order='name'}
cosnt partnerData = await PartnerModel.call(method, args, kwargs)

// 条件查询数据, 返回结果集(多个记录)
const domain = [['is_company','=',false]]
cosnt partners = await PartnerModel.search(domain)

// 获取结果集 转为 列表(数组)形式
cosnt partner_list = partners.list()

// 以 id 为参数获取其中的一条记录, 不发送网络请求
const id = 99
const partner = partners.byid(id)
const other_partner = PartnerModel.view(id)

// 以 id 为参数获取一条记录, 需要发送网络请求
const id = 99
const partner = await partners.read(id)

// 访问字段
const partner_name = partner.attr('name')

// 访问多对一字段, 优先取内存中的数据, 取不到时发送网络请求
const company = await partner.attr( company_id )

// 访问多对一字段, 强制发送网络请求
const company = await partner.attr( company_id, true )
const company = await partner.attr( company_id, 1 )

// 访问多对一字段对应模型的字段
company.attr('name')
company.attr('email')

// 访问多对多或一对多字段, 优先取内存中的数据, 取不到时发送网络请求
const categorys = await partner.attr( category_id )

// 访问多对多或一对多字段, 强制发送网络请求
const categorys = await partner.attr( category_id, true )
const categorys = await partner.attr( category_id, 1 )

// 遍历多对多字段
const categ0 = categorys.list()[0]
const categ1 = categorys.list()[1]
const categ0_name = categ0.attr(name)
const categ1_name = categ1.attr(name)

// 创建新记录
const a_new_partner = PartnerModel.create({name:'new_partner'})

// 编辑
a_new_partner.write({name:'other_name'})
PartnerModel.write(a_new_partner._id, {name:'other_name'})

// 删除
a_new_partner.unlink()
PartnerModel.unlink(a_new_partner._id)


```
