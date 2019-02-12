import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';

import OdooForm from '@/components/OdooPages/OdooForm'

import { Table, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
const { Description } = DescriptionList;

const linePath ='/Default/ProfilePage'

class Page extends React.Component {

  state = {
      record: {},
      treeview: [],
      editview: [],
  }

  constructor(props) {
    super(props)
    this.handleOk= this.handleOk.bind(this);

  }

  async componentDidMount() {
    const {location:{query:{model,id:oid,field}}} = this.props
    const id = Number(oid)
    const Model = odoo.env(model)
    const fields = {}
    fields[field] = 1
    const records = await Model.browse( id, fields )
    const data = records.look(fields)
    this.setState({ record: data})

    const child_meta = Model.fields(field)
    const Child_Model = odoo.env(child_meta.relation)

    const treeview = Child_Model.template('treeview')
    const editview = Child_Model.template('editview')

    const columns = [
      {
        title: '',
        dataIndex: '_',
        render: (_, { id }) => {
          return (
            <Link to={`${linePath}?id=${id}`} >查看</Link>
          );
        },
      },
    ]
    this.setState({
      editview: editview.reduce((acc, cur)=>{
        if(cur.type!=='many2many' && cur.type!=='one2many'){
          acc.push(cur)
        }

        return acc
      },[]),

      treeview: [...columns, ...treeview ]
    })

    const ref_data = await this.onMany2one( editview)
    this.setState({ ref_data });


  }

  async onMany2one(editview){
    const ref_model = editview.reduce((acc,cur)=>{
      if(cur.type==='many2one'){
        acc[cur.relation] = 1
      }

      return acc
    },{})

    return Object.keys(ref_model).reduce( async (accPromise,cur)=>{
      const acc = await accPromise;
      const recs = await odoo.env(cur).search([])
      acc[cur] = recs.look2()
      return acc
    },Promise.resolve({}))


  }

  handleOk = async ({type, values}) => {

    const {location:{query:{model,id:oid,field}}} = this.props
    const id = Number(oid)

    console.log(values)

    const Model = await odoo.env(model)

    if(type==='write'){
        const vals = {}
        vals[field] = [[ 0,0,values ]]
        await Model.write(id, vals )

        const fields = {}
        fields[field] = 1
        const records = await Model.browse( id, fields )
        const data = records.look(fields)
        this.setState({ record: data})
    }
  }

  render() {
    const { record, treeview, editview,ref_data } = this.state
    const {location:{query:{field}}} = this.props

    return (
      <div>
        <DescriptionList size="large" title='' style={{ marginBottom: 32 }}>
          <Description term='名称' >
                { record.name  }
          </Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title='' style={{ marginBottom: 32 }}>
          <Description term={field} >
          </Description>
          <OdooForm
            buttom_name = '新建'
            title = '新建'
            template={editview}
            ref_data = {ref_data}
            onOk={this.handleOk}
          />
          <Table columns={treeview} dataSource={record[field]} rowKey="id" />
        </DescriptionList>
      </div>
    );
  }
}

export default Page;

