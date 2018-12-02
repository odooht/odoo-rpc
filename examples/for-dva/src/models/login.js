
import ODOO from '@/odoo/odoo-rpc'

const host = '/api'
const db = 'TT'
const models = {
        'res.partner': ['name', 'company_id','category_id'],
        'res.company': ['name','email'],
        'res.country': ['name' ],
}


export default {
    namespace: 'login',
    state: {
        session_id: null
    },

    effects:{
        *login({payload},{call,put}){
            const odoo = new ODOO({host,db,models})
            const session_id = yield odoo.login({login:'admin', password:'123'})
            yield put({
                type: 'save',
                payload: {session_id}
            })
        }
    },


    reducers: {
        save(state, { payload }) {
            return {...state, ...payload}
        },
    },
};
