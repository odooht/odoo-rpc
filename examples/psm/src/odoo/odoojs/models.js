
const modelCreator = options => {
    const { model, fields: fields_raw, rpc, env } = options;

    class cls {
        constructor(ids) {
            this._ids = [];
            this._id = null;

            if (ids && typeof ids === 'object') {
                this._ids = ids;
                this._id = ids.length ? ids[0] : null
            }
            else {
                this._id = ids;
                this._ids = ids ? [ids] : []
            }
        }

        //len(){
        //    return this._ids.length
        //}

        get length(){
            return this._ids.length
        }

        get ids(){
            return this._ids
        }

        get id(){
            return this._id
        }

        async call( method, args=[], kwargs ={} ){
            return cls.call( method, [ this._ids, ...args ], kwargs );
        }

        async toggle_active(){
            return this.call( 'toggle_active');
        }

        async browse(fields){
            const myCls = this.__proto__.constructor;
            return myCls.browse( this._ids, fields);
        }

        list() {
            const myCls = this.__proto__.constructor;
            const instances = this._ids.reduce((acc, cur) => {
                acc[cur] = new myCls(cur);
                return acc;
            }, {});
            return Object.values(instances);
        }

        byid(id) {
            const myCls = this.__proto__.constructor;
            return new myCls(id);
        }

        // only for multi
        view(id) {
            // only for multi
            const myCls = this.__proto__.constructor;
            return new myCls(id);
        }

        // only for single. //TBD , check typeof( value )
        setAttr(attr, value) {
            // only for single
            const rec = cls._records[this._id];

            const {
                type ,
                //relation ,
            } = cls._fields[attr] || {};

            if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
                rec[attr] = value;
            } else if (type === 'many2one') {
                //TBD , check typeof( value )
                rec[attr] = value._id;
            } else {
                //TBD , check typeof( value )
                rec[attr] = value._ids;
            }
        }

        setattr = this.setAttr;

        // only for single.
        /*  TBD 2019-1-29,  how about proxy?
        get record(){
            const rec = cls._records[this._id]
            return {
                name:     this.name
                m2o_id:   new ref_cls( this.m2o_id )
                m2m_ids:  new ref_cls( this.m2m_ids )
            }
        }
        */
        attr(attr, ref=0,ref_fields={}) {
            // only for single
            if (ref){
                return this._get_ref(attr,ref_fields)
            }


            const raw = (cls._records[this._id] || {})[attr];
            const { type, relation } = cls._fields[attr] || {};
            if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
                return raw;
            } else {
                const ref_cls = cls.env(relation);
                return new ref_cls(raw);
            }
        }

        async _get_ref(attr,ref_fields){
            const {
                relation: ref_cls_name,
                //type: ref_type,
            } = cls._fields[attr]
            const ref_cls = cls.env(ref_cls_name)
            const ref_ins = this.attr(attr)
            return await ref_cls.browse( ref_ins._ids, ref_fields )
        }

        // TBD, if after call setAttr, then we have custom field.
        //  but look dont return custom field
        look(fields) {
            return this.look1(fields)
        }

        look1(fields) {
            if ( this._id ){
                return cls._get_one(this._id, fields);
            }
            else{
                return {}
            }
        }

        look2(fields) {
            return cls._get_multi(this._ids, fields);
        }

        async write(vals) {
            return cls.write(this._ids, vals);
        }

        async unlink() {
            const data = cls.unlink(this._ids);
            if(data){
                this._id = null
                this._ids = []
            }

            return data


        }
    }

    Object.defineProperty(cls, 'name', { value: model, configurable: true });

    cls._name = model;
    cls._rpc = rpc;
    cls._env = env;
    cls._records = {};

    cls._extends = [];
    cls._sudo_user = {};

    cls._fields = {};
    cls._fields_raw = fields_raw || ['name'];

    cls.ref =  async (xmlid) => {
        // get model and id from xmlid
        return cls.env('ir.model.data').call('xmlid_to_res_model_res_id', [xmlid, true] )
    }

    cls.init = async () => {
        // run only one  time. to set cls._fields for this cls
        //console.log( 'init:', cls._name, cls._fields_raw, cls._fields )
        if (Object.keys( cls._fields).length ) {
            return cls.env(cls._name);
        }
        const _fields = await cls.fields_get(cls._fields_raw, ['type', 'relation']);
        if (_fields && Object.keys(_fields).length > 0) {
            for ( const fld in _fields ){
                cls._fields[fld] = _fields[fld]
            }
        }
        return cls.env(cls._name);
    };

    cls.env = relation => {
        let ref_cls = cls._env[relation];
        // if cls mot defined in env
        // then create a cls, and need not init()

        if (!ref_cls) {
            ref_cls = modelCreator({
                model: relation,
                rpc: cls._rpc,
                env: cls._env,
            });
            ref_cls._fields = { id: { type: 'integer' }, name: { type: 'char' } };

            cls._env[relation] = ref_cls;
        }
        return ref_cls;
    };

    cls.sudo = (user) => {
        const new_cls0 =  cls._sudo_user[user]
        if(new_cls0){
            return new_cls0
        }

        const new_cls = modelCreator(options)
        new_cls._fields = cls._fields
        new_cls._records = cls._records
        new_cls._extends = cls._extends
        new_cls._sudo_user = cls._sudo_user
        new_cls._sudo = user

        let extend_new_cls = new_cls
        for(const extend of cls._extends){
            extend_new_cls =  extend(extend_new_cls )
        }
        Object.defineProperty(extend_new_cls, 'name', { value: cls._name, configurable: true })
        cls._sudo_user[user] = extend_new_cls
        return extend_new_cls
    }

    cls.call = async (method, args = [], kwargs = {}) => {
        const params = {
            model: cls._name,
            method, args,  kwargs,
            sudo: cls._sudo,
        };
        const data = await cls._rpc.call(params);
        const { code } = data;
        if (!code) {
            const { result } = data;
            return result;
        }
        else {
            // const { error } = data;
            // if error, then redirect error page,
            // and this function return null
            return null;
        }
    };

    cls._get_fields2 = async fields0 => {
        const fields = fields0 || {};
        await cls.init();

        return Object.keys({ ...cls._fields, ...fields}).reduce(async (accPromise, cur) => {
            const acc = await accPromise;
            if ( !(cur in cls._fields) ){
                acc.push( cur )
                return acc
            }

            const { type, relation } = cls._fields[cur];

            let ref_fields = null;
            if (['many2one', 'one2many', 'many2many'].indexOf(type) >= 0) {
                const ref_cls = cls.env(relation);
                await ref_cls.init();
                if (fields[cur]) {
                    ref_fields = await ref_cls._get_fields2(fields[cur]);
                }
            }
            acc.push( ref_fields ? [cur, ref_fields] : cur);
            return acc;


        }, Promise.resolve([]));
    };

    cls._set_multi = (data, fields = {}) => {
        const ids = data.reduce((acc, cur) => {
            const id = cls._set_one(cur, fields);
            if(id){ // TBD
            }
            acc.push(cur.id);
            return acc;
        }, []);
        return ids;
    };

    cls._set_one = (data, fields = {}) => {
        const { id } = data;
        if (!id) {
            return id;
        }

        const vals = Object.keys(data).reduce((acc, fld) => {
            const value = data[fld];
            const { type, relation } = (cls._fields || {})[fld] || {};

            if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
                acc[fld] = value;
                // TBD , bin , image ?
                return acc;
            }

            const ref_cls = cls.env(relation);
            if (type === 'many2one') {
                if (!value) {
                    acc[fld] = value;
                }
                else if (value.length === 0) {
                    acc[fld] = null;
                }
                else {
                    // TBD: to set name, after to check cls._records
                    const ref_vals = fields[fld] ? value[0] : {
                        id: value[0],
                        display_name: value[1],
                    };

                    const ref_rec = ref_cls._records[ref_vals.id]
                    if( !(ref_rec && ref_rec.name) ){
                      ref_vals['name'] = value[1]
                    }

                    ref_cls._set_one(ref_vals, fields[fld]);
                    acc[fld] = ref_vals.id;
                }
            }
            else {
                if (fields[fld]) {
                    ref_cls._set_multi(value, fields[fld]);
                    acc[fld] = value.map(item => item.id);
                }
                else {
                    acc[fld] = value;
                }
            }
            return acc;
        }, {});
        cls._records[id] = { ...(cls._records[id] || {}), ...vals };
        return id;
    };

    cls._get_one = (id, fields0, notall) => {

    //    const fields = fields0 || Object.keys(cls._fields).reduce((acc,cur)=>{
    //        acc[cur] = 1
    //        return acc
    //    },{})



        const fields1 = Object.keys(cls._fields).reduce((acc,cur)=>{
            acc[cur] = 1
            return acc
        },{})

        const fields00 = fields0 || {}
        const fields = (! notall ) ? {...fields1, ...fields00} : fields0 || fields1

        const get_ref_fields = (fld, fields ) => {
            let ref_fields = { name: null }
            if (fld in fields){
                const ref_flds = fields[fld]
                if ( typeof ref_flds === 'object' ){
                    ref_fields = ref_flds
                }
            }

            return ref_fields
        }

        return Object.keys(fields).reduce( (item, fld) => {
            const fld_meta = cls._fields[fld];
            if (!fld_meta) {
                return item;
            }

            const { type, relation } = fld_meta;

            if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
                if ( cls._records[id] ){
                    item[fld] = cls._records[id][fld];
                }
            }
            else if (type === 'many2one') {
                const ref_cls = cls.env(relation);
                const ref_id = cls._records[id] ? cls._records[id][fld] : null;
                const ref_fields = get_ref_fields(fld, fields )
                const noall = ! (typeof fields[fld] === 'object')
                item[fld] = ref_id && ref_cls._get_one( ref_id, ref_fields, noall );
            }
            else {
                const ref_cls = cls.env(relation);
                const ref_ids = cls._records[id][fld];
                const ref_fields = get_ref_fields(fld, fields )
                const noall = ! (typeof fields[fld] === 'object')
                item[fld] = ref_ids && ref_cls._get_multi(ref_ids, ref_fields, noall );
            }

            return item;
        }, { id } );
    };

    cls._get_multi = (ids, fields, notall) => {
        return ids.reduce((records, id) => {
            const item = cls._get_one(id, fields, notall);
            records.push(item);
            return records;
        }, []);
    };

    cls.fields_get = async (allfields, attributes) => {
        const data = await cls.call('fields_get', [allfields, attributes]);
        const fields = data || {};

        if (!allfields) {
            return fields;
        }

        return Object.keys(fields).reduce((acc, cur) => {
            if (allfields.indexOf(cur) >= 0) {
                acc[cur] = fields[cur];
            }
            return acc;
        }, {});
    };

    cls.search = async (domain, fields0 = {}, kwargs = {}) => {
        //const {offset, limit, order} = kwargs
        const fields2 = await cls._get_fields2(fields0);
        const data = await cls.call('search_read2', [domain, fields2], kwargs);
        const ids = await cls._set_multi(data || [], fields0);
        return cls.view(ids);
    };

    cls.browse = async (ids, fields0 = {}, lazy = 0) => {
        // if lazy == 1, then try to get data from cls._records
        // if no data from cls._records, then call odoo request
        if (!ids) {
            return cls.view(ids);
        }

        if (lazy) {
            const ids0 = typeof ids === 'object' ? ids : [ids];

            const allin = ids0.reduce((acc, cur) => {
                if (!cls._records[cur]) {
                    acc = 0;
                }
                return acc
            }, 1);

            if (allin) {
                return cls.view(ids);
            }
        }

        const fields2 = await cls._get_fields2(fields0);
        const data0 = await cls.call('read2', [ids, fields2]);
        const data = data0 ? data0 : [];

        if (typeof ids === 'object') {
            const ids = cls._set_multi(data, fields0);
            return cls.view(ids);
        }
        else {
            const vals = data.length ? data[0] : {};
            const id = cls._set_one(vals, fields0);
            return cls.view(id);
        }
    };

    cls.search_read = async (domain, fields, kwargs) => {
        const ins = await cls.search(domain, fields, kwargs);
        return ins.look2(fields);
    };

    cls.search_count = async domain => {
        const data0 = await cls.call('search_count', [domain]);
        return data0;
    };

    cls.read = async (ids, fields) => {
        const ins = await cls.browse(ids, fields);
        return ins.look2(fields);
    };

    cls.create = async vals => {
        const data = await cls.call('create', [vals]);
        if (data) {
            return cls.browse(data);
        }
        return data;
    };

    cls.write = async (id, vals) => {
        const data = await cls.call('write', [id, vals]);
        if (data) {
            return cls.browse(id);
        }
        return data;
    };

    cls.unlink = async id => {
        const data = await cls.call('unlink', [id]);
        if (data) {
            delete cls._records[id];
            return data;
        }

        return data;
    };

    cls.view = id => {
        const myCls = cls._env[cls._name];

        return new myCls(id || Object.keys(cls._records));
    };

    return cls;
};

export default modelCreator;
