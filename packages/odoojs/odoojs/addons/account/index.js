import product from '../product'
import analytic from '../analytic'

import account from './account'


export default  {
    name: 'mail',
    depends: { product, analytic},
    models: {
        ...account.models,
    }
}

