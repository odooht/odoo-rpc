import product from '../product'
import analytic from '../analytic'

import account from './account'
import account_move from './account_move'
import account_invoice from './account_invoice'
//import account_payment from './account_payment'

export default  {
    name: 'account',
    depends: { product, analytic},
    models: {
        ...account.models,
        ...account_move.models,
        ...account_invoice.models,
        //...account_payment.models,
    }
}

