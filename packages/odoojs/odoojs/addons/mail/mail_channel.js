
const mail_channel_extend = (BaseClass) => {

    // TBD

    class cls extends BaseClass {
        async message_get(message) {
            const msgModel = await cls.env('mail.message').init()
            await msgModel.message_get(message)
            return
        }

        async message_post(params){
            const {subject,body} = params
            const message_type = 'comment'
            const subtype = 'mail.mt_comment'
            const kwargs = {subject, body, message_type, subtype}
            const data = await cls.call('message_post', [this._id], kwargs)
            return data
        }

    }


    cls.unread = []

    cls.message_get = async (channel_id,message)=>{
        const chn = await cls.browse(channel_id, {name:null, channel_type:null}, 1)
        const msgModel = cls.env('mail.message')
        const msg = msgModel.message_get(message)
        msg.setAttr('channel_id', chn)
        msg.setAttr('channel_type', chn.attr('channel_type'))
        cls.unread.push(msg)
        //console.log('chn, msg get', cls.unread)
    }

    cls.poll = async (channel_type)=>{
        // poll message by channel type
        const msg = cls._poll_by_type(channel_type)
        if(msg){
            return msg
        }
        for (let i=0; i<500; i++ ){
            setTimeout(function(){
                const msg = cls._poll_by_type(channel_type)
                if(msg){
                    return msg
                }
                return null
            }, 1000);
        }
        return null
    }


    cls._poll_by_type = (channel_type)=>{

        const index = cls.unread.findIndex( msg => {
            return msg.attr('channel_id').attr('channel_type') == channel_type
        })

        if (index >=0 ){
            return cls.unread.splice(index,1)[0]
        }
        return null
    }

    return cls
}


export default  {
    models: {
        'mail.channel': {
            fields: [
                'name','channel_type',
                // TBD
            ],


            extend: mail_channel_extend
        },

        'mail.channel.partner': {
            fields: ['partner_id']
        },

        'mail.moderation' :{
            fields: ['email','status','channel_id']
        }
    }
}

