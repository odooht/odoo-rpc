import ODOO from '../src'


describe('jsonrpc', () => {
    it('all ok', (done) => {
        test1(done)
        //test(done)
    });
});

const test = async (done) => {
    done()
}

const test1 = async (done) => {

    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    const models = {
        'res.users': ['name','partner_id','company_id','category_id'],
        'res.company': ['name','email'],
        'res.country': ['name' ],
    }
    
    const odoo = new ODOO({ host, db, models })
    console.log(odoo._env)
    const ss = await odoo.login({login:'admin',password:'123'})
    
    await odoo.logout()
    
    await odoo.login({login:'admin',password:'123'})

    console.log(odoo._env)

    const Title = odoo.env('res.partner.title')
    console.log(Title)
    
    const title = await Title.search([]) 
    console.log( 'title', title)
    
    console.log ( title.list()[0].attr('name') )

    const Users = odoo.env('res.users')
    const CTG = odoo.env('res.partner.category')
    

    console.log(Users)
    console.log(CTG)

    const Comp = odoo.env('res.company')


    const users = await Users.search( [['id','>',30]])
    console.log(users)

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
    
    const ctg1 = ctgs.list()[0]
    console.log( ctg1 )
    
    console.log(ctg1.attr('name'))
 
    
    done()
}



