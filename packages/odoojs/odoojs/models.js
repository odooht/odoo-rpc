// TBD:   this.call , use this._ids not this._id,  for api.multi


const modelCreator = options => {
  const { model, fields: fields_raw, rpc, env } = options;

  class cls {
    constructor(ids) {
      // ids = null :  null instanse
      // ids = integer :  single instanse
      // ids = [] or [1,2,3] :  multi instanse

      //  this._id == null,  null instance or multi instance
      //  this._id == int,   single instance
      //  this._ids == [1,2,3],   multi instance

      this._ids = [];
      if (ids && typeof ids === 'object') {
        this._ids = ids;
      } else {
        this._id = ids;
      }
    }

      async call( method, args=[], kwargs ={} ){
          return cls.call( method, [ this._id, ...args ], kwargs );
      }

      async toggle_active(){
          return this.call( 'toggle_active');
      }

    // only for multi
    list() {
      // only for multi
      const myCls = this.__proto__.constructor;
      const instances = this._ids.reduce((acc, cur) => {
        acc[cur] = new myCls(cur);
        return acc;
      }, {});
      return Object.values(instances);
    }

    // only for multi
    byid(id) {
      // only for multi
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

      const { type, relation } = cls._fields[attr] || {};

      if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
        rec[attr] = value;
      } else if (type == 'many2one') {
        //TBD , check typeof( value )
        rec[attr] = value._id;
      } else {
        //TBD , check typeof( value )
        rec[attr] = value._ids;
      }
    }

    setattr = this.setAttr;

    // only for single.
    attr(attr) {
      // only for single
      const raw = (cls._records[this._id] || {})[attr];
      const { type, relation } = cls._fields[attr] || {};
      if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
        return raw;
      } else {
        const ref_cls = cls.env(relation);
        return new ref_cls(raw);
      }
    }

    /*
        // only for single.  reserved for async read m2o and o2m fields
        ref(attr, flash = 0) {
            // only for single.  reserved for async read m2o and o2m fields
            const raw = (cls._records[this._id] || {})[attr]

            const { type, relation } = cls._fields[attr] || {}

            if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
                return raw
            }

            return cls.env(relation).init().then(ref_cls => {
                if (type === 'many2one') {
                    if (!raw) {
                        return new ref_cls()
                    }
                    else if (flash) {
                        return ref_cls.browse(raw)
                    }
                    else {
                        return new ref_cls(raw)
                    }
                }
                else {
                    if (!raw.length) {
                        return new ref_cls([])
                    }

                    if (flash) {
                        return ref_cls.browse(raw)
                    }

                    const allin = raw.reduce((acc, cur) => {
                        acc = acc && cur.toString() in ref_cls._instances;
                        return acc
                    }, true)

                    if (!allin) {
                        return ref_cls.browse(raw)
                    }

                    return new ref_cls(raw)
                }

            })
        }

        */

    // TBD, if after call setAttr, then we have custom field.
    //  but look dont return custom field
    look(fields) {
      if (this._id) {
        return cls._get_one(this._id, fields);
      }
      if (this._ids) {
        return cls._get_multi(this._ids, fields);
      }
      return [];
    }

    async write(vals) {
      return cls.write(this._id, vals);
    }

    async unlink() {
      return cls.unlink(this._id);
    }
  }

  //

  Object.defineProperty(cls, 'name', { value: model, configurable: true });

  cls._name = model;
  cls._rpc = rpc;
  cls._env = env;
  cls._records = {};
  cls._fields = null;
  cls._fields_raw = fields_raw || ['name'];

  cls.init = async () => {
    // run only one  time. to set cls._fields for this cls

    console.log( 'init:', cls._name, cls._fields_raw, cls._fields )

    if (cls._fields) {
      return cls.env(cls._name);
    }
    const _fields = await cls.fields_get(cls._fields_raw, ['type', 'relation']);
    if (_fields && Object.keys(_fields).length > 0) {
      cls._fields = _fields;
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

  cls.call = async (method, args = [], kwargs = {}) => {


    const params = {
      model: cls._name,
      method,
      args,
      kwargs,
    };
    const data = await cls._rpc.call(params);
    const { code } = data;
    if (!code) {
      const { result } = data;
      return result;
    } else {
      const { error } = data;
      // if error, then redirect error page,
      // and this function return null
      return null;
    }
  };

  cls._get_fields2 = async fields0 => {
    const fields = fields0 || {};
    await cls.init();
    return Object.keys(cls._fields).reduce(async (accPromise, cur) => {
      const acc = await accPromise;
      const { type, relation } = cls._fields[cur];

      let ref_fields = null;
      if (['many2one', 'one2many', 'many2many'].indexOf(type) >= 0) {
        const ref_cls = cls.env(relation);
        await ref_cls.init();
        if (fields[cur]) {
          ref_fields = await ref_cls._get_fields2(fields[cur]);
        }
      }

      acc.push(fields[cur] ? [cur, ref_fields] : cur);

      return acc;
    }, Promise.resolve([]));
  };

  cls._set_multi = (data, fields = {}) => {
    const ids = data.reduce((acc, cur) => {
      const ins = cls._set_one(cur, fields);
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
        } else if (value.length == 0) {
          acc[fld] = null;
        } else {
          // TBD: to set name, after to check cls._records
          const ref_vals = fields[fld]
            ? value[0]
            : {
                id: value[0],
                name: value[1],
                display_name: value[1],
              };
          ref_cls._set_one(ref_vals, fields[fld]);
          acc[fld] = ref_vals.id;
        }
      } else {
        if (fields[fld]) {
          ref_cls._set_multi(value, fields[fld]);
          acc[fld] = value.map(item => item.id);
        } else {
          acc[fld] = value;
        }
      }
      return acc;
    }, {});
    cls._records[id] = { ...(cls._records[id] || {}), ...vals };
    return id;
  };

  cls._get_one = (id, fields) => {
    return Object.keys(fields).reduce(
      (item, fld) => {
        const fld_meta = cls._fields[fld];
        if (!fld_meta) {
          return item;
        }

        const { type, relation } = fld_meta;

        if (['many2one', 'one2many', 'many2many'].indexOf(type) < 0) {
          item[fld] = cls._records[id][fld];
        } else if (type === 'many2one') {
          const ref_cls = cls.env(relation);
          const ref_id = cls._records[id][fld];

          item[fld] =
            ref_id && ref_cls._get_one(ref_id, fields[fld] || { name: null });
        } else {
          const ref_cls = cls.env(relation);
          const ref_ids = cls._records[id][fld];
          item[fld] = ref_cls._get_multi(ref_ids, fields[fld]);
        }

        return item;
      },
      { id }
    );
  };

  cls._get_multi = (ids, fields) => {
    if (!fields) {
      return ids;
    }

    return ids.reduce((records, id) => {
      const item = cls._get_one(id, fields);
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
    //
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
    } else {
      const vals = data.length ? data[0] : {};
      const id = cls._set_one(vals, fields0);
      return cls.view(id);
    }
  };

  cls.search_read = async (domain, fields, kwargs) => {
    const ins = await cls.search(domain, fields, kwargs);
    return ins.look(fields);
  };

  cls.search_count = async domain => {
    const data0 = await cls.call('search_count', [domain]);
    return data0;
  };

  cls.read = async (ids, fields) => {
    const ins = await cls.browse(ids, fields);
    return ins.look(fields);
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
      cls.view(id)._id = null;
      delete cls._records[id];
      return data;
    }

    return data;
  };

  cls.view = id => {
    const myCls = cls._env[cls._name];
    return new myCls(id);
  };

  return cls;
};

export default modelCreator;
