import ODOO from '@/odoo/odoo-rpc'


/*
const get_category = async (ptn)=>{
    const categs = await ptn.attr('category_id')
    const cs = []
    for( cid of categs){
        cs.push()
    }
}
*/

export default {
    namespace: 'contact',
    state: {
        contacts: null
    },

    effects:{
        *query({payload},{call,put,select}){
            const session_id = yield select(state => state.login.session_id);
            const odoo = ODOO.load(session_id);
            const Partner = odoo.env('res.users')
            const ptns = yield Partner.search([['id','<',7]])

            console.log(Partner._records)

            const contacts = yield ptns.look({
                    name:null,
                    company_id:{name:null,email:null},
                    category_id:{name:null}
            })

            yield put({
                type: 'save',
                payload: {contacts}
            })

        }
    },


    reducers: {
        save(state, { payload }) {
            return {...state, ...payload}
        },
    },
};
