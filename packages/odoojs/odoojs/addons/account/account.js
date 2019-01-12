
/*
account.py
account_incoterms.py
account_fiscal_year.py
company.py
product.py

*/


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
                'name',
                //'include_initial_balance',
                //'type',
                //'internal_group',
                //'note'
            ],
        },

        'account.account.tag': {
            fields: [
                'name',
                'applicability',
                //'color',
                //'active'
            ]
        },

        'account.account' :{
            fields: [
                'name',
                //'currency_id',
                'code',
                //'deprecated',
                //'user_type_id',
                //'internal_type',
                //'internal_group',
                //'last_time_entries_checked',
                //'reconcile',
                //'tax_ids',
                //'note',
                'company_id',
                //'tag_ids',
                //'group_id',
                //'opening_debit',
                //'opening_credit'
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
                'name',
                'code',
                //'active',
                'type',
                'type_control_ids',
                'account_control_ids',
                'default_credit_account_id',
                'default_debit_account_id',
                //'update_posted',
                //'group_invoice_lines',
                //'sequence_id',
                //'refund_sequence_id',
                //'sequence',
                //'sequence_number_next',
                //'refund_sequence_number_next',
                'currency_id',
                'company_id',
                //'refund_sequence',
                'inbound_payment_method_ids',
                'outbound_payment_method_ids',
                //'at_least_one_inbound',
                //'at_least_one_outbound',
                'profit_account_id',
                'loss_account_id',
                //'belongs_to_company',
                //'company_partner_id',
                'bank_account_id',
                //'bank_statements_source',
                'bank_acc_number',
                'bank_id',
                'post_at_bank_rec',
                //'alias_id',
                //'alias_domain',
                //'alias_name'
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
                'name',
                //'type_tax_use',
                //'amount_type',
                //'active',
                //'company_id',
                //'children_tax_ids',
                //'sequence',
                //'amount',
                //'account_id',
                //'refund_account_id',
                //'description',
                //'price_include',
                //'include_base_amount',
                //'analytic',
                //'tag_ids',
                //'tax_group_id',
                //'hide_tax_exigibility',
                //'tax_exigibility',
                //'cash_basis_account_id',
                //'cash_basis_base_account_id'
            ]
        },

        'account.incoterms': {
            fields: [
                'name',
                'code',
                //'active',
            ],
        },

        'account.fiscal.year': {
            fields: [
                'name','date_from','date_to','company_id'
            ],
        },

        'res.company': {
            fields: [
              //  'fiscalyear_last_day',
              //  'fiscalyear_last_month',
              //  'period_lock_date',
              //  'fiscalyear_lock_date',
              //  'transfer_account_id',
              //  'expects_chart_of_accounts',
              //  'chart_template_id',
              //  'bank_account_code_prefix',
              //  'cash_account_code_prefix',
              //  'transfer_account_code_prefix',
              //  'account_sale_tax_id',
              //  'account_purchase_tax_id',
              //  'tax_cash_basis_journal_id',
              //  'tax_calculation_rounding_method',
              //  'currency_exchange_journal_id',
              //  'income_currency_exchange_account_id',
              //  'expense_currency_exchange_account_id',
              //  'anglo_saxon_accounting',
              //  'property_stock_account_input_categ_id',
              //  'property_stock_account_output_categ_id',
              //  'property_stock_valuation_account_id',
              //  'bank_journal_ids',
              //  'overdue_msg',
              //  'tax_exigibility',
              //  'account_bank_reconciliation_start',
              //  'incoterm_id',
              //  'invoice_reference_type',
              //  'qr_code',
              //  'invoice_is_email',
              //  'invoice_is_print',


                'account_opening_move_id',
                // 'Opening Journal Entry',
                // "The journal entry containing the initial balance of all this company's accounts."

                'account_opening_journal_id',
                // 'Opening Journal',
                // "Journal where the opening entry of this company's accounting has been posted."

                'account_opening_date',
                // 'Opening Date',
                //"Date at which the opening entry of this company's accounting has been posted."

              //  'account_setup_bank_data_state',
              //  'account_setup_fy_data_state',
              //  'account_setup_coa_state',
              //  'account_onboarding_invoice_layout_state',
              //  'account_onboarding_sample_invoice_state',
              //  'account_onboarding_sale_tax_state',
              //  'account_invoice_onboarding_state',
              //  'account_dashboard_onboarding_state'
            ],
        },

        'product.category': {
            fields: [
              //  'property_account_income_categ_id',
              //  'property_account_expense_categ_id',
            ],
        },

        'product.template': {
            fields: [
              //  'taxes_id',
              //  'supplier_taxes_id',
              //  'property_account_income_id',
              //  'property_account_expense_id',
            ],
        },


    }
}

