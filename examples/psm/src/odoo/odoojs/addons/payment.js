import account from './account'

// TBD
export default  {
    name: 'payment',
    depends: {account},
    models: {
        'res.partner': {
            fields: [],
        },

        'res.company': {
            fields: [],
        },
    }
}

