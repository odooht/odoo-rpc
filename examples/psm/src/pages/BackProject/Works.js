import odoo from '@/odoo'

import React from 'react';
import Link from 'umi/link';
import { Table, Modal, Button, Form, Input, InputNumber,Select } from 'antd';
import FormItemLayout from '@/layouts/FormItemLayout';

const FormItem = Form.Item;
const { Option } = Select;


class List extends React.Component {
  state = {
      visible: false,
      ids: [],
      recordsList: [],
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
          <Link to={`/BackProject/Work?id=${id}`} >查看</Link>
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
    if( ! odoo.user.uid ){
      return
    }

    const uid = odoo.user.uid

    const Model = await odoo.env('project.work')
    const records = await Model.search([['project_id.user_id.id','=',uid]], {}, {order: 'code'})
    const data = records.look2()
    this.setState({ recordsList: data, ids: records.ids  })

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
      if (!err) {

        const Model = await odoo.env('project.work')

        const vals = { ...values, set_full_name:1, set_amount:1 }
        const new_rec = await Model.create(vals)

        if(new_rec){
          const uid = odoo.user.uid

          const Model = await odoo.env('project.work')
          const records = await Model.search([['project_id.user_id.id','=',uid]], {}, {order: 'code'})
          const data = records.look2()
          this.setState({ recordsList: data, ids: records.ids  })
        }

        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
      }
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { visible, recordsList, usersList,projectsList, worksList, uomsList } = this.state;


    return (
      <div>
        <Table columns={this.columns} dataSource={recordsList} rowKey="id" />
        <Button onClick={this.showModal}>新建</Button>
        <Modal title="新建节点"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem {...FormItemLayout} label="工程名称">
              {getFieldDecorator('name', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="工程编码">
              {getFieldDecorator('code', {
                rules: [{ required: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="节点类型">
              {getFieldDecorator('work_type', {
                rules: [{ required: true }],
              })(
                <Select placeholder="请选择节点类型">
                  <Option value="group">分组工程</Option>
                  <Option value="node">施工节点</Option>
                  <Option value="item">施工项目</Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...FormItemLayout} label="工程技术员">
              {getFieldDecorator('user_id', {
                rules: [{ required: true }],
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

            <FormItem {...FormItemLayout} label="项目">
              {getFieldDecorator('project_id', {
                rules: [{ required: true }],
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

            <FormItem {...FormItemLayout} label="父节点">
              {getFieldDecorator('parent_id', {
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

            <FormItem {...FormItemLayout} label="单位">
              {getFieldDecorator('uom_id', {
                rules: [{ required: true }],
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
            <FormItem {...FormItemLayout} label="数量">
              {getFieldDecorator('qty', {
                rules: [{ required: true }],
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem {...FormItemLayout} label="单价">
              {getFieldDecorator('price', {
                rules: [{ required: true }],
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

