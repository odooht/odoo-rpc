import base from './base'
import bus from './bus'
import mail from './mail'
import sales_team from './sales_team'
import crm from './crm'
import project from './project'
import uom from './uom'
import product from './product'
import analytic from './analytic'
import account from './account'
import payment from './payment'
import sale from './sale'


export default {
    base,
    bus,
    mail,
    sales_team,
    crm,
    project,
    uom,
    product,
    analytic,
    account,
    payment,
    sale
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

analytic --> mail ...
         |
         --> uom ...

account --> product ...
        |
        --> analytic ...

payment --> acount

sale ---> payment
      |
      --> sales_team

*/
