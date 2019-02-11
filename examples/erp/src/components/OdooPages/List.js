import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';
import { Table, Modal, Button } from 'antd';

import OdooForm from './OdooForm'

class OdooList extends React.Component {
  state = {
      model: null,
      visible: false,
      ids: [],
      recordsList: [],
      editview: [],
      treeview: [],
      pathOfLine: ''
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

  componentWillMount() {
    const {model} = this.props
    this.setState({ model })
    this.initTemplate()
  }

  initTemplate(){
    const {model} = this.state
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

    this.setState({ editview, treeview: [...columns, ...treeview ]})

  }


  async initData(){
    const { ids, domain=[] } = this.props

    const {model} = this.state
    const Model = odoo.env(model)
    const records = ids ? await Model.browse( ids ) : await Model.search( domain )
    const data = records.look2()
    return data
  }

  async initData2(){
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

    this.initTemplate()
  }

  componentDidMount() {
    this.initData2()
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false, });
  }

  handleOk = () => {
    const { model } = this.state;

    this.form.validateFields( async  (err, values) => {

      if (!err) {
        const Model = await odoo.env(model)
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

        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
      }
    });
  }

  onRef = (ref) => {
      this.form = ref.props.form
  }

  render() {
    const { visible,recordsList, editview, treeview } = this.state;
    return (
      <div>
        {
          [1].map( (item,index )=>{
            return (<div key={index}>123123</div>)
          } )
        }


        <Table columns={treeview} dataSource={recordsList} rowKey="id" />
        <Button onClick={this.showModal}>新建</Button>
        <Modal title="新建"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <OdooForm onRef={this.onRef} template={editview}
            onMany2one={this.onMany2one}

           />
        </Modal>
      </div>
    );
  }
}

export default OdooList;

