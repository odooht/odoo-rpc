import modelCreator from './models'
import RPC from './rpc'

const create_env = (models, rpc )=>{
    const env = {}
    for(const mdl in models ){
        const fields = models[mdl]
        const cls = modelCreator({model: mdl, fields, rpc, env })
        env[mdl] = cls
    }

    return env
}

class Odoo {
    constructor(options){
        const { host,db,models } = options
        const rpc = new RPC({ host,db })
        this._rpc = rpc
        this._models = models
        this._env = create_env(models, rpc)
    }

    async login(params){
        const data = await this._rpc.login(params )
        if(!data.code){
            Odoo._session[this._rpc.sid] = this
            return this._rpc.sid
        }
        return null
    }

    async logout(){
        return this._rpc.logout()
    }

    env(model){
        let cls = this._env[model]
        if(!cls){
            cls = modelCreator({ model, rpc: this._rpc, env:this._env })
            this._env[model] = cls
        }
        return cls
    }

}

Odoo._session = {}

Odoo.load = (session_id) =>{
    return Odoo._session[session_id]
}



export default Odoo
