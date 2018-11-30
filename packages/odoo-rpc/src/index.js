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
        this._env = null
    }

    async login(params){
        const data = await this._rpc.login(params )
        if( ! this._env){
            this._env = create_env(this._models, this._rpc)
        }
        
        return data
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

export default Odoo
