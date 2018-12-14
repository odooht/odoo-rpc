
import ODOO from '../odoo-rpc'

import boardCreator from './og.board'

class Odoo extends ODOO {
    constructor(options){
        const creators = {
            'og.board': boardCreator ,
        }
        super({ ...options, creators  })
    }
}

export default Odoo
