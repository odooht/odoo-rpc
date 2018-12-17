import modelCreator from './models'

const creator = (options) => {

    const Base = modelCreator(options)

    const { model } = options

    class cls extends Base {
    }

    Object.defineProperty(cls, 'name', { value: model, configurable: true })

    cls.message_get = (message ) => {
        //console.log('mail:', message)
        const id = cls._set_one(message, {})
        const msg = cls.view(id)
        return msg
    }

    return cls
}



export default creator

