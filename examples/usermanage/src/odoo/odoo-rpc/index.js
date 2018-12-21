import modelCreator from './models'
import _RPC from './rpc'

import busCreator from './bus.bus'
import mailChannelCreator from './mail.channel'
import mailMessageCreator from './mail.message'

const create_env = ({models, creators, rpc, odoo} )=>{
    const env = {}
    for(const mdl in models ){
        const fields = models[mdl]
        const creator = creators[mdl] || modelCreator
        const cls = creator({model: mdl, fields, rpc, env, odoo })
        env[mdl] = cls
    }

    return env
}

class Odoo {
    constructor(options){
        //console.log('parant odoo',options)
        const { host, db, models={}, creators={}, RPC } = options
        const RPC0 = RPC || _RPC
        const rpc = new RPC0({ host,db })
        this._rpc = rpc
        this._models = models

        const base_creators = {
            'bus.bus': busCreator ,
            'mail.channel': mailChannelCreator ,
            'mail.message': mailMessageCreator
        }

        this._env = create_env({
            models,
            creators: { ...base_creators, ...creators },
            rpc,
            odoo: this

        })
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
            await this.init()
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



export default Odoo
