
import ODOO from '../odoojs/odoo'

describe('jsonrpc', () => {
    it('all ok', (done) => {
        test(done)

    });
});


const get_odoo = ()=>{
    const host = 'http://192.168.56.105:8069'
    const db   ='TT'

    const {sales_team, mail} = ODOO.addons

    const modules = {sales_team, mail} // {crm, projet }

    const models = {
        'res.partner': [],
       // 'res.partner': ['name', 'ref'],
       // 'res.users': ['name'],
        'crm.team': ['name'],
    }

    const odoo = new ODOO({ host, db, modules, models })
    return odoo
}
const test = async (done) => {
    test1()
    done()

}

const test0 = async () => {

    class ccc {}
    ccc.ids = 123

    class c2 extends ccc {}
    c2.a = 3

    console.log(ccc)
    console.log(c2)

}

const test1 = async (done) => {
    const odoo = get_odoo()
    console.log('odoo ok', odoo._env)
    console.log('odoo ok', odoo._env['res.partner']._fields_raw)

/*
    await odoo.login({login: 'admin', password: '123'})

    const Partner = odoo.env('res.partner')
    console.log('Partner 1', Partner)

    console.log('Partner 1', Partner._name)
    console.log('Partner 1', Partner._fields_raw)
    console.log('Partner 1', Partner._fields)
 //   console.log('Partner 1', Partner.env)

    //console.log('Partner 1', Partner.main_partner)

    const data = await Partner.init()
    console.log('Partner ok', Partner._fields)
    //console.log('Partner init: ', data)
    console.log('Partner ok', Partner)

    const main_partner = await Partner.main_partner()
    console.log('Partner ok', main_partner)

    const ps = await Partner.search([['id','<',6]],{name:0})
    console.log('Partner ok', ps.list())

    const p1 = ps.list()[0]

    console.log('Partner ok,p1', p1 )

    const p1addr = await p1.address_get()
    console.log('Partner ok', p1addr )


*/

}

/*
    const models = {
        'res.users': ['login','name','partner_id','company_id','category_id'],
        'res.partner': ['name','email','title','user_id','company_id','category_id','image'],
        'res.partner': [],
        'res.partner.title': ['name','shortcut'],
        'res.company': ['name','email'],
        'res.country': [],
        'crm.team': ['name' ],
        'crm.lead': ['name' ],
        'projet.projet': ['name' ],
        'projet.task': ['name' ],
    }

*/
