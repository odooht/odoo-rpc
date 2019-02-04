const account_move_extend = (BaseClass)=>{

    class cls extends BaseClass {
        post() {
            const data = this.call( 'post' )
            return data;
        }
        action_post() {
            const data = this.call( 'action_post' )
            return data;
        }
        button_cancel() {
            const data = this.call( 'button_cancel' )
            return data;
        }
    }

    return cls
}


export default  {
    models: {
        'account.move': {
            fields: [
                'name',
                'ref',
                'date',
                'journal_id',
                'currency_id',
                'state',
                'line_ids',
                'partner_id',
                'amount',
                'narration',
                'company_id',
              //  'matched_percentage',
              //  'dummy_account_id',
              //  'tax_cash_basis_rec_id',
              //  'auto_reverse',
              //  'reverse_date',
              //  'reverse_entry_id',
              //  'tax_type_domain',
            ],

            extend: account_move_extend
        },

        'account.move.line': {
            fields: [
                'name',
                'quantity',
                'product_uom_id',
                'product_id',
                'debit',
                'credit',
              //  'balance',
              //  'debit_cash_basis',
              //  'credit_cash_basis',
              //  'balance_cash_basis',
              //  'amount_currency',
              //  'company_currency_id',
              //  'currency_id',
              //  'amount_residual',
              //  'amount_residual_currency',
              //  'tax_base_amount',
                'account_id',
                'move_id',
                'narration',
                'ref',
                'payment_id',
              //  'statement_line_id',
              //  'statement_id',
              //  'reconciled',
              //  'full_reconcile_id',
              //  'matched_debit_ids',
              //  'matched_credit_ids',
                'journal_id',
                'blocked',
              //  'date_maturity',
                'date',
                'analytic_line_ids',
              //  'tax_ids',
              //  'tax_line_id',
                'analytic_account_id',
                'analytic_tag_ids',
                'company_id',
              //  'counterpart',
                'invoice_id',
                'partner_id',
                'user_type_id',
              //  'tax_exigible',
              //  'parent_state',
              //  'recompute_tax_line',
              //  'tax_line_grouping_key',
            ],
        },

        'account.partial.reconcile': {
            fields: [
              //  'debit_move_id',
              //  'credit_move_id',
              //  'amount',
              //  'amount_currency',
              //  'currency_id',
              //  'company_currency_id',
              //  'company_id',
              //  'full_reconcile_id',
              //  'max_date',

            ],
        },

        'account.full.reconcile': {
            fields: [
                'name',
              //  'partial_reconcile_ids',
                'reconciled_line_ids',
                'amount_currency',
                'exchange_move_id',
            ],
        },

    }
}

