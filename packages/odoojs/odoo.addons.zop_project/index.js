import ODOO from '../odoojs/odoo'

import project2 from './project'


const {project, uom} = ODOO.addons

export default  {
    name: 'zop_project',
    depends: {project, uom },
    models: {
        ...project2.models,
    }
}

