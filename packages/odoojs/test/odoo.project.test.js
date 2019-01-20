
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
        'res.company': ['name','company_registry'],
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
//    await test_company()
//    await test_user()
//    await test_project()
//    await test_dimdate()

    await test_worksheet()
    await test_workfact()
    done()

}

const test_company = async () => {
    const odoo = get_odoo()

    const sid = await odoo.login({login: 'admin', password: '123'})
    const Comp = odoo.env('res.company')
    const com = await Comp.create_with_user(
        {name:'铁13局',company_registry:'t13'},
        {name:'admin@t13', login:'admin@t13',email:'admin@t13',password:'123'}
    )

    console.log(com)
    await odoo.logout()

}
const test_user = async () => {
    const odoo = get_odoo()
    await odoo.login({login: 'admin@t13', password: '123'})
    const me = await odoo.me({company_id:{}})
    const me1 = me.look({login:0,company_id:{name:0, company_registry:0}} )

    const comp_code = me1.company_id.company_registry
    console.log(comp_code)

    const User = odoo.env('res.users')

    const name = 'user2' + '@' + comp_code
    const email = 'user2' + '@' + comp_code
    const login = 'user2' + '@' + comp_code
    const password = '123'

    const user = await User.create({ name, login, email, password})
    console.log(user )
    await odoo.logout()

}

const test_dimdate = async () => {
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'user2@t13', password: '123'})

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

const test_project = async () => {
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'user2@t13', password: '123'})

    const prj = await find_or_create(odoo, 'project.project',
        [['code','=','t13.1']],
        {code:'t13.1', name:'t13-项目1'}
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

}


const test_worksheet = async () => {
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'user2@t13', password: '123'})

    const prj = await search_one( odoo, 'project.project',
        [['code','=','t13.1']]
    )
    const prj_id = prj.attr('id')

    const work = await search_one( odoo, 'project.work',
//        [['code','=','1.1.1'],['project_id','=', prj_id]]
        [['code','=','1.1.1'],['project_id.code','=', 't13.1']]
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

const test_workfact = async () => {
    const odoo = get_odoo()
    const sid = await odoo.login({login: 'user2@t13', password: '123'})

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
    return ins
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



const test1 = async () => {
    const odoo = get_odoo()
    console.log('odoo ok', odoo._env)
    console.log('project.project', odoo._env['project.project']._fields_raw)

    const sid = await odoo.login({login: 'admin', password: '123'})

    console.log('sid: ', sid)


    const Partner = odoo.env('res.partner')
    const ps = await Partner.search([['id','<',6]],{name:0})
    console.log('Partner ok', ps.list())


    const Workfact = odoo.env('project.workfact')
    const wfs = await Workfact.search([], )
    console.log('wf ok', wfs )


}

