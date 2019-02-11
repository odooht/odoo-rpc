//import odoo from '@/odoo'

import React from 'react';
import { List } from '@/components/OdooPages'

const linePath ='/Default/ProfilePage'

class Page extends React.Component {

  state = {
      model: null,
      ids: [],
  }

  componentWillMount() {
    const {location:{query:{model,ids}}} = this.props
    const nids = ids ? ids.split(',').map(id=>Number(id)) : []
    this.setState({ ids: nids,  model })

  }

  render() {

    const {model, ids} = this.state

    return (
      <List
        model= {model}
        linePath = {linePath}
        ids = {ids}
      >
      </List>
    );
  }
}

export default Page;

