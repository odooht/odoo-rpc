import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';
import { Table } from 'antd';

import OdooForm from './OdooForm'

class OdooList extends React.Component {
  constructor(props) {
    super(props)
    this.handleOk= this.handleOk.bind(this);

    this.state = {
      ids: [],
      recordsList: [],
      editview: [],
      treeview: [],
      pathOfLine: '',
      ref_data: {},
    }
  }


  async initData(){
    const { model, ids, domain=[] } = this.props
    const Model = odoo.env(model)
    const records = ids ? await Model.browse( ids ) : await Model.search( domain )
    const data = records.look2()
    return data
  }


  async componentDidMount() {
    console.log('List Did')

    const { data, initData} = this.props
    let recordsList = []

    if ( data ){
      recordsList = data
    }

    else if ( initData ){
      recordsList = await initData()
    }
    else{
      recordsList = await this.initData()
    }

    const ids = recordsList.map( item => item.id )
    this.setState({ recordsList, ids  })

    const {model} = this.props
    const Model = odoo.env(model)
    const editview = Model.template('editview')
    const treeview = Model.template('treeview')
    const { linePath } = this.props
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

    const ref_data = await this.onMany2one(editview)
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
    const { model } = this.props
    const Model = await odoo.env(model)

    console.log(values)

    if(type==='write'){
        const new_rec = await Model.create(values)
        if(new_rec){
          //TBD
          const { ids } = this.state;
          this.setState({
            ids: [...ids, new_rec.id]
          });
        }
        const { ids } = this.state;

        const records = Model.view(ids)
        const data = records.look2()
        this.setState({ recordsList: data  })

    }
  }

  render() {
    const {
      recordsList,
      editview,
      treeview,
      ref_data,

    } = this.state;

    console.log('List render',editview )

    return (
      <div>
        <OdooForm
          buttom_name = '新建'
          title = '新建'
          template={editview}
          ref_data = {ref_data}
          onOk={this.handleOk}
        />

        <Table columns={treeview} dataSource={recordsList} rowKey="id" />
      </div>
    );
  }
}

export default OdooList;

