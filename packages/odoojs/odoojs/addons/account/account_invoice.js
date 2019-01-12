

export default  {
    models: {
        'account.invoice': {
            fields: [
                'name',
                'origin',
                'type',
              //  'refund_invoice_id',
                'number',
                'move_name',
                'reference',
                'comment',
                'state',
              //  'sent',
                'date_invoice',
                'date_due',
                'partner_id',
              //  'vendor_bill_id',
              //  'payment_term_id',
                'date',
                'account_id',
                'invoice_line_ids',
              //  'tax_line_ids',
              //  'refund_invoice_ids',
                'move_id',
              //  'amount_by_group',
              //  'amount_untaxed',
              //  'amount_untaxed_signed',
              //  'amount_tax',
                'amount_total',
              //  'amount_total_signed',
              //  'amount_total_company_signed',
              //  'currency_id',
              //  'company_currency_id',
                'journal_id',
                'company_id',
                'reconciled',
                'partner_bank_id',
              //  'residual',
              //  'residual_signed',
              //  'residual_company_signed',
                'payment_ids',
                'payment_move_line_ids',
                'user_id',
                'fiscal_position_id',
              //  'commercial_partner_id',
              //  'outstanding_credits_debits_widget',
              //  'payments_widget',
              //  'has_outstanding',
                'cash_rounding_id',
              //  'sequence_number_next',
              //  'sequence_number_next_prefix',
              //  'incoterm_id',
              //  'source_email',
              //  'vendor_display_name',
              //  'invoice_icon',
            ],

            extend: false

        },

        'account.invoice.line': {
            fields: [
                'name',
                'origin',
                'sequence',
                'invoice_id',
                'uom_id',
                'product_id',
                'product_image',
                'account_id',
                'price_unit',
                'price_subtotal',
                'price_total',
                'price_subtotal_signed',
                'price_tax',
                'quantity',
                'discount',
                'invoice_line_tax_ids',
                'account_analytic_id',
                'analytic_tag_ids',
                'company_id',
                'partner_id',
                'currency_id',
                'company_currency_id',
                'is_rounding_line',
                'display_type',
            ],

            extend: false

        },

        'account.invoice.tax': {
            fields: [
                'invoice_id',
                'name',
                'tax_id',
                'account_id',
                'account_analytic_id',
                'analytic_tag_ids',
                'amount',
                'amount_rounding',
                'amount_total',
                'manual',
                'sequence',
                'company_id',
                'currency_id',
                'base',
            ],
        },

        'account.payment.term': {
            fields: [
                'name',
                'active',
                'note',
                'line_ids',
                'company_id',
                'sequence',
            ],
        },

        'account.payment.term': {
            fields: [
                'value',
                'value_amount',
                'days',
                'day_of_the_month',
                'option',
                'payment_id',
                'sequence',

            ],

        },

    }
}

