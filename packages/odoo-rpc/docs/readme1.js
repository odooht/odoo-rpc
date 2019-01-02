
Odoopy 的 流程

1 创建新帐套
2 缺省安装基础模块,
21  base 模块, 加载一些模型
211  res.partner, res.partner.title,
212  res.users, res.group
212  res.company

3 安装新模块,  加载新模型, 更新旧模型
31 sale_team
311 更新 res.partner, res.users
312 新模块  crm.team

32 CRM
321 更新 res.partner, res.users, crm.team
322 新模块  crm.lead


33 sale
34 stock
35 purchase

///  page   /////

const config2  = {
     sale_team ,
     crm
  }

//////  odoo js ////////////////////////

default config = {}

const config  = {
     sale_team : {
         model1: {
             fields: [],
             function: {
                 create2 : (cls,...) =>{},
                 write2:   (cls,...) =>{}
             }
         },
         model2: {}
     },
     CRM : {
         model1: {
             fields: [],
             function: {
                 create2: {},
                 write2: {}
             }
         },
         model2: {}
         model3: {}
     },

     sale : {},
     stock : {},
     purchase : {},
     hr : {},
  }

//////  odoo rpc ////////////////////////

modelCreator({config})
{
   class cls {

   }

   cls._fields_raw = []
   cls._fields = null
   cls._records = {}
   cls.init = () => {}
   cls.call = () => {}

   while(config) {
      cls[fn_name] = config[module_name][model_name][fn_name]
      cls._fields_raw. append()
   }
}




Odoojs 的主流程

10 rpc 负责 连接  odoopy
20 odoo = New ODOO()
21 modules
210   models
211   no await,  no request


30 sid = odoo.login({login,password})
31 odoo = odoo.load_session(sid)

32 odoo.addClass()
   odoo._env['aOdooModel1'] = { 'aOdooModel1', modelClass }
33  modelClass = modelCreator({})



35 modelClassIns = await modelClass.call(fields)
                    await modelClass.init()

36 modelClassData = modelClassIns.look()
37 modelClassIns.attr('name')


37 o2m = modelClassIns.attr('o2m')


m2o_model_ins = modelClassIns.attr('m2o_field')
m2o_model_ins.refresh()

m2o_model_ins = modelClassIns.attr('m2o_field').refresh()



function sss (modelClassIns, 'm2o_field' ){
   m2o = modelClassIns.attr('m2o_field')
   m2o_id = m2o.attr('id')
   m2o_class = odoo.env(m2o._name)
   m2o_model_ins = await m2o_class.browse( m2o_id )
   return m2o_model_ins
}




访问模型

1 加载模型
2 modelCreator 负责 创建模型
3 模型初始化  调用  fields_get
31 可以只执行一次, 以后就不用再处理这个了
4 访问Odoopy, 写入 ModelClass._records

5 离线使用数据
所有的可能性 都考虑到。



config  = {
 on/ off

}

