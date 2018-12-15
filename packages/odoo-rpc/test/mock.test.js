
import ODOO from '../src'
import RPC from './rpc-mock'

describe('jsonrpc', () => {
    it('all ok', (done) => {
        test(done)

    });
});

const get_odoo = ()=>{
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    const models = {
        'res.users': ['login','name','partner_id','company_id','category_id'],
        'res.partner': ['name','email','user_id','company_id','category_id'],
        'res.partner.title': ['name','shortcut'],
        'res.company': ['name','email'],
        'res.country': ['name' ],
    }

    const odoo = new ODOO({ host, db, models, RPC })
    const rpc = odoo._rpc
    rpc.sid = 'sid1'
    rpc.uid = 1
    return odoo

}

const test = async (done) => {
    //await test_init()
    //test_env()

    await test_get_fields2()
    //test_set()
    //test_look()
    done()
}

/*
cls.init()
cls新建时, cls._fields = null
cls.init() 会调用 fields_get 接口 给 cls._fields赋值
*/

const test_init = async () =>{
    const odoo = await get_odoo()
    const Partner = odoo.env('res.partner')
    //console.log(Partner._fields)
    expect(Partner._fields).toEqual(null);
    await Partner.init()
    //console.log(Partner._fields)
    expect(Partner._fields.name.type).toEqual("char");
}

/*
cls.env()
任何时候, 可以通过cls.env()取一个模型
如果cls初始化时的参数 env 中 没有 这个模型,
则通过cls.env获得的新模型 只有 name字段可用
*/

const test_env = () =>{
    const odoo = get_odoo()
    const cls = odoo.env('res.partner')
    const ref_cls = cls.env('product.product')
    expect(ref_cls._name).toEqual('product.product');
    expect(ref_cls.name).toEqual('product.product');
    expect(ref_cls._fields_raw).toEqual(['name']);

}


const get_odoo_with_init = ()=>{
    const odoo = get_odoo()
    odoo.env('res.partner')._fields = {
        name:  {type: 'char'},
        email: {type: 'char'},
        title: {type: 'many2one',  relation: 'res.partner.title'},
        user_id:     {type: 'many2one',  relation: 'res.users'},
        company_id:  {type: 'many2one',  relation: 'res.company'},
        category_id: {type: 'many2many', relation: 'res.partner.category'},
    }

    odoo.env('res.partner.title')._fields = {
        name:  {type: 'char'},
        shortcut:  {type: 'char'},
    }

    odoo.env('res.users')._fields = {
        name:  {type: 'char'},
        login:  {type: 'char'},
    }

    odoo.env('res.partner.category')._fields = {
        name:  {type: 'char'},
    }

    return odoo
}

/*
cls._get_fields2(fields)
传入嵌套读取时用的参数 feilds = {name:null, m2o1: null, m2o2: {name}}
返回新格式 [name,m2o1,[m2o2,[name]]]

*/

const test_get_fields2 = async () =>{
    const odoo = get_odoo_with_init()
    const Partner = odoo.env('res.partner')

    const fields = {
        ref: null,
        title: {name:null}
    }

    const fields2 =  await Partner._get_fields2(fields)
    console.log(fields2)

    expect(fields2).toEqual( [ 'name', 'email', ["title", ["name", "shortcut"]], 'user_id', 'company_id', 'category_id' ])


}

const test_set = () =>{
    test_set_many2one()
}

/*
    data = {}
    cls._set_one( data ,fields)
    data2 = [{},{}]
    cls._set_multi( data2,fields )

    将嵌套读取数据, 递归处理, 存储到 cls._records 里
*/

const test_set_many2one =() => {
    const odoo = get_odoo_with_init()
    const Partner = odoo.env('res.partner')
    console.log(Partner._records)
    expect(Partner._records).toEqual({});

    const data = { id: 1, name: 'ssss' }
    const id = Partner._set_one(data)

    console.log(Partner._records[id])
    expect(Partner._records[id]).toEqual({ id: 1, name: 'ssss'  });

}

const test_look = () =>{
    test_look_for_many2one_not_null()
    test_look_for_many2one_is_null()
    test_look_for_many2many_not_null()
    test_look_for_many2many_is_null()
}

/*
ins.look(fields)
调用 cls._get_one(), cls._get_multi()
根据 参数 fields, 从cls._records中嵌套读取数据, 返回对象或数组
*/

const test_look_for_many2one_not_null = () =>{
    const odoo = get_odoo_with_init()
    const Partner = odoo.env('res.partner')

    Partner._records = {
        1 : {id: 1, name:'p1', email: null, title: 2},
        2 : {id: 2, name:'p2', email: null, title: 2},
    }

    const Title = odoo.env('res.partner.title')
    Title._records = {
        2 : {id:2, name:'Doctor', shortcut: 'Dr'},
        6 : {id:6, name:'Master', shortcut: 'Ms'}
    }

    //const p1 = Partner.view(1)
    const p1 = new Partner(1)

    const p1_data = p1.look({
        name:null, email: null, title: null
    })
    console.log(p1_data)
    // 读取 m2o字段, 只返回m2o 的 name字段
    expect(p1_data).toEqual({
        id: 1, name: 'p1', email: null, title: { id: 2, name: 'Doctor' }
    });

    const p1_data2 = p1.look({
        name:null, email: null, title: {name:null, shortcut: null}
    })
    console.log(p1_data2)
    // 读取 m2o字段, 返回m2o 的 多个字段
    expect(p1_data2).toEqual({
        id: 1, name: 'p1', email: null,
        title: { id: 2, name: 'Doctor', shortcut: 'Dr' }
    });

}

const test_look_for_many2one_is_null = () =>{
    const odoo = get_odoo_with_init()
    const Partner = odoo.env('res.partner')

    Partner._records = {
        1 : {id: 1, name:'p1', email: null, title: null},
    }
    const Title = odoo.env('res.partner.title')
    Title._records = {
        2 : {id:2, name:'Doctor', shortcut: 'Dr'}
    }

    const p1 = Partner.view(1)
    const fields = { name:null, email: null, title: null }
    const p1_data = p1.look(fields)
    console.log(p1_data)
    // 读取 m2o字段, 当 m2o为 null
    //expect(p1_data).toEqual({ id: 1, name: 'p1', email: null, title: null });
    expect(p1_data).toEqual({ id: 1, name: 'p1', email: null, title: {id: null, name:null} });

    const p1_data2 = p1.look({
        name:null, email: null, title: {name:null, shortcut: null}
    })
    console.log(p1_data2)
    // 读取 m2o字段, 当 m2o为 null, 返回m2o 的 多个字段
    //expect(p1_data2).toEqual({ id: 1, name: 'p1', email: null, title: null });
    expect(p1_data2).toEqual({ id: 1, name: 'p1', email: null, title: {id: null, name:null,shortcut: null} });

}

const test_look_for_many2many_not_null = () =>{
    const odoo = get_odoo_with_init()
    const Partner = odoo.env('res.partner')

    Partner._records = {
        1 : {name:'p1', email: null, category_id: [1,2]},
    }
    const Category = odoo.env('res.partner.category')
    Category._records = {
        1 : {name:'c1'},
        2 : {name:'c2'}
    }
    const p1 = Partner.view(1)
    const p1_data = p1.look({
        name:null, email: null, category_id: null
    })
    console.log(p1_data)

    // 读取 m2m字段, 只返回m2m 的 id 列表
    expect(p1_data).toEqual({
        id: 1, name: 'p1', email: null,
        category_id: [1,2]
    });

    const p1_data2 = p1.look({
        name:null, email: null, category_id: {name:null}
    })
    console.log(p1_data2)
    // 读取 m2m字段, 返回m2m 的 具体内容
    expect(p1_data2).toEqual({
        id: 1, name: 'p1', email: null,
        category_id: [{id: 1, name: 'c1'}, {id: 2, name: 'c2'}]
    });

}

const test_look_for_many2many_is_null = () =>{
    const odoo = get_odoo_with_init()
    const Partner = odoo.env('res.partner')

    Partner._records = {
        1 : {name:'p1', email: null, category_id: []},
    }
    const Category = odoo.env('res.partner.category')
    Category._records = {
        1 : {name:'c1'},
        2 : {name:'c2'}
    }

    const p1 = Partner.view(1)
    const p1_data = p1.look({
        name:null, email: null, category_id: null
    })
    console.log(p1_data)
    // 读取 m2m字段, 只返回m2m 的 id 列表
    expect(p1_data).toEqual({
        id: 1, name: 'p1', email: null,
        category_id: []
    });

    const p1_data2 = p1.look({
        name:null, email: null, category_id: {name:null}
    })
    console.log(p1_data2)
    // 读取 m2m字段, 返回m2m 的 具体内容
    expect(p1_data2).toEqual({
        id: 1, name: 'p1', email: null,
        category_id: []
    });

}


/*
ins.attr(attr)
读字段


*/

const test_attr = () =>{

}



