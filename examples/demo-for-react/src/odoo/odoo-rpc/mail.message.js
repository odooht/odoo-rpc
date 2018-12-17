import modelCreator from './models'

const creator = (options) => {

    const Base = modelCreator(options)

    const { model } = options

    class cls extends Base {
    }

    Object.defineProperty(cls, 'name', { value: model, configurable: true })

    cls.notifications = {}

    cls.message_get = async (message ) => {
        console.log('mail:', message)
        const id = cls._set_one(message, {})
        const msg = cls.view(id)
        const subtype_id = msg.attr('subtype_id')._id
        const callback = cls.notifications[subtype_id]
        if (callback){
            await callback(id)
        }
        return
    }

    return cls
}



export default creator

