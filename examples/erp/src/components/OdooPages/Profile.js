import odoo from '@/odoo'

import React from 'react';

import OdooCard from './OdooCard'
import OdooForm from './OdooForm'

class List extends React.Component {
  state = {
      record: {},
      formview: [],
      editview: [],
      ref_data: {},
  }

  constructor(props) {
    super(props)
    this.handleOk= this.handleOk.bind(this);
  }

  async componentDidMount() {
//    console.log(this.props)
    const {model, id} = this.props
    const Model = odoo.env(model)

    if (id){
      const records = Model.view(Number(id))
      const record = records.look()
      this.setState({ record  })
    }

    const formview = Model.template('formview')
    const editview = Model.template('editview')

    this.setState({
      formview,
      editview: editview.reduce((acc, cur)=>{
        if(cur.type!=='many2many' && cur.type!=='one2many'){
          acc.push(cur)
        }

        return acc
      },[]),
    })


    const ref_data = await this.onMany2one(editview)
    this.setState({ ref_data });


  }

  handleOk = async ({type, values}) => {
    const {model } = this.props
    const Model = await odoo.env(model)

    console.log(type, values)
    const id = this.state.record.id

    if(type==='write'){
        await Model.write(id, values)
        const records = Model.view(id)
        const record = records.look()
        this.setState({ record   })
    }
    else if(type==='unlink') {
        await Model.unlink(id)
        const records = Model.view(id)
        const record = records.look()
        this.setState({ record   })
    }

  }


  async onMany2one(editview){
    console.log(editview)

    const ref_model = editview.reduce((acc,cur)=>{
      if(cur.type==='many2one'){
        acc[cur.relation] = 1
      }

      return acc
    },{})

    console.log(ref_model)

    return Object.keys(ref_model).reduce( async (accPromise,cur)=>{
      const acc = await accPromise;
      const recs = await odoo.env(cur).search([])
      acc[cur] = recs.look2()
      return acc
    },Promise.resolve({}))


  }


  render() {
    const {model } = this.props
    const { record, ref_data, formview, editview } = this.state;

    return (
      <div>
        <OdooForm
          visibleDelButton = ''
          buttom_name = '编辑'
          title = '编辑'
          record={record}
          template={editview}
          ref_data = {ref_data}
          onOk={this.handleOk}
        />

        <OdooCard
          record={record}
          template = {formview}
          model={model}
        />

      </div>
    );
  }
}

export default List

