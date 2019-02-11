import odoo from '@/odoo'

import React from 'react';
import { List } from '@/components/OdooPages'

const model = 'res.partner'
const linePath ='/Contacts/Contact'
const domain = [['id','>',1]]

class Page extends React.Component {

  async initData(){
    const Model = odoo.env(model)
    const records = await Model.search( domain )
    const data = records.look2()
    return data
  }

  render() {
    return (
      <List
        model= {model}
        linePath = {linePath}
        ids = {null}
        domain = {null}
        data = {null}
        initData = {this.initData}
      >
      </List>
    );
  }
}

export default Page;

