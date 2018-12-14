import ODOO from './odoo-rpc'

const host = '/api'
const db = 'TT'
const models = {
        'res.partner': ['name', 'company_id', 'category_id', 'parent_id', 'email', 'data',
                'create_data', 'phone', 'state_id', 'child_ids', 'image_small'],
        'res.company': ['name', 'email'],
        'res.country': ['name'],
}

const odoo = new ODOO({ host, db, models })

export default odoo


