// Only For Debug

import fetch from 'dva/fetch';

const _fetch = (url, options, timeout) => {
  return Promise.race([
    fetch(url, options),
    new Promise(function(resolve, reject) {
      setTimeout(() => reject(new Error('request timeout')), timeout);
    }),
  ]);
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.name = response.status;
  error.data = response;
  throw error;
  return null;
};

const checkJsonrpc = async (response, oid, options) => {
  const data = await response.json();
  const { id, jsonrpc } = data;
  if (id === oid && jsonrpc === '2.0') {
    return data;
  }
  const error = new Error('Error jsonrpc');
  error.name = 'Jsonrpc';
  error.data = { id: oid, options, data };
  throw error;
  return null;
};

const checkOdooError = data => {
  const { result, error: error0 } = data;
  if (!error0) {
    return result;
  }

  const { code, message, data: data2 } = error0;
  const error = new Error(message);
  error.name = code;
  error.data = data2;
  throw error;
  return null;
};

const jsonrpc = (url, params, timeout = 120) => {
  //console.log('jsonrpc=',url, params)
  const id = Math.round(Math.random() * 1000000000);
  const options = {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: 2.0,
      id,
      method: 'call',
      params: params,
    }),
    //headers: new Headers({ 'Content-Type': 'application/json' })
    headers: { 'content-type': 'application/json' },
  };

  const myFetch = timeout == 0 ? fetch : _fetch;
  const args = timeout == 0 ? [url, options] : [url, options, timeout * 1000];

  return myFetch(...args)
    .then(res => {
      //  console.log('1st',res)
      return checkStatus(res);
    })
    .then(async res => {
      // console.log('after status',res )
      return checkJsonrpc(res, id, options);
    })
    .then(data => {
      // console.log( 'after jsonrpc', data)
      return checkOdooError(data);
    })
    .then(result => {
      // console.log( 'result ok', result)
      return { code: 0, result };
    })
    .catch(error => {
      return {
        code: 1,
        error,
      };
    });
};

class RPC {
  constructor(options) {
    const {
      host = '/api',
      db,
      sid = null,
      uid,
      timeout = 120,
      callbackerror // = () => false,
    } = options;
    this.host = host;
    this.db = db;
    this.timeout = timeout;
    this.sid = sid;
    this.uid = null;
    this.callbackerror = callbackerror || this._callbackerror;
  }

  _callbackerror(url, params, error) {
    console.log('rpc call error:', url, params, error);
  }
  async verifySid(sid) {
    //从localStorage取sid，向后台发送验证，
  }
  async json(url, params, timeout) {
    const timeout1 = timeout == undefined ? this.timeout : timeout;
    const data = await jsonrpc(url, params, timeout1);
    const { code, error } = data;
    //console.log(url, params, data)

    if (code) {
      console.log(url, params, error);
      this._callbackerror(url, params, error);
      //console.log(url, params, error)
    }
    return data;
  }

  async login(params) {
    const { db, login, password } = params;
    const url = `${this.host}/json/user/login`;

    if (db) {
      this.db = db;
    }

    const data = await this.json(url, {
      login,
      password,
      db: this.db,
      type: 'account',
    });

    const { code } = data;
    if (!code) {
      const {
        result: { status },
      } = data;
      if (status == 'ok') {
        const {
          result: { sid, uid },
        } = data;
        this.sid = sid;
        this.uid = uid;
      } else {
        this.sid = null;
        this.uid = null;
      }
    } else {
      this.sid = null;
      this.uid = null;
    }

    return data;
  }

  async logout() {
    if (!this.sid) {
      return { code: 1, error: {} };
    }
    const url = `${this.host}/web/session/destroy?session_id=${this.sid}`;
    const data = await this.json(url, {});
    const { code } = data;
    if (!code) {
      this.sid = null;
      this.uid = null;
    }

    this.sid = null;
    this.uid = null;

    return data;
  }

  async call(params) {
    //console.log('rpc call', params)
    const { model, method, args = [], kwargs = {} } = params;
    const url = `${this.host}/json/api?session_id=${this.sid}`;
    if (!this.sid) {
      //console.log('rpc call no sid:', params, this._callbackerror)

      this.callbackerror(url, params, { message: 'no sid' } );
      return { code: 1, error: { message: 'no sid' } };
    }
    const data = await this.json(url, { model, method, args, kwargs });
    const { code } = data;
    if (!code) {
      const { result } = data;
    }

    return data;
  }

  /*
    async longpoll(params) {
        if (!this.sid) {
            return { code: 1, error: { message: 'no sid' } }
        }
        const url = `${this.host}/longpolling/poll?session_id=${this.sid}`
        const data = await this.json(url, params, 0)
        const { code } = data
        if (!code) {
            const { result } = data
        }
        return data
    }
   */
}

export default RPC;
