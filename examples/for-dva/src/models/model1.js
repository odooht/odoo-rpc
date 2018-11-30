//import dvaOdoo from '@/odoo/dva-odoo';

import ODOO from '@/odoo/odoo-rpc'

const host = '/api'
const db = 'TT'
const models = {
        'res.users': ['name','partner_id','company_id','category_id'],
        'res.company': ['name','email'],
        'res.country': ['name' ],
}


export default {
    namespace: 'model1',
    state: {
        odoo: null
    },

    effects:{
        *login({payload},{call,put}){
            const odoo = new ODOO({host,db,models})
            yield put({
                type: 'save',
                payload: {odoo}
            })
            yield odoo.login({login:'admin', password:'123'})
            yield put({
                type: 'save',
                payload: {odoo}
            })

            const Partner = odoo.env('res.users')
            const ptns = yield Partner.search([])
            console.log(ptns)

            yield put({
                type: 'save',
                payload: {odoo}
            })
            console.log(odoo)

        }
    },


    reducers: {
        save(state, { payload }) {
            return {...state, ...payload}
        },
    },
};
