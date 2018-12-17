
import ODOO from '../src'

describe('jsonrpc', () => {
    it('all ok', (done) => {
        test(done)

    });
});



const get_odoo = ()=>{
    const host = 'http://192.168.56.105:8069'
    const db       ='TT'
    const models = {
        'res.users': ['login','name','partner_id','company_id','category_id','channel_ids'],
        'bus.bus': ['name'],
        'mail.channel': ['name','uuid','channel_partner_ids','channel_type','channel_message_ids'],
        'mail.message': ['subject','body','subtype_id','message_type','author_id','date','channel_ids'],
    }

    const odoo = new ODOO({ host, db, models })

    return odoo
}

const test = async (done) => {
    await test_longpoll(done)
 //   done()

}

const test_longpoll = async () =>{
    const odoo = get_odoo()
    await odoo.login({login:'1011',password:'123'})

    const  fields = {
        name:0,
        channel_ids:{name:0, uuid:0, channel_partner_ids:0, channel_type:0}
    }

    const me = await odoo.me(fields)
//    const me = await odoo.env('res.users').browse(uid, fields)

    //找到一个聊天的频道
    const chn = me.attr('channel_ids').list()[1]

    chn.message_post({
        subject: 'Hello',
        body: `user login:${me.attr('id')}`
    })

    const Bus = odoo.env('bus.bus')

    const send_message =(chn,subject, body)=>{
            chn.message_post({ subject, body })
    }

    const rcv_message = async () =>{
            const Chn = odoo.env('mail.channel')
            let msg = null
            do{
                msg = await Chn.poll('channel')
                console.log(new Date(), msg)
                if(msg){
                    const mm = msg.look({
                        body:null, channel_ids: {channel_type:null}
                    })
                    console.log(mm)
                }
            }while(msg)
    }


    let ii = 1
    const before_poll = async () => {
            //console.log('before 0')
            send_message(chn, 'Hello', `user ii:${ii}`)
            ii += 1
    }

    const after_poll = async (result) => {
            //console.log('after:', result)
            rcv_message()

    }

    Bus.start_poll(before_poll,after_poll)
//    await Bus.while_poll(before_poll, after_poll)




  //  done()


}

