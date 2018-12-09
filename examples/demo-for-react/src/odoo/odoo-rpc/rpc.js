
import fetch from 'dva/fetch';

const _fetch = (url, options, timeout) => {
            return Promise.race([
                fetch(url, options),
                new Promise(function (resolve, reject) {
                    setTimeout(() => reject(new Error('request timeout')), timeout);
                })
            ]);
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.name = response.status;
  error.data = response;
  throw error;
  return null
};

const checkJsonrpc = async (response,oid, options) => {
  const data = await response.json()
  const {id, jsonrpc} = data
  if( id === oid && jsonrpc === '2.0'){
    return data
  }
  const error = new Error('Error jsonrpc');
  error.name = 'Jsonrpc';
  error.data = {id:oid, options, data};
  throw error;
  return null
};

const checkOdooError = data => {
  const { result, error: error0} = data
  if( !error0 ){
    return result
  }

  const {code, message, data: data2} = error0
  const error = new Error(message);
  error.name = code;
  error.data = data2;
  throw error;
  return null
};

const DELAY_TIME = 10000 // ms

const jsonrpc = (url, params)=>{

  //console.log('jsonrpc=',url, params)

  const id = Math.round(Math.random() * 1000000000 )
  const options = {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: 2.0,
      id,
      method: 'call',
      params: params,
    }),
    //headers: new Headers({ 'Content-Type': 'application/json' })
    headers: { 'content-type': 'application/json' }

  };

  return _fetch( url, options , DELAY_TIME)
        .then( res => {
          //  console.log('1st',res)
            return checkStatus(res)
        } )
        .then( async (res) => {
         // console.log('after status',res )
          return checkJsonrpc(res, id, options )
        })
        .then( data => {
         // console.log( 'after jsonrpc', data)
          return checkOdooError(data)
        })
        .then( result => {
         // console.log( 'result ok', result)
          return { code: 0, result }

        })
        .catch(error => {
          return {
              code:1, error
          }
        })
}

class RPC {
    constructor( options ){
        const { host='/api', db, sid, uid } = options
        this.host = host
        this.db = db
        this.sid = null
        this.uid = null
    }

    async login(params){
        const {db, login, password} = params
        const url = `${this.host}/json/user/login`

        if(db){
            this.db = db
        }

        const data = await jsonrpc(url, { login, password, db:this.db , type: 'account' })
        const {code} = data
        if (!code){
            const {result:{sid, uid }} = data
            this.sid =  sid
            this.uid =  uid
        }
        else{
            this.sid = null
            this.uid = null
        }

        return data
    }

    async logout(){
        if (!this.sid){
            return {code: 1, error: {}}
        }

        const url = `${this.host}/web/session/destroy?session_id=${this.sid}`

        const data = await jsonrpc(url, {})
        const {code} = data
        if (!code){
            const {result} = data // TBD
            this.sid =  null
            this.uid =  null
        }

        this.sid =  null
        this.uid =  null

        return data
    }

    async call(params){
        if (!this.sid){
            return {code: 1, error: {message:'no sid'}}
        }

        const {model, method, args=[] , kwargs = {}} = params
        const url = `${this.host}/json/api?session_id=${this.sid}`
        const data = await jsonrpc(url, { model, method, args , kwargs })
        const {code} = data
        if (!code){
            const {result} = data
        }

        return data
    }

}

export default RPC
