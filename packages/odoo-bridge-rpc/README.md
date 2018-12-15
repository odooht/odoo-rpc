# odoo-bridge-rpc

https://blog.csdn.net/waterring/article/details/76566340
xml2json


准备：
创建频道 1个

```
    odoo = new ODOO()
    odoo.login()
    
    //初始化  登录
    
    
    // 大回调函数
    const message_get(message_id){
        const msg = odoo.env('mail.message').view(message_id)
        console.log(msg.attr('subject'))

        if (msg.attr('subject') == 'og.table'){
            //  用户上线相关的东西
            console.log(msg.attr('subject'))
            console.log(msg.attr('body'))
        }
        
        else if (msg.attr('subject') == 'og.board'){
            //  关于一副牌的通知
            odoo.env('og.board').message_get(message_id)
        }
        
        else {
            console.log(msg.attr('subject'))
            console.log(msg.attr('body'))
        }
    }

    // board 回调函数1
    const notify_bid = async (id, pos, call, info ) => {
        console.log('notify=', id, pos, call,info)
        const board = odoo.env('og.board').view( id )
        console.log('notify=', board.attr('auction'))
    }

    // board 回调函数2
    // 回调函数
    const notify_play = async (id, pos, call, info ) => {
    }

    // board 回调函数3
    const notify_claim = async (id, pos, call, info ) => {
    }
    
    //长轮寻的初始化  大回调函数
    const subtype = await odoo.ref('mail.mt_comment')
    odoo.env('mail.message').notifications[subtype[1]] = message_get

    //长轮寻的初始化  board 小回调函数
    odoo.env('og.board').notifications = {
        bid: notify_bid,
        play: notify_play,
        claim: notify_claim,
    }


    // 查找 table channel  广播 我上线的通知
    og.table  Table_id
    og.channel message_post(body='sssssss', subject='og.table')
    

    // 查找 table board  刷新页面
    og.table   og.board
    该自己干活 干点活
    

    // 启动长轮询
    const Bus = odoo.env('bus.bus')
    Bus.start_poll()
    



```
