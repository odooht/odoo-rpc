import ODOO from './odoo-mock'


describe('jsonrpc', () => {
    it('all ok', (done) => {

        //test_browse_multi(done)
        //test(done)
        test(done)

    });
});


const get_odoo = async ()=>{
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    const models = {
        'res.users': ['name','partner_id','company_id','category_id'],
        'res.partner': ['name','email','user_id','company_id','category_id'],
        'res.company': ['name','email'],
        'res.country': ['name' ],
    }

    const odoo = new ODOO({ host, db, models })
    const ss = await odoo.login({login:'admin',password:'123'})

    //console.log(ss)

    return odoo

}


const test = async (done) => {
    await test_init()
    await test_env()
    await test_get_fields2()
    test_list2instance()
    test_look()
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
    console.log(Partner._fields)
    expect(Partner._fields).toEqual(null);
    await Partner.init()
    console.log(Partner._fields)
    expect(Partner._fields.name.type).toEqual("char");
}

/*
cls.env()
任何时候, 可以通过cls.env()取一个模型
如果cls初始化时的参数 env 中 没有 这个模型,
则通过cls.env获得的新模型 只有 name字段可用
*/

const test_env = async () =>{
    const odoo = await get_odoo()
    const cls = odoo.env('res.partner')

    const ref_cls = cls.env('res.partner.title')
    console.log(ref_cls._fields_raw)
    console.log(ref_cls._fields)
    console.log(ref_cls._name)
    console.log(ref_cls.name)
    expect(ref_cls._name).toEqual('res.partner.title');
    expect(ref_cls.name).toEqual('res.partner.title');
    expect(ref_cls._fields_raw).toEqual(['name']);

}

/*
cls._get_fields2(fields)
传入嵌套读取时用的参数 feilds = {name:null, m2o1: null, m2o2: {name}}
返回新格式 [name,m2o1,[m2o2,[name]]]

*/

const test_get_fields2 = async () =>{

}

/*
cls._list2instance()
cls._dist2instance()
同步函数
将嵌套读取返回的数据, 递归处理, 生成实例
*/

const test_list2instance = () =>{

}


/*
ins.look(fields)
get_one()
get_multi()
同步函数
根据 参数 fields, 从cls._records中嵌套读取数据, 返回对象或数组


*/

const test_look = () =>{

}


/*
ins.attr(attr)
读字段


*/

const test_attr = () =>{

}



