import React from 'react';
import odoo from '@/odoo/odoo';
import AddUser from '@/components/AddUser';
import UserList from '@/components/UserList';
import router from 'umi/router';


export default class AddChild extends React.Component {
    state = {
        userData: [],
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
    // 确定提交联系人 
    submitUserChild = async () => {
        const { location: { query: { user_id } } } = this.props;
        const { partner } = this.commonUser;
        const { userData } = this.state;
        let addUser = [];
        userData.map(item => {
            addUser.push([0, 0, item])
        })
        const ptn = await partner.write(parseInt(user_id), { child_ids: addUser });
        if (ptn._id) {
            router.push(`/usercon?user_id=${user_id}`);
        }
    }

    componentDidMount() {
        const { location: { query: { user_id } } } = this.props;
    }

    // 存储添加的临时联系人
    saveUserChild = (userItem = {}) => {
        const user = { ...userItem, image: userItem.image_small }
        const { userData } = this.state;
        userData.push(user);
        this.setState({
            userData: userData
        })
    }



    render() {
        const { userData } = this.state;
        return (
            <div>
                <AddUser
                    saveUserChild={this.saveUserChild}
                    submitUserChild={this.submitUserChild}
                />
                <UserList userData={userData} />
            </div>
        )
    }
}
