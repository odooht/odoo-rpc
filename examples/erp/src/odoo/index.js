
import ODOO from './odoojs'

const get_odoo = ()=>{
    const host = '/api'
    const db   ='TT'

    const {base} = ODOO.addons
    const modules = {base }

    const models = {
        'res.partner': [],
        'res.company': ['name','company_registry','user_ids'],
        'res.users': ['name','email','login','ref','company_id','partner_id'],
        //'uom.uom': ['name','uom_type','measure_type'],
    }

    const odoo = new ODOO({ host, db, modules, models })
    return odoo
}

const odoo = get_odoo()
console.log(odoo)
export default odoo

