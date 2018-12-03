import ODOO from '@/odoo/odoo-rpc'

const fields = {
    name:null,
    company_id:{name:null,email:null},
    category_id:{name:null}
}

const fields_ref = {
    company_id:{},
    category_id:{}
}

export default {
    namespace: 'contact',
    state: {
        contacts: []
    },

    effects:{
        *query({payload},{call,put,select}){
            const {id} = payload
            const session_id = yield select(state => state.login.session_id);
            const odoo = ODOO.load(session_id);
            const Partner = odoo.env('res.partner')
            const ptns = yield Partner.search([['id','>',id]], fields_ref)
            const contacts = ptns.look(fields)
            yield put({  type: 'save', payload: {contacts} })
        },

        *view({payload},{call,put,select}){
            const {id} = payload
            const session_id = yield select(state => state.login.session_id);
            const odoo = ODOO.load(session_id);
            const Partner = odoo.env('res.partner')
            const ptn = yield Partner.view(id)
            const contact = ptn.look(fields)
            yield put({ type: 'view2', payload: {contact} })
        },

        *create({payload},{call,put,select}){
            const session_id = yield select(state => state.login.session_id);
            const odoo = ODOO.load(session_id);
            const Partner = odoo.env('res.partner')
            const ptn = yield Partner.create(payload)
            const contact = ptn.look(fields)
            yield put({ type: 'add', payload: {contact} })
        },

        *write({payload},{call,put,select}){
            const {id,vals} = payload
            const session_id = yield select(state => state.login.session_id);
            const odoo = ODOO.load(session_id);
            const Partner = odoo.env('res.partner')
            const ptn = yield Partner.write(id,vals)
            const contact = ptn.look(fields)
            yield put({ type: 'view2', payload: {contact} })
        },

        *unlink({payload},{call,put,select}){
            const {id} = payload
            const session_id = yield select(state => state.login.session_id);
            const odoo = ODOO.load(session_id);
            const Partner = odoo.env('res.partner')
            const ptn = yield Partner.unlink(id)
            yield put({ type: 'del', payload: {id} })
        },
    },


    reducers: {
        save(state, { payload }) {
            return {...state, ...payload}
        },
        add(state, { payload }) {
            const {contacts} = state
            const {contact} = payload

            return {...state, contacts: [...contacts, contact ]}
        },
        view2(state, { payload }) {
            return {...state, ...payload}
        },
        del(state, { payload }) {
            const {id} = payload
            const {contacts} = state
            return {...state, contacts:contacts.filter(item=>item.id != id)}
        },
    },
};
