import modelCreator from './models'

const creator = (options) => {

    const Base = modelCreator(options)

    const { model } = options

    class cls extends Base {
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


    Object.defineProperty(cls, 'name', { value: model, configurable: true })


    return cls
}



export default creator

