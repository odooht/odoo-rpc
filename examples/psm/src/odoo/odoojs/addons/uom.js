
export default  {
    name: 'uom',
    depends: {},
    models: {
        'uom.category': {
            fields: ['name','measure_type'],
        },

        'uom.uom': {
            fields: [
                'name', 'category_id','factor','factor_inv',
                'rounding','active','uom_type','measure_type'
            ],
        },
    }
}

