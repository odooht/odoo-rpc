
import ODOO from './odoojs'

import zop_project from './odoo.addons.zop_project'

const get_odoo = ()=>{
    const host = '/api'
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

const odoo = get_odoo()
export default odoo

