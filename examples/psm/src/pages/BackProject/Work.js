import odoo from '@/odoo'

import React from 'react';
import { Table, Modal, Button, Form, Input, InputNumber, Select } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

class List extends React.Component {
  state = {
      visible: false,
      record: {},
      usersList: [],
      projectsList: [],
      worksList: [],
      uomsList: [],

  }

  columns = [
    {
      title: '',
      dataIndex: '_',
      render: (_, { id }) => {
        return (
          <Button onClick={() => { this.showModal(); }}>编辑</Button>
        );
      },
    },

    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '类型',
      dataIndex: 'work_type',
    },
    {
      title: '数量',
      dataIndex: 'qty',
    },

    {
      title: '单位',
      dataIndex: 'uom_id.name',
    },
    {
      title: '单价',
      dataIndex: 'price',
    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
    {
      title: '用户',
      dataIndex: 'user_id.name',
    },
    {
      title: '父节点',
      dataIndex: 'parent_id.name',
    },
    {
      title: '项目',
      dataIndex: 'project_id.name',
    },

  ]

  async componentDidMount() {
    const {location:{query:{id}}} = this.props
    const Model = await odoo.env('project.work')

    if (! id){
      return
    }

    const records = Model.view(Number(id))
    const record = records.look()
    this.setState({ record })

    const [,adminid] = ( await odoo.ref('base.user_admin')  ) || [0,0]

    if (! adminid ){
      return
    }
    const User = await odoo.env('res.users')
    const users = await User.search([], {}, {order: 'name'})
    const usersList = users.look2()
    this.setState({ usersList  })

    const Project = await odoo.env('project.project')
    const projects = await Project.search([], {}, {order: 'name'})
    const projectsList = projects.look2()
    this.setState({ projectsList  })

    const Work = await odoo.env('project.work')
    const works = await Work.search([], {}, {order: 'name'})
    const worksList = works.look2()
    this.setState({ worksList  })

    const Uom = await odoo.env('uom.uom')
    const uoms = await Uom.search([], {}, {order: 'name'})
    const uomsList = uoms.look2()
    this.setState({ uomsList  })


  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = () => {
    const { form: { validateFields } } = this.props;

    validateFields( async  (err, values) => {
 //     if (!err) {
        const {
          id, name, code, work_type,
          user_id, parent_id, project_id,
          uom_id,
          qty, price,
        } = values
        const Model = await odoo.env('project.work')

        const vals = {
          name, code, work_type,
          user_id,
          parent_id,
          project_id,
          uom_id,
          qty, price,
          set_full_name:1,
          set_amount:1,

        }

        await Model.write(id, vals)
        const records = Model.view(id)
        const record = records.look()
        this.setState({ record })
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false  });
 //     }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { record, visible, usersList,projectsList, worksList, uomsList } = this.state;

    const records  = Object.keys(record).length ?  [record] : [];

    return (
      <div>
        <Table columns={this.columns} dataSource={records} rowKey="id" />
        <Button onClick={()=>this.showModal()}>编辑</Button>
        <Modal title="编辑信息"
          visible={visible}
          onOk={()=>this.handleOk()}
          onCancel={()=>this.handleCancel()}
        >
          <Form>
            <FormItem label="ID">
              {getFieldDecorator('id', {
                rules: [{ required: true }],
                initialValue: record.id
              })(
                <Input />
              )}
            </FormItem>

            <FormItem label="工程名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
                initialValue: record.name
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="工程编码">
              {getFieldDecorator('code', {
                rules: [{ required: true }],
                initialValue: record.code
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="节点类型">
              {getFieldDecorator('work_type', {
                rules: [{ required: true }],
                initialValue: record.work_type
              })(
                <Select placeholder="请选择节点类型">
                  <Option value="group">分组工程</Option>
                  <Option value="node">施工节点</Option>
                  <Option value="item">施工项目</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="工程技术员">
              {getFieldDecorator('user_id', {
                rules: [{ required: true }],
                initialValue: record.user_id ? record.user_id.id : ''
              })(
                <Select placeholder="请选择节点负责人">
                  {
                    usersList.map(user => {
                      return (
                        <Option value={user.id} key="id">{user.login}</Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>

            <FormItem label="项目">
              {getFieldDecorator('project_id', {
                rules: [{ required: true }],
                initialValue: record.project_id ? record.project_id.id : ''
              })(
                <Select placeholder="请选择所属项目">
                  {
                    projectsList.map(project => {
                      return (
                        <Option value={project.id} key="id">{project.name}</Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>

            <FormItem label="父节点">
              {getFieldDecorator('parent_id', {
                initialValue: record.parent_id ? record.parent_id.id : ''
              })(
                <Select placeholder="请选择父节点">
                  {
                    worksList.map(work => {
                      return (
                        <Option value={work.id} key="id">{work.full_name}</Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>

            <FormItem label="单位">
              {getFieldDecorator('uom_id', {
                rules: [{ required: true }],
                initialValue: record.uom_id ? record.uom_id.id : null
              })(
                <Select placeholder="请选择度量单位">
                  {
                    uomsList.map(uom => {
                      return (
                        <Option value={uom.id} key="id">{uom.name}</Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem label="数量">
              {getFieldDecorator('qty', {
                rules: [{ required: true }],
                initialValue: record.qty
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem label="单价">
              {getFieldDecorator('price', {
                rules: [{ required: true }],
                initialValue: record.price
              })(
                <InputNumber />
              )}
            </FormItem>


          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(List);

