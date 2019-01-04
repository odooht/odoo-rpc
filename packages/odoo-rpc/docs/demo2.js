class RPC {}

const modelCreator = options => {
    const { model, fields: fields_raw, rpc, env, odoo } = options;

    class cls {
      async ref_attr(attr,ref_fields){
          ref_cls_name = cls._fields['attr'].relation
          ref_cls = cls.env(ref_cls_name)
          return await ref_cls.browse(this.attr(attr)._id, ref_fields )
      }

      aysnc call( args=[], kwargs ={} ){
          return cls.call(  [ this._id, ...args ], kwargs );

      }

      aysnc browse(fields, lazy = 0){
          return cls.browse(  this._id , fields, lazy  );

      }

      aysnc toggle_active(){
          return cls.toggle_active(  this._id );
      }


    }

    cls._odoo = odoo;
    cls._name = model;
    cls._rpc = rpc;
    cls._env = env;
    cls._records = {};
    cls._fields = null;
    cls._fields_raw = fields_raw || ['name'];

    cls.toggle_active(id){
        const data = await cls.call( 'toggle_active', [id] );
        if (data) {
            return cls.browse(id);
        }
        return data;
    }



  return cls;
};

class Odoo {
    constructor(options){
        /*
        params:
            host:
            db:
            modules: all modules to install
            models:  all model to set fields
        */

        const { host, db, modules={}, models={} } = options
        const rpc = new RPC({ host,db })
        this._rpc = rpc

        this._env = {}
        this._modules = {}

        for( module_name in modules) {
            module = modules[module_name]
            this._fn_one_module(module)
        }

        for (model_name in models){
            fields = models(model_name)
            cls = this._env[model_name]
            cls._fields_raw = fields
        }


    }

    _fn_one_module(module){
            if( this._modules[module_name] ){
                return
            }

            for(model_name in module.models) {
                for( depend_module_name in  module.depends ){
                    depend_module = module.depends[depend_module_name]
                    this._fn_one_module(depend_module)
                }

                model = module.models[model_name]

                let cls = this._env[model_name]

                if(cls){
                    if ( model.fields ){
                        cls._fields_raw += model.fields
                    }
                }

                else{
                    cls = modelCreator({ model: model_name, fields, rpc, this._env })
                    this._env[model_name] = cls
                }

                if( model.extend ){
                    const extend_class = model.extend (cls )
                    Object.defineProperty(extend_class, 'name', { value: cls._name, configurable: true })
                    this._env[model_name] = extend_class
                }

                /*
                //cls_methods = model.cls_methods
                //ins_methods = model.ins_methods
                for (cls_method_name in cls_methods){
                    cls[cls_method_name] = cls_methods[cls_method_name](cls)
                }

                for (ins_method_name in ins_methods){
                    cls.prototype[ins_method_name] = function (){
                        return ins_methods[ins_method_name]( cls, this )(...arguments)
                    }
                }
                */
            }

            this._modules[module_name] =  module

    }

    mock(){
      const rpc = this._rpc
      rpc.login = async (params)=> {
          const {login,password} = params
          let data = {}
          if (login=='admin' && password=='123' ){
            data = {code:0, result:{status: 'ok', sid:`sid_${login}_${password}`,uid:1}}
          }
          else{
            data = {code:0, result:{status: 'error'}}
          }

          const {code} = data
          if (!code){
            const {result:{status }} = data
            if (status=='ok'){
                const {result:{sid, uid }} = data
                rpc.sid =  sid
                rpc.uid =  uid
            }
            else{
                rpc.sid = null
                rpc.uid = null
            }
          }
          else{
            rpc.sid = null
            rpc.uid = null
          }
          return data
      }
      rpc.logout = async() =>{
        if (!rpc.sid){
            return {code: 1, error: {}}
        }

        const data = {code: 0, result: {}}
        rpc.sid =  null
        rpc.uid =  null

        return data
      }
      rpc.call = async(params) =>{
        if (!rpc.sid){
            return {code: 1, error: {message:'no sid'}}
        }

        const {model, method, args=[] , kwargs = {}} = params
        const data = {
            code:0,
            result: rpc_mock[method]( model, ...args, kwargs)

        }
        const {code} = data
        if (!code){
            const {result} = data
        }

        return data
      }
    }
}

const rpc_mock = {
    fields_get: async (model,allfields, attributes ) =>{

        const models = {}
        models['res.partner'] = {
            id:{type:'integer'},
            name:  {type: 'char'},
            email: {type: 'char'},
            title: {type: 'many2one',  relation: 'res.partner.title'},
            user_id:     {type: 'many2one',  relation: 'res.users'},
            company_id:  {type: 'many2one',  relation: 'res.company'},
            category_id: {type: 'many2many', relation: 'res.partner.category'},
        }

        models['res.partner.title'] = {
            name:  {type: 'char'},
            shortcut:  {type: 'char'},
        }

        models['res.users'] = {
            name:  {type: 'char'},
            login:  {type: 'char'},
        }

        models['res.partner.category'] = {
            name:  {type: 'char'},
        }

        return models[model]

    }
}



// odoo.addons.base.js
module_base = {
    depends: {}
    models : {
        'res.partner.bank': {
            fields: ['name'],
        },

        'res.bank': {
            fields: ['name'],
        },

        'res.company': {
            fields: ['name'],
        },

        'res.country': {
            fields: ['name','code','address_format','currency_id',
                'image','phone_code', 'country_group_ids', 'state_ids',
                'name_position','vat_label'
            ],

            extend: (BaseClass)=>{
                class cls extends BaseClass {
                    get_address_fields() {
                        const data = this.call( 'get_address_fields', [] )
                        this.setattr('address_fields', data)
                        return data;
                    }
                }

                return cls
            }
        },

        'res.country.group': {
            fields: ['name','country_ids'],
        },

        'res.country.state': {
            fields: ['country_id','name','code'],
        },

        'res.currency': {
            fields: ['name'],
        },

        'res.currency.rate': {
            fields: ['name'],
        },

        'res.partner.category': {
            fields: ['name' ],
        },

        'res.partner.title': {
            fields: ['name' ],
        },

        'res.partner': {
            fields: ['name','title','child_ids'],
            extend: (BaseClass)=>{
                class cls extends BaseClass {
                    async address_get() {
                        const data = this.call( 'address_get', [] )
                        this.setattr('address_fields', data)
                        return data;
                    }

                    async update_address() {
                        const data = this.call( 'update_address', [] )
                        return this.address_get();
                    }

                    async create_company() {
                        const data = this.call( 'create_company', [] )
                        return await this.browse({
                            parent_id: 0,
                            child_ids: 0
                        })
                    }
                }

                cls.main_partner = async () => {
                    const data = cls.call( 'main_partner', [] )
                    return data
                }

                cls.find_or_create = async (email) => {
                    const data = cls.call( 'find_or_create', [email] )
                    return await cls.browse(data)
                }

                return cls
            }
        },

        'res.partner.industry': {
            fields: ['name' ],
        },

        'res.groups': {
            fields: ['name' ],
        },

        'res.users.log': {
            fields: ['create_uid' ],
        },

        'res.users': {
            fields: ['name' ],
            extend: (BaseClass)=>{
                class cls extends BaseClass {
                }

                cls.change_password = async (old_passwd, new_passwd) => {
                    const data = cls.call( 'change_password', [old_passwd, new_passwd] )
                    return data
                }

                cls.has_group = async (group_ext_id) => {
                    const data = cls.call( 'has_group', [group_ext_id] )
                    return data
                }

                return cls
            }
        },

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
// import module_sales_team from odoo.addons.sales_team
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

    const models = {
        'res.users': ['login','name','partner_id','company_id','category_id'],
        'res.partner': ['name','email','title','user_id','company_id','category_id'],
        'res.partner.title': ['name','shortcut'],
        'res.company': ['name','email'],
        'res.country': [],
        'crm.team': ['name' ],
        'crm.lead': ['name' ],
        'projet.projet': ['name' ],
        'projet.task': ['name' ],
    }



    const odoo = new ODOO({ host, db, modules, models })
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

*/
