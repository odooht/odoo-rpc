import module_base from '../odoo.addons.base'

export default  {
    name: 'sales_team',
    depends: {'base':  module_base},
    models: {
        'res.partner': {
            fields: ['team_id'],
        },

        'res.users': {
            fields: ['sale_team_id'],
        },

        'crm.team': {
            fields: ['name', 'active'],
        },
    }
}

