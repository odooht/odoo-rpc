class RPC {}

const modelCreator = options => {
  const { model, fields: fields_raw, rpc, env, odoo } = options;

  class cls {
      async ref_attr(attr,ref_fields){
          ref_cls_name = cls._fields['attr'].relation
          ref_cls = cls.env(ref_cls_name)
          return await ref_cls.browse(this.attr(attr)._id, ref_fields )
      }
  }

  cls._odoo = odoo;
  cls._name = model;
  cls._rpc = rpc;
  cls._env = env;
  cls._records = {};
  cls._fields = null;
  cls._fields_raw = fields_raw || ['name'];

  return cls;
};

class Odoo {
    constructor(options){
        const { host, db, modules={}, creators={}, RPC } = options
        const rpc = new RPC0({ host,db })
        this._rpc = rpc

        this._env = {}
        models = {}

        for( module_name in modules) {
            module = modules[module_name]
            this._fn_one_module(module)

        }
    }

    _fn_one_module(module){
            for(model_name in module.models) {
                for( depend_module_name in  module.depends ){
                    depend_module = module.depends[depend_module_name]
                    this._fn_one_module(depend_module)
                }

                model = module.models[mdl]

                fields = model.fields
                cls_methods = model.cls_methods
                ins_methods = model.ins_methods

                let cls = this._env[model_name]

                if(cls){
                    cls._fields_raw += fields
                }

                else{
                    cls = modelCreator({ model: model_name, fields, rpc, this._env })
                    this._env[model_name] = cls
                }

                for (cls_method_name in cls_methods){
                    cls[cls_method_name] = cls_methods[cls_method_name](cls)
                }

                for (ins_method_name in ins_methods){
                    cls.prototype[ins_method_name] = function (){
                        return ins_methods[ins_method_name]( cls, this )(...arguments)
                    }
                }
            }
    }

    mock(){
        const rpc = this._rpc
        rpc.login = async (params)=>{}
        rpc.call = async (params) =>{}
    }
}

// odoo.addons.base.js
module_base = {
    depends: {}
    models : {
        'res.partner': {
        },

        'res.partner.category': {
            fields: ['name','title','child_ids'],
            cls_methods: {
                name_create: (cls){
                    return (name)=>{
                        id = cls.create({name})
                        return cls.browse(id)
                    }
                }
            },

            ins_methods: {
                action_invoice: ( cls, ins ){
                    const this = ins
                    return ()=>{
                        invoice_ids = this.action_invoice()
                        after_refresh_sale_orders = this.browse(sale_orders.ids,
                            {invoice_ids:  {name: null, } }
                        )
                        return 1
                    }
                }

            }
        },


        'res.partner.title': 1,
        'res.users': 1,
        'res.company': 1,
    }
}

// odoo.addons.sales_team.js
import module_base from odoo.addons.base
module_sales_team = {
    depends: {'base':  module_base }
    models : {
        'crm.team': 1,
        'res.users': 1,
        'res.partner': 1,
    }
}

// odoo.addons.crm.js
// import module_base from odoo.addons.base
// import module_base from odoo.addons.sales_team
module_crm = {
    depends: {
        'base': module_base,
        'sales_team': module_sales_team
    },

    models : {
        'crm.team': 1,
        'crm.lead': 1,
        'res.users': 1,
        'res.partner': 1,
        'crm.lead.tag': 1,
        'crm.lost.reason': 1
    }
}

// odoo.addons.project.js

// import module_base from odoo.addons.base
module_projet = {
    depends: {'base': module_base},
    models : {
        'project.project': 1,
        'project.task': 1,
        'res.users': 1,
        'res.partner': 1,
    }

}


// page ...


// import ODOO from odoo
// import module_crm from odoo.addons.crm
// import module_projet from odoo.addons.project



const get_odoo = ()=>{
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    modules = {module_crm, module_projet }



    const odoo = new ODOO({ host, db, modules })
    return odoo
}

const test = aysnc ()=>{
    odoo = get_odoo()
    odoo.mock()
    fields = {}
    domain = []

    project_ins = await odoo.env('project.project').search(domain, fields)
    project_ins = await odoo.env('project.project').browse([12,3,4,5,6], fields)
    project_ins = await odoo.env('project.project').browse(333, fields)

    projet_name =       project_ins.attr('name')
    customer    =       project_ins.attr('partner_id')

    customer    = await project_ins.ref_attr('partner_id', partner_fields )
    tasks       = await project_ins.ref_attr('task_ids', task_fields )

}

/*
    const models = {
        'res.users': ['login','name','partner_id','company_id','category_id'],
        'res.partner': ['name','email','title','user_id','company_id','category_id'],
        'res.partner.title': ['name','shortcut'],
        'res.company': ['name','email'],
        'res.country': ['name' ],
        'crm.team': ['name' ],
        'crm.lead': ['name' ],
        'projet.projet': ['name' ],
        'projet.task': ['name' ],
    }

*/
