
const fields_get = async (rpc, model,allfields,attributes)=>{
        const method = 'fields_get'
        const data = await rpc.call({ model, method,args:[allfields,attributes] })
        const {code} = data
        if(!code){
            const {result} = data
            return result
        }
        else{
            return {}
        }
}

const get_one = (cls, ins, fields)=>{
    return Object.keys(fields).reduce( (item, fld)=>{
        const fld_meta = cls._fields[fld]
        if(!fld_meta){
            return item
        }

        const {type,relation} = fld_meta

        if(['many2one','one2many', 'many2many'].indexOf(type)<0 ){
            item[fld] = ins.attr(fld)
        }

        else if(type === 'many2one'){
            const ref_cls = cls.env(relation)
            const ref_id = cls._records[ins._id ][fld]
            const ref_ins = new ref_cls(ref_id)
            item[fld] = get_one(ref_cls, ref_ins, fields[fld])
        }

        else{
            const ref_cls = cls.env(relation)
            const ref_ids = cls._records[ins._id ][fld]
            const m2m = new ref_cls(ref_ids)
            item[fld] = get_multi(ref_cls, m2m,fields[fld])
        }

        return item

    }, {id:ins._id} )
}

const get_multi = (cls, instances,fields)=>{
    return instances.list().reduce( (records, ins)=>{
        const item = get_one(cls, ins,fields)
        records.push(item)
        return records
    }, [] )
}

const modelCreator = (options)=>{
    const {model, fields: fields_raw, rpc, env} = options

    class cls {
        constructor(ids,vals){
            if(typeof(ids) === 'object' ){
                this._ids = ids
                this._instances = ids.reduce((acc,cur)=>{
                    acc[cur] =  new cls(cur)
                    return acc
                },{})
            }
            else{
                this._id = ids
                if(!ids){
                    return this
                }

                if(! cls._instances[ids] ){
                    cls._instances[ids] = this
                }

                if(vals){
                    cls._records[ids] = {...(cls._records[ids] || {}), ...vals}
                }

                return cls._instances[ids]
            }
        }

        // only for multi
        list(){ // only for multi
            return Object.values( this._instances )
        }

        // only for multi
        byid(id){ // only for multi
            return this._instances[id]
        }

        // only for multi
        view(id){ // only for multi
            return this._instances[id]
        }

        // only for single.
        attr(attr ){ // only for single
            const raw = ( cls._records[this._id] || {} )[attr]
            const {type,relation} = cls._fields[attr] || {}
            if(['many2one','one2many', 'many2many'].indexOf(type)<0 ){
                return raw
            }
            else{
                const ref_cls = cls.env(relation)
                return new ref_cls(raw)
            }
        }

        // only for single.  reserved for async read m2o and o2m fields
        ref(attr,flash=0 ){
            // only for single.  reserved for async read m2o and o2m fields
            const raw = ( cls._records[this._id] || {} )[attr]

            const {type,relation} = cls._fields[attr] || {}

            if(['many2one','one2many', 'many2many'].indexOf(type)<0 ){
                return raw
            }

            return cls.env(relation).init().then(ref_cls=>{
                if( type === 'many2one'){
                    if(!raw){
                        return new ref_cls()
                    }
                    else if(flash){
                        return ref_cls.browse(raw)
                    }
                    else{
                        return new ref_cls(raw)
                    }
                }
                else{
                    if(!raw.length){
                        return new ref_cls([])
                    }

                    if(flash){
                        return ref_cls.browse(raw)
                    }

                    const allin = raw.reduce((acc,cur)=>{
                         acc = acc && cur.toString() in ref_cls._instances;
                         return acc
                    },true)

                    if(!allin){
                        return ref_cls.browse(raw)
                    }

                    return new ref_cls(raw)
                }

            })
        }

        look(fields){
            if( this._id ){
                return get_one(cls, this,fields)
            }
            if( this._ids ){
                return get_multi(cls, this,fields)
            }
            return []
        }

        async write( vals){
            return cls.write(this._id, vals)
        }

        async unlink(){
            return cls.unlink(this._id)
        }

    }

    Object.defineProperty(cls, 'name', {value: model, configurable: true} )

    cls._name = model
    cls._rpc = rpc
    cls._env = env
    cls._records = {}
    cls._instances = {}
    cls._fields = { name: { type: 'char' } }

    cls._fields_raw = fields_raw || ['name']
    cls._inited = 0

    cls.init = async() => {
        // run only one  time. to set cls._fields for this cls
        if(cls._inited){
            return cls
        }

        const fs = cls._fields_raw
        const get_fields = async ()=>{
            const fields0 = await fields_get(rpc, model,fs,['type','relation'])
            return Object.keys(fields0).reduce( (acc,cur)=>{
                if(fs.indexOf(cur)>=0 ){
                    acc[cur] = fields0[cur]
                }
                return acc
            },{})
        }

        cls._fields = await get_fields()
        cls._inited = 1

        return cls
    }

    cls.env = (relation) => {
        let ref_cls = cls._env[relation]

        if(!ref_cls){
                ref_cls = modelCreator({
                    model:relation,
                    rpc: cls._rpc,
                    env:cls._env
                })
                cls._env[relation] = ref_cls
        }

        return ref_cls

    }

    //TBD error save in class
    cls.call = async (method, args=[], kwargs={} ) =>{
            const params = {
                model:cls._name,
                method, args, kwargs
            }
            const data = await cls._rpc.call(params)
            const {code} = data

            if(!code){
                const {result} = data
                return result
            }

            // TBD error save in class
            return null
    }

    cls._get_fields2 = async (fields0)=>{
        const fields = fields0 || {}
        await cls.init()
        return Object.keys(cls._fields).reduce(async (accPromise,cur)=>{
            const acc = await accPromise
            acc.push(
                fields[cur] ? [
                    cur, await cls.env(
                        cls._fields[cur].relation
                    )._get_fields2(fields[cur])
                ] : cur
            )
            return acc
        },Promise.resolve([]))
    }

    cls._list2instance = (data,fields)=> {
        const ids = data.reduce((acc, cur)=>{
            const ins = cls._dict2instance( cur, fields)
            acc.push( cur.id )
            return acc
        },[])

        const instance = new cls(ids)
        return instance
    }

    cls._dict2instance = (data,fields)=> {
        const {id} = data
        if (!id){
            return new cls(id )
        }

        const vals =  Object.keys(data).reduce((acc,fld)=>{
            const value = data[fld]
            const {type, relation } = cls._fields[fld] || {}

            if(['many2one','one2many', 'many2many'].indexOf(type)<0 ){
                acc[fld] = value
                return acc
            }

            const ref_cls = cls.env(relation)
            if(type === 'many2one'){
                if(!value){
                    acc[fld] = value
                }
                else if ( value.length == 0 ){
                    acc[fld] = null
                }
                else{
                    const ref_vals = fields[fld] ? value[0] : {
                        id:value[0], name:value[1], display_name: value[1]
                    }
                    const ref_m2o = ref_cls._dict2instance(ref_vals,fields[fld])
                    acc[fld] = ref_vals.id
                }
            }
            else{
                if(fields[fld]){
                    const ref_m2m = ref_cls._list2instance(value,fields[fld])
                    acc[fld] = value.map(item=> item.id )
                }
                else{
                    acc[fld] = value
                }
            }
            return acc
        },{})

        return new cls(id, vals)

    }

    cls.search = async (domain,fields0={})=>{
        const fields2= await cls._get_fields2(fields0)
        const data = await cls.call('search_read2',[domain,fields2 ])
        return cls._list2instance(data || [], fields0)
    }

    cls.browse = async (ids, fields0={})=>{
        const fields2= await cls._get_fields2(fields0)
        const data0 = await cls.call('read',[ids,fields2 ])
        const data = data0 ? data0 : []

        if (typeof ids ==='object'){
            return cls._list2instance( data, fields0)
        }
        else{
            const vals = data.length ? data[0] : {}
            return cls._dict2instance( vals, fields0)
        }
    }

    cls.search_read = async (ids, fields)=>{
        const ins = await cls.search(ids, fields)
        return ins.look(fields)
    }

    cls.read = async (ids, fields)=>{
        const ins = await cls.browse(ids, fields)
        return ins.look(fields)
    }

    cls.create = async (vals,)=>{
        const data = await cls.call('create',[ vals ])
        if(data){
            return cls.browse(data)
        }
        return data
    }

    cls.write = async (id, vals)=>{
        const data = await cls.call('write',[ id, vals ])
        if(data){
            return cls.browse(id)
        }
        return data
    }

    cls.unlink = async (id) => {
        const data = await cls.call('unlink',[ id ])
        if(data){
            cls.view(id)._id = null
            delete cls._instances[id]
            delete cls._records[id]
            return data
        }

        return data

    }

    cls.view = (id) => {
        return cls._instances[id]
    }

    return cls

}

export default modelCreator

