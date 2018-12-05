# odoo-rpc

class RPC
* 构造时的参数 host, db
* 三个函数, login / logout / call
* login函数, 成功后, 将sid, uid 暂存
* call函数, 需要sid
* logout函数, 销毁sid
* 使用jsonrpc协议与odoo通信

* error类型
* 服务器超时
* 服务器状态码 不是2xx
* jsonrpc格式错, ------ 不知道如何测试 ---- 不知道什么情况下会发生
* odoo 服务回应error


function modelCreator
* 参数 model, fields, rpc, env
* model是模型名
* fields是该模型的字段, read方法时,需要该参数
* rpc是 RPC的一个实例, 一切CRUD方法都是通过rpc完成的
* env是odoo模型类库
* 动态创建odoo模型类, 都存放在env中,可通过模型名读取
* 一个类仅创建一次


class OdooModelClass
* 以下以cls指代OdooModelClass
* cls.name ;类名
* cls.\_name; 模型名
* cls.\_rpc = rpc ;
* cls.\_env = env ; odoo模型类库
* cls.\_fields\_raw ; 创建时传入的 fields, 缺省值是 [id,name]
* cls.\_feilds ; 初值为{id:{type:'integer'},name:{type:'char'}}
* cls.\_records; 所有数据存储的地方 
* cls.\_instances; 所有实例存储的地方
* cls.\_inited; 控制cls.init()仅调用一次
* cls.init(); 调用fields_get(),更新cls.\_feilds. 仅需要执行一次即可
* cls.env(model); 当访问 m2o,o2m,m2m字段时, 可以通过env函数获取对应的odoo模型类
* cls.call(method,args,kwargs) = rpc.call();异步; 对响应error结果做了处理
* cls.search(domain,fields);异步; 按条件查询, 返回 OdooModelClass的实例,含多条记录
* cls.bowse(id,fields);  异步;  按id或ids查找, 返回 OdooModelClass的实例,含一条或多条记录
* cls.search\_read(domain,fields);  异步, 等同于 search + look 
* cls.read(id,fields);  异步;  等同于 browse + look
* cls.create(vals); 异步;  创建, 返回 OdooModelClass的实例,含一条记录
* cls.write(id,vals); 异步; 编辑id或ids, 返回 OdooModelClass的实例
* cls.unlink(id); 异步; 删除, 返回 boolean
* cls.view(id); 不发送网络请求, 返回 OdooModelClass的实例,含一条记录

* OdooModelClass的实例
* 有两种, 仅含一条记录; 含多条记录
* 以下用 ins,ins1,ins2 指代OdooModelClass的实例
* ins2表示含多条记录的实例, 命名为: 多记录实例
* ins1表示仅含一条记录的实例, 命名为: 单记录实例
* ins2 = new OdooModelClass( ids ); 该方法禁止使用, 不对外开放
* ins1 = new OdooModelClass( id,vals); 该方法禁止使用, 不对外开放
* 请调用各种类方法, 以达到实例化的目的
* ins2.list(); 列表返回所有的 单记录实例
* ins2.view(id); 仅返回一条 单记录实例
* ins2.byid(id); 仅返回一条 单记录实例
* ins1.write(vals); 异步, 写
* ins1.unlink() ;  异步, 删除
* ins2.write(vals); TBD
* ins2.unlink();   TBD
* ins2.look(fields);  返回列表, 各元素为对象
* ins1.look(fields);  返回对象,对于m2o,o2m字段,以嵌套形式返回
* look方法,参数示例: fields = {name:null,m2o\_field:{name:null},o2m\_field:{name:null}}
* look方法,读取本地的值, 在调用look方法之前, 先调用 search 或 read
* ins1.attr(attr); 访问字段, 读取本地的值, 在调用 attr 方法之前, 先调用 search 或 read


class Odoo 
* 对外唯一的接口
* 参数 host, db, models
* db 可以不传, 可以在登录时传 db
* models 的作用是初始化所有的 odoo model
* odoo 中有些 model 的字段太多了, 如果缺省取所有的字段, 太多.
* odoo = Odoo({host,db,models}) 实例化Odoo
* odoo.\_rpc = new RPC(host,db);   RPC的一个实例
* odoo.\_env 存储所有的 odoo模型
* odoo.env(model) 获取一个odoo模型
* session\_id = odoo.login({db,login,password})  初始化时不传参数db, 在登录时必须传
* odoo.login() 返回 session id
* odoo = Odoo.load(session\_id) 类方法 根据session\_id 取odoo实例
* odoo.logout() 销毁 session id

