import RPC from '../src/rpc'

let sid = null

describe('jsonrpc', () => {
  it('all ok', (done) => {
    test(done)
    //test_login(done);
    //test_call(done)

  });
});


const get_rpc = () => {
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    return new RPC({host, db})
}

const test = async (done) => {
    done()
}

const test_login = async (done) => {
    const rpc = get_rpc()

    const login    ='admin'
    const password ='123'

    console.log('before login ', rpc)
    const data = await rpc.login({login, password})
    console.log('login ok',data)
    console.log('end', rpc)

    const data1 = await rpc.logout({})
    console.log('logout ',data1)
    console.log('end', rpc)

    done()
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


