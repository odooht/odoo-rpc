
class RPC {
    constructor (options) {
        const { host='/api', db, sid, uid } = options
        this.host = host
        this.db = db
        this.sid = null
        this.uid = null
    }


    async login(params){
        const {db, login, password} = params
        const url = `${this.host}/json/user/login`
        const data = {code:0, result:{sid:'sid1',uid:1}}

        const {code} = data
        if (!code){
            const {result:{sid, uid }} = data
            this.sid =  sid
            this.uid =  uid
        }
        return data
    }

    async call(params){
        if (!this.sid){
            return {code: 1, error: {message:'no sid'}}
        }

        const {model, method, args=[] , kwargs = {}} = params
        const url = `${this.host}/json/api?session_id=${this.sid}`
        const data = {
            code:0,
            result: this[method](...args)

        }
        const {code} = data
        if (!code){
            const {result} = data
        }

        return data
    }

    fields_get(allfields, attributes){
        return {
            id:{type:'integer'},
            name:{type:'char'},
            company_id:{type:'many2one', relation: 'res.company'},
            category_id:{type:'many2many', relation: 'res.partner.category'},
        }

    }


}



export default RPC
