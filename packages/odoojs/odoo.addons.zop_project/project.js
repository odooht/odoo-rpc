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

        'project.task': {
            fields: [
                'code',
                'full_name',
                'is_leaf',
                'uom_id',
                'qty',
                'price',
                'amount',
                'qty_acc',
                'amount_acc',
                'rate',
                'daywork_ids',
                'last_daywork_id',

            ]
        },

        'project.task.daywork': {
            fields: [
                'name',
                'full_name',
                'date',

                'project_id',
                'task_id',

                'uom_id',
                'price',

                'last_daywork_id',
                'qty',
                'qty_open',
                'qty_close',
            ]
        },

    }
}





