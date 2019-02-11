import odoo from '@/odoo'

import React from 'react';
import { Modal, Button //, Form
} from 'antd';

import OdooCard from './OdooCard'
import OdooForm from './OdooForm'

class List extends React.Component {
  state = {
      visible: false,
      record: {},
      formview: [],
      editview: [],
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

  async componentDidMount() {
//    console.log(this.props)
    const {model, id} = this.props
    const Model = odoo.env(model)

    if (id){
      const records = Model.view(Number(id))
      const record = records.look()
      this.setState({ record  })
    }

    this.setState({ model  })
    const formview = Model.template('formview')
    const editview = Model.template('editview')

    this.setState({ formview, editview})
    console.log(editview)

 //   const ref_data = await this.onMany2one(editview)



  }



  showModal = () => {
      this.setState({ visible: true });
  };

  handleCancel = () => {
      this.setState({ visible: false });
  }

  handleOk = () => {
    const {model} = this.state
    this.form.validateFields( async  (err, values) => {
      if (!err) {
        const id = this.state.record.id
        const Model = await odoo.env(model)
        await Model.write(id, values)
        const records = Model.view(id)
        const record = records.look()
        this.setState({ record   })
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false  });
      }
    });

  }

  onRef = (ref) => {
      this.form = ref.props.form
  }

  render() {
//    const { form  } = this.props;
    const { record, visible,formview, editview } = this.state;

    return (
      <div>
        <OdooCard
          record={record}
          template = {formview}
        />

        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Modal title="编辑"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <OdooForm
            onRef={this.onRef}
            record={record}
            template={editview}
            onMany2one={this.onMany2one}
          />
        </Modal>

      </div>
    );
  }
}

export default List

