import modelCreator from '../odoo-rpc/models'

const creator = (options) => {
    const Base = modelCreator(options)
    const { model } = options
    class cls extends Base {
    }

    Object.defineProperty(cls, 'name', { value: model, configurable: true })


    return cls
}



export default creator

