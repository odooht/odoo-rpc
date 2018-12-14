import modelCreator from '../odoo-rpc/models'

const creator = (options) => {
    const cls = modelCreator(options)

    return cls
}



export default creator

