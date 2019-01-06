

const account_account_extend = (BaseClass)=>{

    class cls extends BaseClass {
        mark_as_reconciled() {
            const data = this.call( 'mark_as_reconciled' )
            return data;
        }
    }

    return cls
}



export default  {
    models: {
        'account.account.type': {
            fields: [
                'name','include_initial_balance',
                'type','internal_group','note'
            ],
        },

        'account.account.tag': {
            fields: [
                'name','applicability','color','active'
            ]
        },

        'account.account' :{
            fields: [
                'name','currency_id','code','deprecated',
                'user_type_id','internal_type','internal_group',
                'last_time_entries_checked','reconcile',
                'tax_ids','note','company_id','tag_ids',
                'group_id','opening_debit','opening_credit'
            ],

            extend: account_account_extend

        },

        'account.group': {
            fields: [
                'parent_id','parent_path','name','code_prefix'
            ]
        },

        'account.journal': {
            fields: [
                'name','code','active','type',
                'type_control_ids','account_control_ids',
                'default_credit_account_id','default_debit_account_id',
                'update_posted','group_invoice_lines','sequence_id','refund_sequence_id',
                'sequence','sequence_number_next','refund_sequence_number_next',
                'currency_id','company_id','refund_sequence',
                'inbound_payment_method_ids','outbound_payment_method_ids',
                'at_least_one_inbound','at_least_one_outbound',
                'profit_account_id','loss_account_id','belongs_to_company',
                'company_partner_id','bank_account_id','bank_statements_source',
                'bank_acc_number','bank_id','post_at_bank_rec',
                'alias_id','alias_domain','alias_name'
            ]
        },

        'res.partner.bank': {
            fields: [ 'journal_id' ]
        },

        'account.tax.group': {
            fields: [ 'name','sequence' ]
        },

        'account.tax': {
            fields: [
                'name','type_tax_use','amount_type','active',
                'company_id','children_tax_ids','sequence','amount',
                'account_id','refund_account_id','description',
                'price_include','include_base_amount','analytic',
                'tag_ids','tax_group_id','hide_tax_exigibility','tax_exigibility',
                'cash_basis_account_id','cash_basis_base_account_id'
            ]
        },

    }
}

