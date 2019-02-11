import mail from './mail'
import uom from './uom'

export default  {
    name: 'analytic',
    depends: {mail,uom},

    models: {
        'account.analytic.distribution': {
            fields: [
                'account_id','percentage','name','tag_id'
            ],
        },

        'account.analytic.tag': {
            fields: [
                'name','color','active','active_analytic_distribution',
                'analytic_distribution_ids','company_id'
            ],
        },

        'account.analytic.group': {
            fields: [
                'name','description','parent_id','parent_path',
                'children_ids','complete_name','company_id'
            ],
        },

        'account.analytic.account': {
            fields: [
                'name','code','active','group_id',
                'line_ids','company_id','partner_id',
                'balance','debit','credit','currency_id'
            ],
        },

        'account.analytic.line': {
            fields: [
                'name','date','amount','unit_amount',
                'product_uom_id','account_id','partner_id',
                'user_id','tag_ids','company_id','currency_id',
                'group_id'
            ],
        },


    }
}

