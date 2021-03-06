import modelCreator from './models'

const creator = (options) => {

    const Base = modelCreator(options)

    const { model } = options

    class cls extends Base {
    }

    Object.defineProperty(cls, 'name', { value: model, configurable: true })

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
        // TBD error save in class
        return []
    }

    cls.longpoll_stop = 0
    cls.longpoll_last = 0

    cls.stop_poll = () => {
        cls.longpoll_stop = 1
    }

    cls.before_poll = (odoo) => {
        return null
    }

    cls.after_poll = (odoo) => {
        return null
    }


    cls.start_poll = async (last=0 ) => {
        cls.longpoll_stop = 0
        cls.longpoll_last = last
        while(!cls.longpoll_stop ){
            cls.before_poll()
            const result = await cls.longpoll( cls.longpoll_last  )
            cls.after_poll(result )

            if(result.length){
                const {id} = result[result.length-1]
                cls.longpoll_last = id
                await cls._message_get(result )
            }
        }
    }

    cls._message_get = async (result)=>{
        for( const res of result){
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

        const MailChannel = await cls.env(model).init()
        const chn = await MailChannel.browse(channel_id)
        chn.message_get(message)
        return
    }

    return cls
}



export default creator

