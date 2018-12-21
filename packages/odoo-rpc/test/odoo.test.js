import ODOO from '../src';

describe('jsonrpc', () => {
  it('all ok', done => {
    test(done);
  });
});

const get_odoo = () => {
  const host = 'http://192.168.56.105:8069';
  const db = 'TT';
  const models = {
    'res.users': ['login', 'name', 'partner_id', 'company_id', 'category_id'],
    'res.partner': [
      'name',
      'email',
      'title',
      'user_id',
      'company_id',
      'category_id',
    ],
    'res.partner.title': ['name', 'shortcut'],
    'res.company': ['name', 'email'],
    'res.country': ['name'],
  };

  const odoo = new ODOO({ host, db, models });
  const rpc = odoo._rpc;

  rpc.login = async params => {
    const { login, password } = params;
    let data = {};
    if (login == 'admin' && password == '123') {
      data = {
        code: 0,
        result: { status: 'ok', sid: `sid_${login}_${password}`, uid: 1 },
      };
    } else {
      data = { code: 0, result: { status: 'error' } };
    }

    const { code } = data;
    if (!code) {
      const {
        result: { status },
      } = data;
      if (status == 'ok') {
        const {
          result: { sid, uid },
        } = data;
        rpc.sid = sid;
        rpc.uid = uid;
      } else {
        rpc.sid = null;
        rpc.uid = null;
      }
    } else {
      rpc.sid = null;
      rpc.uid = null;
    }

    return data;
  };

  rpc.logout = async () => {
    if (!rpc.sid) {
      return { code: 1, error: {} };
    }

    const data = { code: 0, result: {} };
    rpc.sid = null;
    rpc.uid = null;

    return data;
  };

  rpc.call = async params => {
    if (!rpc.sid) {
      return { code: 1, error: { message: 'no sid' } };
    }

    const { model, method, args = [], kwargs = {} } = params;
    const data = {
      code: 0,
      result: rpc_mock[method](model, ...args, kwargs),
    };
    const { code } = data;
    if (!code) {
      const { result } = data;
    }
    return data;
  };

  return odoo;
};

const rpc_mock = {
  fields_get: async (model, allfields, attributes) => {
    const models = {};
    models['res.partner'] = {
      id: { type: 'integer' },
      name: { type: 'char' },
      email: { type: 'char' },
      title: { type: 'many2one', relation: 'res.partner.title' },
      user_id: { type: 'many2one', relation: 'res.users' },
      company_id: { type: 'many2one', relation: 'res.company' },
      category_id: { type: 'many2many', relation: 'res.partner.category' },
    };

    models['res.partner.title'] = {
      name: { type: 'char' },
      shortcut: { type: 'char' },
    };

    models['res.users'] = {
      name: { type: 'char' },
      login: { type: 'char' },
    };

    models['res.partner.category'] = {
      name: { type: 'char' },
    };

    return models[model];
  },
};

const test = async done => {
  await test_login();
  // await test_init()
  await test_env();
  await test_get_fields2();
  await test_set();
  await test_look();
  await test_attr();
  done();
};

const test_login = async () => {
  const odoo = get_odoo();
  await odoo.login({ login: 'admin', password: '1232' });
  expect(odoo._rpc.sid).toEqual(null);
  const sid = await odoo.login({ login: 'admin', password: '123' });
  expect(sid).toEqual('sid_admin_123');
  expect(odoo._rpc.sid).toEqual('sid_admin_123');
  expect(ODOO.load(sid)).toEqual(odoo);

  await odoo.logout();
  expect(odoo._rpc.sid).toEqual(null);
  expect(ODOO.load(sid)).toEqual(undefined);
};

/*
cls.init()
cls新建时, cls._fields = null
cls.init() 会调用 fields_get 接口 给 cls._fields赋值
*/

const test_init = async () => {
  const odoo = await get_odoo();
  await odoo.login({ login: 'admin', password: '123' });
  const Partner = odoo.env('res.partner');
  console.log(Partner._fields);
  expect(Partner._fields).toEqual(null);
  await Partner.init();
  console.log(Partner._fields);
  expect(Partner._fields.name.type).toEqual('char');
};

/*
cls.env()
任何时候, 可以通过cls.env()取一个模型
如果cls初始化时的参数 env 中 没有 这个模型,
则通过cls.env获得的新模型 只有 name字段可用
*/

const test_env = async () => {
  const odoo = get_odoo();
  const cls = odoo.env('res.partner');
  const ref_cls = cls.env('product.product');
  expect(ref_cls._name).toEqual('product.product');
  expect(ref_cls.name).toEqual('product.product');
  expect(ref_cls._fields_raw).toEqual(['name']);
};

/*
cls._get_fields2(fields)
传入嵌套读取时用的参数 feilds = {name:null, m2o1: null, m2o2: {name}}
返回新格式 [name,m2o1,[m2o2,[name]]]

*/

const test_get_fields2 = async () => {
  const odoo = get_odoo();
  await odoo.login({ login: 'admin', password: '123' });
  const Partner = odoo.env('res.partner');

  const fields = {
    ref: null,
    title: { name: null },
  };

  await odoo.env('res.partner.title').init();

  const fields2 = await Partner._get_fields2(fields);
  console.log(fields2);

  expect(fields2).toEqual([
    'name',
    'email',
    ['title', ['name', 'shortcut']],
    'user_id',
    'company_id',
    'category_id',
  ]);
};

/*
    data = {}
    cls._set_one( data ,fields)
    data2 = [{},{}]
    cls._set_multi( data2,fields )

    将嵌套读取数据, 递归处理, 存储到 cls._records 里
*/

const test_set = async () => {
  const odoo = get_odoo();
  await odoo.login({ login: 'admin', password: '123' });

  // 必须 经过init(), 给 cls._feilds 赋值后, 才能 调用 _set_one() , _set_nulti()
  await odoo.env('res.partner').init();

  test_set_name(odoo);
};

const test_set_name = odoo => {
  const Partner = odoo.env('res.partner');
  console.log(Partner._records);
  expect(Partner._records).toEqual({});
  const data = { id: 1, name: 'ssss' };
  const id = Partner._set_one(data);
  console.log(Partner._records[id]);
  expect(Partner._records[id]).toEqual({ id: 1, name: 'ssss' });
};

const test_look = async () => {
  const odoo = get_odoo();
  await odoo.login({ login: 'admin', password: '123' });

  // 必须 经过init(), 给 cls._feilds 赋值后, 才能 调用 _set_one() , _set_nulti()
  await odoo.env('res.partner').init();
  await odoo.env('res.partner.title').init();
  await odoo.env('res.partner.category').init();
  await odoo.env('res.partner.category').init();

  test_look_for_many2one_not_null(odoo);
  test_look_for_many2one_is_null(odoo);
  test_look_for_many2many_not_null(odoo);
  test_look_for_many2many_is_null(odoo);
};

/*
ins.look(fields)
调用 cls._get_one(), cls._get_multi()
根据 参数 fields, 从cls._records中嵌套读取数据, 返回对象或数组
*/

const test_look_for_many2one_not_null = odoo => {
  const Partner = odoo.env('res.partner');

  Partner._records = {
    1: { id: 1, name: 'p1', email: null, title: 2 },
    2: { id: 2, name: 'p2', email: null, title: 2 },
  };

  const Title = odoo.env('res.partner.title');
  Title._records = {
    2: { id: 2, name: 'Doctor', shortcut: 'Dr' },
    6: { id: 6, name: 'Master', shortcut: 'Ms' },
  };

  //const p1 = Partner.view(1)
  const p1 = new Partner(1);
  const p1_data = p1.look({
    name: null,
    email: null,
    title: null,
  });
  console.log(p1_data);
  // 读取 m2o字段, 只返回m2o 的 name字段
  expect(p1_data).toEqual({
    id: 1,
    name: 'p1',
    email: null,
    title: { id: 2, name: 'Doctor' },
  });

  const p1_data2 = p1.look({
    name: null,
    email: null,
    title: { name: null, shortcut: null },
  });
  console.log(p1_data2);
  // 读取 m2o字段, 返回m2o 的 多个字段
  expect(p1_data2).toEqual({
    id: 1,
    name: 'p1',
    email: null,
    title: { id: 2, name: 'Doctor', shortcut: 'Dr' },
  });
};

const test_look_for_many2one_is_null = async odoo => {
  const Partner = odoo.env('res.partner');

  Partner._records = {
    1: { id: 1, name: 'p1', email: null, title: null },
  };
  const Title = odoo.env('res.partner.title');
  Title._records = {
    2: { id: 2, name: 'Doctor', shortcut: 'Dr' },
  };
  // await Partner.init();
  // await Title.init()
  const p1 = Partner.view(1);
  const fields = { name: null, email: null, title: null };
  const p1_data = p1.look(fields);
  console.log(p1_data);
  // 读取 m2o字段, 当 m2o为 null
  expect(p1_data).toEqual({ id: 1, name: 'p1', email: null, title: null });
  //expect(p1_data).toEqual({ id: 1, name: 'p1', email: null, title: {id: null, name:null} });

  const p1_data2 = p1.look({
    name: null,
    email: null,
    title: { name: null, shortcut: null },
  });
  console.log(p1_data2);
  // 读取 m2o字段, 当 m2o为 null, 返回m2o 的 多个字段
  expect(p1_data2).toEqual({ id: 1, name: 'p1', email: null, title: null });
  //expect(p1_data2).toEqual({ id: 1, name: 'p1', email: null, title: {id: null, name:null,shortcut: null} });
};

const test_look_for_many2many_not_null = odoo => {
  const Partner = odoo.env('res.partner');

  Partner._records = {
    1: { name: 'p1', email: null, category_id: [1, 2] },
  };
  const Category = odoo.env('res.partner.category');
  Category._records = {
    1: { name: 'c1' },
    2: { name: 'c2' },
  };
  const p1 = Partner.view(1);
  const p1_data = p1.look({
    name: null,
    email: null,
    category_id: null,
  });
  console.log(p1_data);

  // 读取 m2m字段, 只返回m2m 的 id 列表
  expect(p1_data).toEqual({
    id: 1,
    name: 'p1',
    email: null,
    category_id: [1, 2],
  });

  const p1_data2 = p1.look({
    name: null,
    email: null,
    category_id: { name: null },
  });
  console.log(p1_data2);
  console.log(p1._fields);
  // 读取 m2m字段, 返回m2m 的 具体内容
  expect(p1_data2).toEqual({
    id: 1,
    name: 'p1',
    email: null,
    category_id: [{ id: 1, name: 'c1' }, { id: 2, name: 'c2' }],
  });
};

const test_look_for_many2many_is_null = odoo => {
  const Partner = odoo.env('res.partner');

  Partner._records = {
    1: { name: 'p1', email: null, category_id: [] },
  };
  const Category = odoo.env('res.partner.category');
  Category._records = {
    1: { name: 'c1' },
    2: { name: 'c2' },
  };

  const p1 = Partner.view(1);
  const p1_data = p1.look({
    name: null,
    email: null,
    category_id: null,
  });
  console.log(p1_data);
  // 读取 m2m字段, 只返回m2m 的 id 列表
  expect(p1_data).toEqual({
    id: 1,
    name: 'p1',
    email: null,
    category_id: [],
  });

  const p1_data2 = p1.look({
    name: null,
    email: null,
    category_id: { name: null },
  });
  console.log(p1_data2);
  // 读取 m2m字段, 返回m2m 的 具体内容
  expect(p1_data2).toEqual({
    id: 1,
    name: 'p1',
    email: null,
    category_id: [],
  });
};

/*
ins.attr(attr)
读字段


*/

const test_attr = async () => {
  const odoo = get_odoo();
  const Partner = odoo.env('res.partner');
  await odoo._env['res.partner'].init();
  Partner._records = {
    1: { name: 'lucy', email: null },
  };
  const cls = Partner.view(1);
  console.log(Partner._records);
  const data = cls.attr('name');
  expect(data).toEqual('lucy');
};
