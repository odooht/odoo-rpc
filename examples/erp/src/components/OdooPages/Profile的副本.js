import odoo from '@/odoo'

import React from 'react';
import { Modal, Button, Form } from 'antd';

import OdooCard from './OdooCard'
import OdooForm from './OdooForm'

class List extends React.Component {
  state = {
      visible: false,
      record: {},
      formview: [],
      editview: [],
  }


  async componentDidMount() {
    console.log(this.props)
    const {model, id} = this.props
    const Model = await odoo.env(model)

    if (id){
      const records = Model.view(Number(id))
      const record = records.look()
      this.setState({ record  })
    }

    this.setState({ model  })
    const formview = Model.template('formview')
    const editview = Model.template('editview')

    this.setState({ formview, editview})

  }

  showModal = () => {
      this.setState({ visible: true });
  };

  handleCancel = () => {
      this.setState({ visible: false });
  }

  handleOk = () => {
    const { form: { validateFields } } = this.props;
    const { model } = this.state;

    validateFields( async  (err, values) => {
 //     if (!err) {
        const id = this.state.record.id
        const Model = await odoo.env(model)
        await Model.write(id, values)
        const records = Model.view(id)
        const record = records.look()
        this.setState({ record   })
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false  });
 //     }
    });
  }

  render() {
    const { form  } = this.props;
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
          <OdooForm record={record} form={form}  template={editview}/>
        </Modal>

      </div>
    );
  }
}

export default Form.create()(List);

