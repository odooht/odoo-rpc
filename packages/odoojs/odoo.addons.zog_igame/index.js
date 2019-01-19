import ODOO from '../odoojs'

import game from './game'
import table from './table'
import board from './board'


const {base, mail} = ODOO.addons

export default  {
    name: 'zog_iagme',
    depends: {base, mail },
    models: {
        ...game.models,
        ...table.models,
        ...board.models,
    }
}

