import React from 'react';
import { Upload, Modal, Icon } from 'antd';
import styles from './UserPhone.css';

export default class UserPhone extends React.Component {
    state = {
        previewVisible: false,
        image_small: null,
    };

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewVisible: true,
        });
    }
    getBase64 = (info) => {
        const img = info.file.originFileObj
        const reader = new FileReader();
        reader.addEventListener('load', (reader) => {
            this.props.handlerGetImage(reader.target.result)
            this.setState({
                image_small: reader.target.result
            })
        });
        reader.readAsDataURL(img);
    }
    render() {
        const { previewVisible } = this.state;
        const { isedit = false, handlerGetImage } = this.props;
        const image_small = this.state.image_small ? this.state.image_small : this.props.image_small
        return (
            <div className="clearfix">
                <div
                    className={styles.showphone}
                >
                    {isedit ?
                        <a><Icon className={styles.eye} onClick={this.handlePreview} type="eye" /></a> :
                        <Upload
                            name="avatar"
                            onChange={this.getBase64}
                            className={styles.edit}>
                            <Icon className={styles.edit_icon} type="edit" />
                        </Upload>
                    }
                    <img src={image_small} />
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={image_small} />
                </Modal>
            </div>
        );
    }
}

