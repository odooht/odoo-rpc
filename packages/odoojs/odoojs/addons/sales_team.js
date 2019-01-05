import base from './base'

export default  {
    name: 'sales_team',
    depends: {base},
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

