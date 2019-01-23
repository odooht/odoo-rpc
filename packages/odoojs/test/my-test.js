
//import ODOO from '../odoojs'

describe('jsonrpc', () => {
    it('all ok', (done) => {
        test(done)

    });
});

class P {}
P.p = ()=>{}



class C extends P {}
C.c = () => {}


const test = (done){

    const p = Object.keys(P)
    const c = Object.keys(C)

    console.log('p:', p)
    console.log('c:', c)

    done()
}


/*
class cls {
    constructor(id){
        this._id = id
    }

    attr(attr){
        return Model._records.name
    }


}

Modle.browse = (ids,fields) => {
    data = this.call(sid, this.sudo, cls._name,'read',[ids,fields])
    Model._records = data
    return new PartnerModel.Model(data.id)
}


Model._name = 'res.partner'
Model._records = {}

class clsENV {
    constructor(){
        this.sudo = null
    }

    sudo(user){
        this.sudo = user
        return new clsENV()
    }

    browse (ids,fields){
        return new clsENV.Model.browse(ids,fields)
    }

}

clsENV._name = 'res.partner'
clsENV.Model = Partner


class ODOO {
    constructor(){
        this._env = {
            'Partner': new PartnerENV()
        }
    }
    env(model){
        return this._env[model]
    }

}


const res_partner_extend = (BaseClass) => {
    class Model extends BaseClass.Model {
        async address_get() {
            const data = this.call( 'address_get' )
            // cls._records = ??
            //this.setattr('address_fields', data)
            return data;
        }

        async update_address(vals) {
            const data = this.call( 'update_address', [vals] )
            return this.address_get();
        }

        async create_company() {
            const data = this.call( 'create_company', [] )
            return await this.browse({ parent_id: 0, child_ids: 0 })
        }

    }

    class cls extends BaseClass {
        async main_partner () {
            const data = await this.call( 'main_partner', [] )
            return data
        }

        async find_or_create (email){
            const data = await this.call( 'find_or_create', [email] )
            return await this.browse(data)
        }

    }

    return cls
}

const Base =  {
    name: 'base',
    depends: {},
    models: {

        'res.partner': {
            fields: [
                'name',
            ],

            extend: res_partner_extend
        },



    }
}


const test = ()=>{
    odoo = new ODOO()
    const Partner = odoo.env('Partner')
    const partner = Partner.browse(1,['name'])
    const name = partner.attr('name')
}

*/






