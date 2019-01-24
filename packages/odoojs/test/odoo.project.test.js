
import ODOO from '../odoojs'

describe('jsonrpc', () => {
    it('all ok', (done) => {
        test(done)

    });
});

import zop_project from '../odoo.addons.zop_project'


const get_odoo = ()=>{
    const host = 'http://192.168.56.103:8069'
    const db   ='T_project'

    const modules = {zop_project }

    const models = {
        'res.partner': ['name'],
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
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'admin', password: '123'})
    const Partner = odoo.env('res.partner')
    const ptn = await Partner.search([['id','=',15]] , {
        name:1,
        email:1,
        title: {name:0},
        category_id:{name:0},
    //    image:1,
        active:1,
        customer:1,
        state_id:0,
        create_date:1,
        comment: 1,
        type:1,

    })

    console.log('Partner ok', ptn.list())
    console.log('Partner:', Partner._records)
    console.log('Fields:', Partner._fields)
}


const test_pm = async (done) => {
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'admin', password: '123'})

    // 平台账号登录, 创建公司和公司管理员用户
    const comp_name = 't11'
    const comp = await pm_create_company_with_user(odoo,comp_name)

    // 平台账号登录, 使用公司管理员身份, 创建项目和项目管理员用户
    const prj_name = 'p1'
    const user_name = 'p1u1'
    const prj = await pm_create_project_with_user(odoo, comp, prj_name, user_name)

    // 公司管理员登录，设置时间维度

    // 项目管理员登录，使用公司管理员身份，设置时间维度----适用于 直接面向项目的情况

    // 项目管理员登录，维护项目组成员

    // 项目管理员登录，维护项目信息

    // 项目管理员登录，管理工程节点信息。

    // 项目管理员登录，分配工程管理员。

    // 工程管理员登录，查询自己的工程节点，录入当日工单

    // 工程管理员登录，提交当日工单

    // 项目有关人员，登录系统，使用项目管理员身份，查询项目，查询报表


/*
    await odoo.login({login: user_name + '@' + comp_name, password: '123'})

    await test_project(odoo)
    await test_dimdate(odoo)
    await test_worksheet(odoo)
    await test_workfact(odoo)
*/
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

const test_dimdate = async (odoo) => {
    const td = new Date(2019,0,1)
    console.log(td)
    for (var i=0; i<365; i++){
        var vals = getDimDate(td)
        const date = await find_or_create(odoo, 'olap.dim.date',
            [['date','=',vals.date]],
            vals
        )

        console.log(date)

        td.setDate(td.getDate() + 1)
    }
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

