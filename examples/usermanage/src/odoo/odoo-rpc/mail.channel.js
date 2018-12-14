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
    }

    Object.defineProperty(cls, 'name', { value: model, configurable: true })


    return cls
}



export default creator

