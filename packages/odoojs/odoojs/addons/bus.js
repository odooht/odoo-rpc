
const bus_bus_extend = (BaseClass) => {

    class cls extends BaseClass {
    }

    cls.longpoll = async (last) => {
        const rpc = cls._rpc
        if (!rpc.sid){
            return {code: 1, error: {message:'no sid'}}
        }

        const params = {
            last,
            channels: []
        }

        const url = `${rpc.host}/longpolling/poll?session_id=${rpc.sid}`
        const data = await rpc.json(url, params, 0)
        const {code} = data
        if (!code){
            const {result} = data
            return result
        }
        return []
    }

    cls.longpoll_stop = 0
    cls.longpoll_last = 0

    cls.stop_poll = () => {
        cls.longpoll_stop = 1
    }

    /*

    cls.before_poll = () => {
        return null
    }

    cls.after_poll = (result) => {
        return null
    }

    */


    cls.start_poll = (before_poll,after_poll) => {
        cls.longpoll_stop = 0
        cls.longpoll_last = 0

        const _to_poll = async ()=>{
                const result = await cls.longpoll( cls.longpoll_last  )
                for( const res of result){
                    //console.log('bus:', res)
                    const {id, channel, message} = res
                    cls.longpoll_last = id
                    await cls.message_get(channel, message)
                }

                return result

        }

        setTimeout( async () => {
            while(!cls.longpoll_stop ){
                before_poll()
                const result = await _to_poll()
                after_poll(result )
            }

        }, 1);
    }

    cls.while_poll = async (before_poll,after_poll) => {
        //cls.before_poll = before_poll
        //cls.after_poll = after_poll

        cls.longpoll_stop = 0
        cls.longpoll_last = 0
        while(!cls.longpoll_stop ){
            before_poll()
            const result = await cls.longpoll( cls.longpoll_last  )

            for( const res of result){
                //console.log('bus:', res)
                const {id, channel, message} = res
                cls.longpoll_last = id
                await cls.message_get(channel, message)
            }
            after_poll(result )
        }
    }


    /*
    cls.while_poll2 = async(before_poll,after_poll) => {
            before_poll()
            const result = await cls.longpoll( cls.longpoll_last  )

            for( const res of result){
                //console.log('bus:', res)
                const {id, channel, message} = res
                cls.longpoll_last = id
                await cls.message_get(channel, message)
            }
            after_poll(result )
    }


    cls.start_poll2 = async (last=0 ) => {
        cls.longpoll_stop = 0
        cls.longpoll_last = last
        while(!cls.longpoll_stop ){
            cls.before_poll(cls)
            const result = await cls.longpoll( cls.longpoll_last  )
            cls.after_poll(cls, result )

            if(result.length){
                const {id} = result[result.length-1]
                cls.longpoll_last = id
                await cls._message_get(result )
            }
        }
    }
    */

    cls._message_get = async (result)=>{
        for( const res of result){
            console.log('bus:', res)
            const {channel, message} = res
            await cls.message_get(channel, message)
        }
    }

    cls.message_get = async (channel, message)=>{
        const [db, model, channel_id] = channel
        if (db!=cls._rpc.db  ){
            return
        }

        if (model != 'mail.channel' ){
            return
        }

        const MailChannel = cls.env(model)
        await MailChannel.message_get(channel_id, message)

        return
    }

    return cls

}

const res_partner_extend = (BaseClass)=>{
    class cls extends BaseClass {
    }

    cls.im_search = async (name, limit=20) => {
        const data = cls.call( 'im_search', [name, limit] )
        return data
    }

    return cls

}


export default  {
    name: 'bus',
    depends: {},
    models: {
        'bus.bus': {
            fields: ['channel','message'],
            extend: bus_bus_extend
        },

        'bus.presence': {
            fields: [
                'user_id','last_poll','last_presence','status'
            ],
        },

        'res.partner': {
            fields: ['im_status'],
            extend: res_partner_extend
        },
        'res.users': {
            fields: ['im_status'],
        },

    }
}

