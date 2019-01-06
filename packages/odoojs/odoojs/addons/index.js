import base from './base'
import bus from './bus'
import mail from './mail'
import sales_team from './sales_team'
import crm from './crm'
import project from './project'
import uom from './uom'
import product from './product'


export default {
    base,
    bus,
    mail,
    sales_team,
    crm,
    project,
    uom,
    product
}



/*

depends:

crm --> sales_team   --> base
    |
    --> mail --> bus --> base

project --> mail ...
        |
        --> resource


product --> mail ...
        |
        --> uom --> base


*/
