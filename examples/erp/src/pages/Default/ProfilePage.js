//import odoo from '@/odoo'

import React from 'react';
import { Profile } from '@/components/OdooPages'

class Page extends React.Component {
  state = {
      id: false,
  }

  componentWillMount() {
    const {location:{query:{id}}} = this.props
    if (id){
      this.setState({ id: Number(id)  })
    }
  }

  render() {
    const {id} = this.state
    return (
      <Profile model='res.partner' id ={id} >
      </Profile>
    );
  }
}

export default Page;

