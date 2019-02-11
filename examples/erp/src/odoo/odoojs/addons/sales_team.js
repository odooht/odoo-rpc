
export default  {
    name: 'sales_team',
    depends: {},
    models: {
        'res.partner': {
            fields: ['team_id'],
        },

        'res.users': {
            fields: ['sale_team_id'],
        },

        'crm.team': {
            fields: [
                'name', 'active','company_id','currency_id',
                'user_id','member_ids','favorite_user_ids',
                'is_favorite','reply_to','color','team_type'
            ],
        },
    }
}

