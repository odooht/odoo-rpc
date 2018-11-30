import json

import requests
def fetch(url, options):
    headers = options['headers']
    body = options['body']
    response = requests.post(url, data=body, headers= headers)
    # Error
    
    return json.loads(response.content)

def jsonrpc(url, params):
    options = {
        'method': 'POST',
        'body': json.dumps({
            'jsonrpc': 2.0,
            'id':      1,
            'method': 'call',
            'params': params,
        }),
        
        'headers': {"content-type": "application/json"  }
    }
    
    ret = fetch(url, options )
    
    # Error
    
    return ret
    

class RPC(object):
    def __init__(self, host='/api', db=None, sid=None, services=None ):
        """
        host = 'http://192.168.56.101:8069'
        services = {
            login: {url: '/json/user/login'},
            call:  {url: '/json/api'},
        }
        """
        
        self.host = host
        self.db = db and db or None
        self.sid = sid and sid or None
        self.services = services

        self.login = None
        self.password = None
        self.uid = None

        
    def _get_url(self,key, default_url):
        service = self.services.get(key, {} )
        url = serivce.get('url')
        url = url and url or default_url
        url += self.host + url
        if self.sid:
            url += '?session_id=' + self.sid
        return url
    
    
    def login(self, login, password, db=None):
        url = self._get_url('login', '/json/user/login')
        db = db and db or self.db
        data = jsonrpc({ 'login':login, 'password': password, 'db':db })
        result = data.get('result')
        if result:
            self.db = db
            self.login = login
            self.password = password
            self.sid = result['sid']
            self.uid = result['uid']
        
        return data
        
    def call(self, model, method, args=None, kwargs=None):
        if not self.sid:
            return {'error': {'code':1, 'message':'no login' } }
        
        args = args and args or []
        kwargs = kwargs and kwargs or {}
        url = self._get_url('call', '/json/api')
        return jsonrpc({ 'model':model, 'method':method, 'args': args ,'kwargs':kwargs })
    
    
if __name__ == '__main__':
    
    host = 'http://192.168.56.105:8069'
    db       ='TT'
    login    ='admin'
    password ='123'
    
    rpc = RPC(host=host)
    ret = rpc.login(login, password, db)
    print ret

    rpc = RPC(host=host, db=db)
    ret = rpc.login(login, password)
    print ret
    
    model = 'res.partner'
    method = 'search_read'
    domain = [['id','>',1]]
    fields = ['name']
    
    ret = rpc.call(model, method, [domain, fields] )
    
    print ret


"""
{
  error: {
    code: 200,
    data:{
      debug: 'Traceback (most recent call last):\n  File "/opt/odoo/server/odoo/http.py", line 653, in _handle_exception\n    return super(JsonRequest, self)._handle_exception(exception)\n  File "/opt/odoo/server/odoo/http.py", line 310, in _handle_exception\n    raise pycompat.reraise(type(exception), exception, sys.exc_info()[2])\n  File "/opt/odoo/server/odoo/tools/pycompat.py", line 87, in reraise\n    raise value\n  File "/opt/odoo/server/odoo/http.py", line 695, in dispatch\n    result = self._call_function(**self.params)\n  File "/opt/odoo/server/odoo/http.py", line 342, in _call_function\n    return checked_call(self.db, *args, **kwargs)\n  File "/opt/odoo/server/odoo/service/model.py", line 97, in wrapper\n    return f(dbname, *args, **kwargs)\n  File "/opt/odoo/server/odoo/http.py", line 335, in checked_call\n    result = self.endpoint(*a, **kw)\n  File "/opt/odoo/server/odoo/http.py", line 939, in __call__\n    return self.method(*args, **kw)\n  File "/opt/odoo/server/odoo/http.py", line 518, in response_wrap\n    response = f(*args, **kw)\nTypeError: login() missing 1 required positional argument: \'type\'\n',
      name: 'builtins.TypeError',
      exception_type: 'internal_error',
      arguments: [Array],
      message: 'login() missing 1 required positional argument: \'type\'' 
    },
         
    message: 'Odoo Server Error' 
  },
  jsonrpc: '2.0',
  id: 1 
}

  
         
{
  error: {
    code: 404,
    http_status: 404,
    message: '404: Not Found' 
         
    data:{
      debug: 'Traceback (most recent call last):\n  File "/opt/odoo/server/odoo/http.py", line 653, in _handle_exception\n    return super(JsonRequest, self)._handle_exception(exception)\n  File "/opt/odoo/server/odoo/http.py", line 310, in _handle_exception\n    raise pycompat.reraise(type(exception), exception, sys.exc_info()[2])\n  File "/opt/odoo/server/odoo/tools/pycompat.py", line 87, in reraise\n    raise value\n  File "/opt/odoo/server/odoo/addons/base/ir/ir_http.py", line 190, in _dispatch\n    rule, arguments = cls._find_handler(return_rule=True)\n  File "/opt/odoo/server/odoo/addons/base/ir/ir_http.py", line 84, in _find_handler\n    return cls.routing_map().bind_to_environ(request.httprequest.environ).match(return_rule=return_rule)\n  File "/usr/local/lib/python3.5/dist-packages/werkzeug/routing.py", line 1563, in match\n    raise NotFound()\nwerkzeug.exceptions.NotFound: 404: Not Found\n',
      name: 'werkzeug.exceptions.NotFound',
      exception_type: 'internal_error',
      arguments: [],
      message: '404: Not Found' 
    },
         
  },
  jsonrpc: '2.0',
  id: 1 
}


{
  result:{
         sid: '09677929104ed3967d6164d0f57d16a97e91a72e',
         status: 'ok',
         currentAuthority: 'admin',
         name: '1name',
         uid: 1,
         type: 'account' 
        },
  jsonrpc: '2.0',
  id: 1 
}


{
  result: {
     currentAuthority: 'guest', type: 'account', status: 'error' 
  },
  jsonrpc: '2.0',
  id: 1 
}

"""

