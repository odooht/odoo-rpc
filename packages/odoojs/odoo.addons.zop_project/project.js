export default  {
    models: {
        'project.project': {
            fields: [
                'code',
                'constructor_id',
                'supervisor_id',
                'designer_id',
                'consultor_id',
            ]
        },

        'project.work': {
            fields: [
                'name',
                'code',
                'full_name',
                'work_type',
                'date_from',
                'date_thru',
                'project_id',
                'partner_id',
                'parent_id',
                'child_ids',
                'subwork_count',
                'uom_id',
                'qty',
                'price',
                'amount',
                'worksheet_ids',
            ]
        },

        'project.worksheet': {
            fields: [
                'code',
                'sequence',
                'number',
                'name',
                'full_name',
                'date',
                'project_id',
                'work_id',
                'uom_id',
                'price',
                'qty',
                'state',
            ]
        },

        'olap.dim.date': {
            fields: [
                'date',
                'daykey',
                'weekkey',
                'monthkey',
                'quarterkey',
                'year',
                'quarter',
                'month',
                'week',
                'day',
            ]
        },


        'project.workfact': {
            fields: [
                'name',
                'full_name',

                'date_id',
                'date_type',
                'date',

                'project_id',
                'work_id',
                'uom_id',
                'price',
                'work_type',
                'qty',
                'amount',

                'worksheet_ids',
                'last_workfact_id',
                'qty_delta',
                'qty_open',
                'qty_close',
                'amount_open',
                'amount_delta',
                'amount_close',
                'rate',
            ]
        },

    }
}





