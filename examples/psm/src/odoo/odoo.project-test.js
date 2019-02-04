
import ODOO from '../odoojs'

import zop_project from '../odoo.addons.zop_project'

describe('jsonrpc', () => {
    it('all ok', (done) => {
        test(done)

    });
});


const get_odoo = ()=>{
    const host = 'http://192.168.56.103:8069'
    const db   ='T_project'

    const modules = {zop_project }

    const models = {
        'res.partner': [],
        'res.company': ['name','company_registry','user_id','user_ids'],
        'res.users': ['name','email','login','company_id','partner_id'],
        'uom.uom': ['name','uom_type','measure_type'],
        'project.project': [
            'name',
            'code',
            'date_start',
            'date',
            'user_id',
            'partner_id',
            'company_id',
                'constructor_id',
                'supervisor_id',
                'designer_id',
                'consultor_id',

        ],
        'project.work': [],
        'project.worksheet': [],
        'olap.dim.date': [],
        'project.workfact': [],
    }

    const odoo = new ODOO({ host, db, modules, models })
    return odoo
}

const test = async (done) => {
    await test1()
//    await test_pm()
    done()

}

const test1 = async () => {


    class A  {
        get bb(){
            return 1233
        }
    }

//    add(2,3,4,5,6)
    const a = new A()
    console.log( a.bb )
}


const test_pm = async (done) => {
    // 建立服务链接
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'admin', password: '123'})

    // 平台账号登录, 创建公司和公司管理员用户
    // 参数：
    //    公司名称
    //    公司管理员账号名称（用邮箱，以后加邮箱验证），
    //    初始密码随机生成
    //    联系方式--手机号，手机下发密码
    //    公司名称全局唯一，账号用邮箱，一个邮箱只能创建一个公司
    // 流程：1创建公司；2创建用户；3设定该用户管理该公司；4生成随机密码；5短信下发密码

    // 重置密码功能
    const comp_name = 't11'
    const comp = await pm_create_company_with_user(odoo,comp_name)

    await odoo.logout()
    await odoo.login({login: 'admin@' + comp_name, password: '123'})

    // 公司管理员登录, 创建项目和项目管理员用户，以后不能用手机号登录。
    // 需要参数：项目名称，项目管理员用户名称，初始密码
    //     管理员的手机号
    // 项目名称，公司内唯一。
    // 流程：2创建项目；4创建用户；5分配用户管理该项目
    const prj_name = 'p1'
    const user_name = 'p1u1'
    const prj = await pm_create_project_with_user(odoo, comp, prj_name, user_name)

    // 公司管理员登录，设置报表规则
    // 每类报表的起止时间。
    // 如果修改，以上报的不做调整。后续生成的报表使用新规则。
    // 公司下定义一个model，记录年季月周的起止时间
    // 据此，生成时间维度表的数据记录
    await pm_create_dimdate(odoo)

    await odoo.logout()
    await odoo.login({login: user_name + '@' + comp_name, password: '123'})

    // 项目管理员登录，维护完善项目信息，可以后台登录
    // 参数：项目的具体信息
    // 流程：1查找自己管理的项目；2更新项目项目信息，//3项目报表抄送人员名单
    await pm_update_project(odoo )

    // 项目管理员登录，录入风险源信息
    // 项目下定义一个model，记录项目的风险源泉
    // 与node类型的工程节点是 多对多

    // 项目管理员登录，维护项目组成员
    // 项目中有个字段，m2m 对应项目组成员
    await pm_create_user(odoo )

    // 项目管理员登录，管理工程节点信息。
    // 参数：工程名称，度量单位，数量，价格，父工程，工程类型，起止里程
    //   node 有施工示意图
    // 流程：1查找自己的项目，2创建工程
    await pm_create_work(odoo )

    // 项目管理员登录，创建匿名用户，供查询项目报表用
    await pm_create_user(odoo )

    // 项目管理员登录，分配工程管理员。
    // 参数：工程，项目成员信息
    // 流程：1查找自己的项目，2查找待分配的工程，3查找用户，4分配该用户管理该工程
    await pm_update_work_user(odoo )

    await odoo.logout()
    await odoo.login({login: user_name + '@' + comp_name, password: '123'})

    // 工程管理员登录，查询自己的工程节点，录入当日工单，只有工程管理员才能更新数据
    // 参数：日期，数量，序号
    // 流程：1查找自己管理的工程，2创建工单
    await pm_create_worksheet(odoo )

    // 工程管理员登录，提交当日工单
    // 参数：
    // 流程：1查找自己管理的工程，2查找当日最新的所有工单，3提交工单
    await pm_post_worksheet(odoo )

    await odoo.logout()
    await odoo.login({login: user_name + '@' + comp_name, password: '123'})

    // 项目有关人员，登录系统，使用身份，查询项目，查询报表
    // 流程：1 以
    await test_workfact(odoo)

    await odoo.logout()

}

const pm_create_company_with_user = async (odoo,comp_name) => {
    /*
    使用 admin 账户登录，创建一个公司，创建一个用户
    将该用户设为这个公司的管理员
    */

    const Comp = odoo.env('res.company')
    const admin_name = 'admin@'+comp_name

    let comp = await Comp.search([['company_registry','=',comp_name]])
    console.log(comp)
    console.log(Comp._records)

    if (comp.len()){
        return comp
    }

    comp = await Comp.create_with_user(
        {name:'铁'+comp_name,company_registry:comp_name},
        {name:admin_name, login:admin_name,email:admin_name,password:'123'}
    )

    console.log(comp)
    return comp

}

const pm_create_project_with_user = async (odoo, comp0, prj_name, user_name) => {
    /*
    平台管理员登录，使用公司管理员账号, 创建一个项目，及项目的管理员
    */

    const comp = comp0.look({user_id:1, user_ids: {id:1,name:1}})
    console.log(comp)

    const comp_code = comp.company_registry
    const sudo_uid = comp.user_id.id

    const User = odoo.env('res.users').sudo(sudo_uid)

    const name = user_name + '@' + comp_code
    const email = user_name + '@' + comp_code
    const login = user_name + '@' + comp_code
    const password = '123'

    let user = await User.search([['login','=',login]])

    console.log(user)

    if(user.len()==0){
        user = await User.create({ name, login, email, password})
    }

    console.log(user.look() )

    const Prj = odoo.env('project.project').sudo(sudo_uid)
    let prj = await Prj.search([['code','=',prj_name]])
    console.log(prj)

    console.log(Prj._records, Prj._fields)

    console.log(prj.look())

    if(prj.len()==0){
        prj = await Prj.create({
            code:prj_name,
            name:'项目' + prj_name,
            user_id: user.look().id })
    }

    console.log(prj)
    console.log(prj.look2())
    return prj

}

const pm_create_dimdate = async (odoo, sudo) => {
    const td = new Date(2019,0,1)
    console.log(td)

    const get_uid = async ()=>{
        const me = await odoo.me({company_id:{user_id:1}})
        console.log(me.look({company_id:{user_id:1}}))
        return me.attr('company_id').attr('user_id').attr('id')
    }

    const DimDate = sudo
          ? odoo.env('olap.dim.date').sudo( await get_uid())
          : odoo.env('olap.dim.date')

    for (var i=0; i<365; i++){
        var vals = getDimDate(td)

        let date = await DimDate.search([['date','=',vals.date]])
        if(date.len()==0){
            date = await DimDate.create(vals)
        }

        console.log(date)

        td.setDate(td.getDate() + 1)
    }

}

const pm_create_user = async (odoo, user_name) => {
    /*
    新公司的用户登录，
    创建自己公司的用户
    */

    const me = await odoo.me({company_id:{}})
    const me1 = me.look({login:0,company_id:{name:0, company_registry:0}} )

    const comp_code = me1.company_id.company_registry
    console.log(comp_code)

    const User = odoo.env('res.users')

    const name = user_name + '@' + comp_code
    const email = user_name + '@' + comp_code
    const login = user_name + '@' + comp_code
    const password = '123'

    const user = await User.create({ name, login, email, password})
    console.log(user )

}

const getDimDate = (td)=>{
    const year = td.getFullYear()
    const month= td.getMonth()+1
    const day =  td.getDate()
    const week=  getYearWeek(td) - 1
    const quarter = Math.ceil(month / 3)

    return {
        date: year + '-' + month + '-' + day,
        year,
        quarter,
        month,
        day,
        week,
        quarterkey: year*100 + quarter,
        monthkey:   year*100 + month,
        daykey:     year*10000 + month*100 + day,
        weekkey:    year*100 + week,
    }
}

function getYearWeek(date){
	var date2=new Date(date.getFullYear(), 0, 1);
	var day1=date.getDay();
	if(day1==0) day1=7;
	var day2=date2.getDay();
	if(day2==0) day2=7;
	const d = Math.round((date.getTime() - date2.getTime()+(day2-day1)*(24*60*60*1000)) / 86400000);
	return Math.ceil(d /7)+1;
}

const test_project = async (odoo) => {
    const prj = await find_or_create(odoo, 'project.project',
        [['code','=','1']],
        {code:'1', name:'项目1'}
    )

    console.log(prj)
    const prj_id = prj.attr('id')

    const work1 = await find_or_create( odoo, 'project.work',
        [['code','=','1'],['project_id','=', prj_id]],
        {code:'1', name:'车站', project_id: prj_id}
    )
    console.log(work1)
    await work1.write({set_full_name:1})
    const work1_id = work1.attr('id')

    const work2 = await find_or_create( odoo, 'project.work',
        [['code','=','1.1'],['project_id','=', prj_id]],
        {code:'1.1', name:'车站附属',parent_id: work1_id, project_id: prj_id}
    )
    console.log(work2)
    await work2.write({set_full_name:1})
    const work2_id = work2.attr('id')

    const length_uom = await search_one( odoo, 'uom.uom',
        [['name','=','m'],['measure_type','=','length']]
    )
    console.log(length_uom)

    const work3 = await find_or_create( odoo, 'project.work',
        [['code','=','1.1.1'],['project_id','=', prj_id]],
        {
            code:'1.1.1',
            name:'1号风井',
            work_type:'node',
            parent_id: work2_id,
            project_id: prj_id,
            uom_id: length_uom.attr('id'),
            price: 1200,
            qty: 30
        }
    )
    console.log(work3)
    await work3.write({set_full_name:1})
    const work3_id = work3.attr('id')

    const unit_uom = await search_one( odoo, 'uom.uom',
        [['name','=','Unit(s)'],['measure_type','=','unit']]
    )

    const weight_uom = await search_one( odoo, 'uom.uom',
        [['name','=','kg'],['measure_type','=','weight']]
    )

    const volume_uom = await search_one( odoo, 'uom.uom',
        [['name','=','Liter(s)'],['measure_type','=','volume']]
    )

    console.log(unit_uom.look({name:0}))
    console.log(weight_uom.look({name:0}))
    console.log(volume_uom.look({name:0}))

    const work41 = await find_or_create( odoo, 'project.work',
        [['code','=','1.1.1.1'],['project_id','=', prj_id]],
        {
            code:'1.1.1.1',
            name:'挖土方',
            work_type:'item',
            parent_id: work3_id,
            project_id: prj_id,
            uom_id: volume_uom.attr('id'),
            price: 2,
            qty: 100002
        }
    )
    console.log(work41)
    await work41.set_full_name()

    const work42 = await find_or_create( odoo, 'project.work',
        [['code','=','1.1.1.2'],['project_id','=', prj_id]],
        {
            code:'1.1.1.2',
            name:'立拱架',
            work_type:'item',
            parent_id: work3_id,
            project_id: prj_id,
            uom_id: unit_uom.attr('id'),
            price: 100.02,
            qty: 100
        }
    )
    console.log(work42)
    await work42.set_full_name()

    const work43 = await find_or_create( odoo, 'project.work',
        [['code','=','1.1.1.3'],['project_id','=', prj_id]],
        {
            code:'1.1.1.3',
            name:'喷砼',
            work_type:'item',
            parent_id: work3_id,
            project_id: prj_id,
            uom_id: weight_uom.attr('id'),
            price: 8.98,
            qty: 10000
        }
    )
    console.log(work43)
    await work43.set_full_name()
    await work43.set_amount()

/*
*/

}


const test_worksheet = async (odoo) => {
    const prj = await search_one( odoo, 'project.project',
        [['code','=','1']]
    )
    const prj_id = prj.attr('id')

    const work = await search_one( odoo, 'project.work',
//        [['code','=','1.1.1'],['project_id','=', prj_id]]
        [['code','=','1.1.1'],['project_id.code','=', 't12.1']]
    )

    console.log(work.look({name:1}))

    const work_id = work.attr('id')

    const worksheet = await find_or_create( odoo, 'project.worksheet',
        [['work_id','=', work_id],['date','=','2019-1-1'],['number','=',1]],
        { work_id, date: '2019-1-1', number: 1, qty: 2.3 }
    )
    console.log(worksheet)
    await worksheet.set_name()
    await worksheet.post()
    console.log(worksheet.attr('state'))


}

const test_workfact = async (odoo) => {
    const Model = odoo.env('project.workfact')
    const facts = await Model.search([])
    const fact_list = facts.look({
        date:0,
        full_name:0,
        amount_open:0,
        amount_delta: 0,
        amount_close: 0
    })
    console.log(fact_list)

}


const search_one = async (odoo,model,domain) => {
    const Model = odoo.env(model)
    let ins = await Model.search(domain)
    if(ins.list().length){
        return ins.list()[0]
    }
    return null
}


const find_or_create = async (odoo,model,domain,vals) => {
    const Model = odoo.env(model)
    let ins = await Model.search(domain)
    if(ins.list().length){
        return ins.list()[0]
    }
    ins = await Model.create(vals)
    return ins
}


const test_sudo = async () => {
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'user1@t12', password: '123'})

    const Comp = odoo.env('res.company')
    const comps = await Comp.search([])
    console.log(comps.list()[0].look({name:1,user_id:1}))

}


const test_sudo1 = async () => {
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'admin', password: '123'})


    const Partner = odoo.env('res.users')

    console.log('old.flds raw=', Partner._fields_raw)
    console.log('old.flds =', Partner._fields)
    console.log('old.metadata =', Partner._metadata)
    console.log('old.records =', Partner._records)
    console.log('old.sudo =', Partner._sudo)
    console.log('old.search =', Partner.search)
    console.log('old.main_partner =', Partner.main_partner)
    await Partner.search([])

    console.log('old1.flds raw=', Partner._fields_raw)
    console.log('old1.flds =', Partner._fields)
    console.log('old1.metadata =', Partner._metadata)
    console.log('old1.records =', Partner._records)
    console.log('old1.sudo =', Partner._sudo)
    console.log('old.search =', Partner.search)
    console.log('old1.main_partner =', Partner.main_partner)
    console.log('old1.clsname =', Partner.name)
    console.log('old1.name =', Partner._name)

    const NewPtn = Partner.sudo(14)
    console.log('new:0')
    await NewPtn.search([])
    console.log('new.flds raw=', NewPtn._fields_raw)
    console.log('new.flds =', NewPtn._fields)
    console.log('new.metadata =', NewPtn._metadata)
    console.log('new.records =', NewPtn._records)
    console.log('new.search =', NewPtn.search)
    console.log('new.main_partner =', NewPtn.main_partner)
    console.log('new.clsname =', NewPtn.name)
    console.log('new.name =', NewPtn._name)
    console.log('new.sudo =', NewPtn._sudo)

    console.log('old1.flds =', Partner._fields)
    console.log('old1.metadata =', Partner._metadata)
    console.log('old1.records =', Partner._records)
    console.log('old1.sudo =', Partner._sudo)

}

