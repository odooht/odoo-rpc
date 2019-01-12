
import ODOO from '../odoojs/odoo'

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
        'project.task': [
                'name',
                'code',
                'full_name',
                'notes',

                'parent_id',
                'child_ids',
                'is_leaf',
                'sequence',

                'daywork_ids',
                'tag_ids',

                'last_daywork_id',

                'date_start',
                'date_end',
                'date_assign',
                'date_deadline',
                'date_last_stage_update',

                'project_id',
                'user_id',  // task manager

                'partner_id',
                'manager_id',
                'company_id',

                'uom_id',
                'qty',
                'price',
                'amount',
                'qty_acc',
                'amount_acc',
                'rate',

        ],

        'project.task.daywork': [
                'name',
                'full_name',
                'date',

                'project_id',
                'task_id',

                'uom_id',
                'price',

                'last_daywork_id',
                'qty',
                'qty_open',
                'qty_close',
        ],
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
    console.log('project.task', odoo._env['project.task']._fields_raw)
    console.log('project.task.daywork', odoo._env['project.task.daywork']._fields_raw)

    const sid = await odoo.login({login: 'admin', password: '123'})

    console.log('sid: ', sid)


    const Partner = odoo.env('res.partner')
    const ps = await Partner.search([['id','<',6]],{name:0})
    console.log('Partner ok', ps.list())

    const Project = odoo.env('project.project')
    const prjs = await Project.search([], )

    const prj = prjs.list()[0]

    console.log('Prj ok', prj )

    console.log( 'prj name:',prj.attr('name') )

    console.log( 'prj name:', prj.attr('tasks') )

    const tasks = await prj.ref('tasks')
    console.log( tasks )

    const cust = await prj.ref('partner_id')
    console.log( cust )


/*




*/

}

