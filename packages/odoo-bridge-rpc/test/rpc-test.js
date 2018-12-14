import RPC from '../odoo-rpc/rpc'

let sid = null

describe('jsonrpc', () => {
  it('all ok', (done) => {
    test(done)

  });
});


const get_rpc = () => {
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    return new RPC({host, db})
}

const test = async (done) => {
    test_longpoll()
    done()
}

const test_login = async () => {
    const rpc = get_rpc()

    const login    ='1011'
    const password ='123'

    console.log('before login ', rpc)
    const data = await rpc.login({login, password})
    console.log('login ok',data)
    console.log('end', rpc)

    const data1 = await rpc.logout({})
    console.log('logout ',data1)
    console.log('end', rpc)

}

const test_call = async (done) => {
    const rpc = get_rpc()
    const login    ='admin'
    const password ='123'
    const d1 = await rpc.login({login, password})
    console.log('login end',d1, rpc)

    const model  ='res.partner'
    const method ='search_read'
    const args   = [ [], ['name'] ]
    const kwargs = {}
    const params = { model, method, args, kwargs }
    const data = await rpc.call(params)
    console.log('call end',data)
    done()
}

const test_longpoll = async () => {
    const rpc = get_rpc()
    const login    ='1011'
    const password ='123'
    const d1 = await rpc.login({login, password})
    console.log('login end',d1, rpc)



    const result = await poll( rpc)


}

const poll = async (rpc  ) => {
    let last = 0
    while(1)
    {
        console.log("last:",last)
        const result = await longpoll(rpc, last)
        //console.log(result)
        for ( const res of result ){
            //console.log(res)
            const {id, channel, message} = res
            console.log(id, channel)
            last = id
        }
    }
}

const longpoll = async (rpc, last =0 ) => {
    const channels  = []
    const params = { channels, last }
    console.log(rpc)
    console.log(rpc.longpoll)
    const data = await rpc.longpoll(params)
    const { code } = data
    if (!code) {
        const { result } = data
        return result
    }
    return []
}


