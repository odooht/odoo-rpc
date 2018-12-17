import modelCreator from '../odoo-rpc/models'
import xml2json from './xml2json'

const creator = (options) => {

    const Base = modelCreator(options)

    const { model } = options

    class cls extends Base {
        get_doing_board () {
            const instances = this.list().filter(
               ins => ins.attr('state') != 'done'
                   && ins.attr('state') != 'cancel'
            )

            if (instances.length == 0){
                return null
            }

            const ins = instances.sort( (a,b) => a.attr('number') - b.attr('number') )
            return ins[0]
        }

        async get_random_call(){
            const data = await cls.call('get_random_call', [ this._id])
            return data
        }
        async bid(pos,call){
            const data = await cls.call('bid', [ this._id, pos, call])
            return data
        }

        async play(pos,card){
            const data = await cls.call('play', [ this._id, pos, card])
            console.log(data)
        }

        async claim (pos,num) {
            const data = await cls.call('claim', [ this._id, pos, num])
            console.log(data)
        }

        async claim_ack (pos, ack) {
            const data = await cls.call('claim_ack', [ this._id, pos, ack])
            console.log(data)
        }
    }

    Object.defineProperty(cls, 'name', { value: model, configurable: true })

    cls.notifications = {}

    cls.poll = (message_id) => {
        return cls.message_get(message_id)
    }

    cls.message_get = (message_id) => {
        //console.log('notify=', message_id)
        const msg = cls.env('mail.message').view(message_id)
        const body =   msg.attr('body')
        const res = xml2json.toJSON(body);
        const boardJson = JSON.parse(res.content)
        const {id, method, args, info} = boardJson
        const id1 = cls._set_one(info)
        const board = cls.view(id1)
        //const callback = cls.notifications[method]
        //if(callback){
        //    callback (id, ...args,info)
        //}

        return {id, method, args, info, board}

    }

    return cls
}



export default creator

