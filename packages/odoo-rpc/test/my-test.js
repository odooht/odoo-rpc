
import ODOO from '../src'

describe('jsonrpc', () => {
    it('all ok', (done) => {
        test(done)

    });
});


class cls {
    constructor(ids){
        this.ids = ids
    }
}

const partner = {
    fields: [],
    ins_methods:{
        action_in: (cls, ins) => {
            console.log(cls, ins, ins.ids)
            const ain = async (name1)=>{
                console.log(cls, ins, ins.ids, name1)
                return name1 + 'ddddddddddd'
            }
            return ain
        }
    }
}

cls.prototype.action = function (){
    console.log(this, this.ids)
    return  partner.ins_methods.action_in(cls, this)(...arguments)
}

const test = async (done) => {
    const newcls = new cls(123)
    const n2 = await newcls.action('234234243')
    console.log(n2)
    done()
}

/*
       action_in2: async (name1)=>{
            console.log(this,this.ids, name1)
            return name1 + 'ddddddddddd'
       },
       action_in1: async function (name1){
            console.log(this,this.ids, name1)
            return name1 + 'ddddddddddd'
       },


    cls.prototype.action2 = function (){
        console.log(this, this.ids)
        return  partner.ins_methods.action_in.call(this,...arguments)(name2)

    }
    cls.prototype.action1 = function (){
        console.log(this, this.ids)
        return  partner.ins_methods.action_in.call(this,...arguments)

    }
*/
