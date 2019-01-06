import base from './base'
import bus from './bus'
import mail from './mail'
import sales_team from './sales_team'
import crm from './crm'
import project from './project'
import uom from './uom'


export default {
    base,
    bus,
    mail,
    sales_team,
    crm,
    project,
    uom
}



/*

depends:

crm --> sales_team   --> base
    |
    --> mail --> bus --> base

project --> mail ...
        |
        --> resource


uom --> base


*/
