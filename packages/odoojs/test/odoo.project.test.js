
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
        'uom.uom': ['name','uom_type','measure_type'],
        'project.project': [
            'name',
            'code',
            'date_start',
            'date',
            'tasks',
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
    test1()
    done()

}


const test1 = async (done) => {
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

