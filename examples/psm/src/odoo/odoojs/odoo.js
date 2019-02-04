import modelCreator from './models'
import RPC from './rpc'

import addons from './addons'

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



class Odoo {
    constructor(options){
        /*
        params:
            host:
            db:
            modules: all modules to install
            models:  all model to set fields
        */

        //console.log('parant odoo',options)

        const { host, db, modules, models, callbackerror} = options
        const rpc = new RPC({ host,db })
        this._rpc = rpc
        this._models = models

        if( callbackerror ){
            this.setErrorCallback(callbackerror)
        }

        this._user = {}

        this._env = {}
        this._modules = {}
        const {base} = addons
        const modules2 = { base, ...modules}

        for( const module_name in modules2 ) {
            const module = modules2[module_name]
            this._fn_one_module(module_name, module)
        }
    }

    _fn_one_module(module_name, module){
        if ( this._modules[module_name] ) {
            return
        }

        for ( const depend_module_name in (module.depends || {} )) {
            const depend_module = module.depends[depend_module_name]
            this._fn_one_module( depend_module_name, depend_module)
        }

        //console.log( module_name, module )

        for( const model_name in module.models) {
            const model = module.models[model_name]
            this._fn_one_model(model_name, model)
        }


        this._modules[module_name] =  module
    }

    _fn_one_model(model_name, model){
        // if no config this model,
        // then this model is never used
        if( ! this._models[model_name] ){
            return
        }

        // if config this model fields  ,
        // then only use this fields
        // else use all fields

        let cls = this._env[model_name]
        if(cls){
            const fields0 = this._models[model_name]
            if (fields0 && fields0.length === 0 && model.fields){
                cls._fields_raw = [ ...cls._fields_raw,  ...model.fields ]
            }
        }

        else{
            const fields0 = this._models[model_name]
            const fields = fields0.length >0 ? fields0 : model.fields || []
            cls = modelCreator({
                model: model_name, fields, rpc: this._rpc, env: this._env
            })
            this._env[model_name] = cls
        }

        if( model.extend ){
            const extend_class = model.extend (cls )
            Object.defineProperty(extend_class, 'name', { value: cls._name, configurable: true })

            extend_class._extends.push(model.extend)

            this._env[model_name] = extend_class
        }
    }

    mock(){
      const rpc = this._rpc
      rpc.login = async (params)=> {
          const {login,password} = params
          let data = {}
          if (login==='admin' && password==='123' ){
            data = {code:0, result:{status: 'ok', sid:`sid_${login}_${password}`,uid:1}}
          }
          else{
            data = {code:0, result:{status: 'error'}}
          }

          const {code} = data
          if (!code){
            const {result:{status }} = data
            if (status==='ok'){
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
            //const {result} = data
            //console.log(result)
        }

        return data
      }
    }

    setErrorCallback(callback){
        // to set callback function, if odoo request, error response
        this._rpc.callbackerror = callback
    }

    async init(){
        // to init all cls , so cls is used safely
        // TBD, only request one time
        for (const model in this._env){
            await this._env[model].init()
        }
    }

    async login(params){
        const data = await this._rpc.login(params )
        if(!data.code){
            Odoo._session[this._rpc.sid] = this
            //await this.init()
            this._user = data.result
            return this._rpc.sid
        }
        return null
    }

    async logout(){
        const sid = this._rpc.sid
        const data = this._rpc.logout()
        delete Odoo._session[sid]
        return data
    }

    env(model){
        // get a model cls from odoo._env
        let cls = this._env[model]
        if(!cls){
            cls = modelCreator({ model, rpc: this._rpc, env:this._env })
            this._env[model] = cls
        }
        return cls
    }

    async user(fields) {
        // get login user
        const uid = this._rpc.uid
        return this.env('res.users').browse(uid,fields)
    }

    me = this.user

    async ref(xmlid) {
        // get model and id from xmlid
        return this.env('ir.model.data').call('xmlid_to_res_model_res_id', [xmlid, true] )

    }
}

Odoo._session = {}

Odoo.load = (session_id) =>{
    return Odoo._session[session_id]
}

Odoo.addons = addons

export default Odoo
