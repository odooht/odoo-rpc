import odoo from '@/odoo'

import React from 'react';
import { /*Modal, Button,*/ Form } from 'antd';

//import OdooViews from '@/components/OdooViews'

//const OdooFormView = OdooViews.FormView
//const OdooEditView = OdooViews.EditView

class List extends React.Component {
  state = {
      visible: false,
      record: {},
      formview: [],
      editview: [],
  }


  async componentDidMount() {
    const {location:{query:{id}}} = this.props
    const Model = await odoo.env('res.users')

    if (id){
      const records = Model.view(Number(id))
      const record = records.look({company_id:{}})
      this.setState({ record  })
    }
    else{
      const me0 = await odoo.me({company_id:{}, partner_id:{} })
      if( me0.id ){
        const record = me0.look({company_id:{}, partner_id:{} })
        this.setState({ record })
      }
    }

    const formview = Model.template('formview')

const editview = [
  {
    label: '名称',
    field: 'name',
    type:  'char',
  },
  {
    label: '登录账号',
    field: 'login',
    type:  'char',
    rules: [{ required: true }],
  },
  {
    label: 'ref',
    field: 'ref',
    type:  'char',
  },

]

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

    validateFields( async  (err, values) => {
 //     if (!err) {
        const id = this.state.record.id
        const Model = await odoo.env('res.users')
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
//    const { form: { getFieldDecorator } } = this.props;
//    const { form  } = this.props;
//    const { record, visible,formview, editview } = this.state;

    return (
      <div>
      {/*

        <OdooFormView
          record={record}
          template = {formview}
        />

        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Modal title="编辑用户信息"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <OdooEditView record={record} form={form}  template={editview}/>
        </Modal>

      */}
      </div>
    );
  }
}

export default Form.create()(List);

