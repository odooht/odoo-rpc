
const project_work_extend = (BaseClass) => {
    class cls extends BaseClass {
        async set_full_name() {
            const data = await this.call( 'set_full_name' )
            await this.browse()
            return data;
        }

        async set_amount() {
            const data = await this.call( 'set_amount' )
            await this.browse()
            return data;
        }
    }

    return cls
}


const project_worksheet_extend = (BaseClass) => {
    class cls extends BaseClass {
        async set_name() {
            const data = await this.call( 'set_name' )
            await this.browse()
            return data;
        }

        async post() {
            const data = await this.call( 'post' )
            await this.browse()
            return data;
        }
    }

    return cls
}


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
                'user_id',
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
            ],

            extend: project_work_extend
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
            ],

            extend: project_worksheet_extend
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
                'year',
                'quarter',
                'month',
                'week',
                'day',

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





