import React from 'react';
import router from 'umi/router';
import odoo from '@/odoo/odoo';
import UserForm from '@/components/UserForm';
import UserList from '@/components/UserList';

export default class Usercon extends React.PureComponent {
    state = {
        userData: {},
        user_id: this.props.location.query
    }

    // 通用user
    commonUser = {
        fields: {
            parent_id: { id: null, name: null },
            id: null,
            name: null,
            image_small: null,
            email: null,
            date: null,
            create_date: null,
            phone: null,
            child_ids: {
                id: null,
                name: null,
                image_small: null,
                email: null,
                date: null,
                create_date: null,
                phone: null,
            }
        },
        partner: odoo.env('res.partner'),
        save: (userData) => {
            this.setState({
                userData
            })
        },
    }
    // 查询
    handlerGetUser = async (user_id) => {
        const { partner, fields, save } = this.commonUser;
        const ptn = await partner.browse(parseInt(user_id), fields);
        const userData = ptn.look(fields);
        save(userData)
    }

    //修改 
    handlerCreateUser = async (user_id, values) => {
        values.image_small = values.image_small ? unescape(values.image_small.split(',')[1]) : this.state.userData.image_small
        const { partner } = this.commonUser;
        if (user_id) {
            const result = await partner.write(parseInt(user_id), values);
            if (result) {
                router.push('/');
            }
        } else {

            const result = await partner.create({ ...values, image: values.image_small });
            if (result) {
                router.push('/');
            }
        }
    }
    // 删除
    handlerDeleteUser = async (user_id) => {
        const { partner } = this.commonUser;
        const result = await partner.unlink(parseInt(user_id));
        if (result) {
            router.push('/');
        }
    }
    // 删除/添加 联系人
    handlerDeleteUserLianxi = async (lianxi_user_id, values) => {
        const { location: { query: { user_id } } } = this.props;
        const { partner } = this.commonUser;
        await partner.write(parseInt(lianxi_user_id), values);
        this.handlerGetUser(user_id);
    }
    componentDidMount() {
        const { location: { query: { user_id } } } = this.props;
        this.handlerGetUser(user_id)
    }
    render() {
        const { userData } = this.state;
        const { child_ids } = userData;
        const { location: { query: { user_id }, pathname } } = this.props;
        return (
            <div>
                <UserForm
                    user_id={user_id}
                    userData={userData}
                    handlerDeleteUser={this.handlerDeleteUser}
                    handlerCreateUser={this.handlerCreateUser}
                />
                <UserList
                    handlerDeleteUserLianxi={this.handlerDeleteUserLianxi}
                    handlerGetUser={this.handlerGetUser}
                    pathname={pathname}
                    userData={child_ids || []}
                />
            </div>
        )
    }
}