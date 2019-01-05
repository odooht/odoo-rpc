import xml2json from './xml2json'

const board_extend = (BaseClass) => {
    class cls extends BaseClass {
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
            const data = await this.call('get_random_call' )
            return data
        }

        async bid(pos,call){
            const data = await this.call('bid', [ pos, call])
            return data
        }

        async play(pos,card){
            const data = await this.call('play', [ pos, card])
            console.log(data)
        }

        async claim (pos,num) {
            const data = await this.call('claim', [ pos, num])
            console.log(data)
        }

        async claim_ack (pos, ack) {
            const data = await this.call('claim_ack', [ pos, ack])
            console.log(data)
        }
    }


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

export default  {
    models: {
        'og.board': {
            fields: [
                "table_id", "round_id", "phase_id", "game_id",
                "match_id", "host_id", "guest_id",
                "deal_id",
                "card_str",
                "name",
                "number", "sequence", "dealer", "vulnerable",
                "hands",
                "declarer", "contract", "openlead", "result",
                "ns_point", "ew_point",
                "cards",

                "call_ids",
                "auction",

                "state",

                "player",
                "tricks", "last_trick", "current_trick",
                "ns_win", "ew_win",
                "claimer", "claim_result",
                "host_imp", "guest_imp"
            ],

            extend: board_extend
        },

    }
}



