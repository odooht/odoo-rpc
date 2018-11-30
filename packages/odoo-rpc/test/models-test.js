//import Environment from '../src/env'
import models from '../src/models'
import RPC from '../src/rpc'


describe('jsonrpc', () => {
    it('all ok', (done) => {
    
        test_browse_multi(done)
        //test(done)

    });
});


const get_rpc = async () => {
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    const rpc = new RPC({host, db})
    const data = await rpc.login({login:'admin', password: '123'})
    //console.log(data)
    return rpc
}

const env = { }

const get_model =  ({ model,rpc, fields} ) => {
    let cls = env[model]
    if(cls){
        return cls
    }
    cls =  models({model, rpc , fields, env})
    env[model] = cls
    return cls
    
}


const test = async (done) => {
    done()
}

const test_browse_multi = async (done) => {
    //const env = new Environment()
    const rpc = await get_rpc()
    const fields = ['name','partner_id','company_id','category_id','werwer']
    console.log('1131313')
    get_model({model:'res.users', rpc , fields})
    const fields3 = ['name']
    get_model({model:'res.partner.category', rpc , fields:fields3 })
    
    const CTG = env['res.partner.category']
    console.log(CTG)

    const Users = env['res.users']
    
    console.log(Users)


    const users2 = await Users.search( [['id','<',9]])
    console.log(users2)
    
    const us2 = users2.list() 
    console.log( us2 )
    
    console.log( us2[1].attr('name') )
    const comp = await us2[1].attr('company_id',1) 
    
    console.log( comp )
    console.log( comp.attr('name') )
    console.log( comp.attr('email') )
    
    const usr6 = users2.byid(6)
    console.log( users2.byid(6) )
    
    const ctgs = await usr6.attr('category_id') 
    console.log( ctgs )

    const ctgs2 = await usr6.attr('category_id') 
    console.log( ctgs2 )

    
//    const ctg1 = ctgs.list()[0]
//    console.log( ctg1 )
    
//    console.log(ctg1.attr('name'))
    
/*    
    
    const ctg1 = await CTG.create({name:'sdasda'})
    console.log(ctg1)
    console.log(CTG)
    await ctg1.unlink()
    console.log(ctg1)
    console.log(CTG)

    const fields2 = ['name','email']
//    get_model({model:'res.company', rpc , fields:fields2 })
    const Comp = env['res.company']
    console.log(Comp)


    const users = await Users.search( [['id','>',30]])
    console.log(users)

 
*/
    done()
}



