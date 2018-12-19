import React from 'react';
import odoo from '@/odoo/odoo';
import { Card, Input, Button } from 'antd';
import LoginForm from '../../components/LoginForm';
const { TextArea } = Input;
class Chat extends React.Component {
  state = ({
    sid: null,
    channel_ids: [],
    getchat: [],
    textChat: '',
    me: null,
  })
  before_poll = async () => {
    console.log('before 0')
  }
  getTextChat(e) {
    const value = e.target.value;
    this.setState({
      textChat: value
    })
  }
  after_poll = async (result) => {
    let msg = null
    do {
      const channel_type = 'channel'
      const Chn = odoo.env('mail.channel')
      msg = await Chn.poll(channel_type)
      if (msg) {
        const mm = msg.look({
          subject: null,
          body: null,
          channel_ids: { channel_type: null },
          author_id: { id: null, name: null },
          date: null,
        })
        const { author_id, body, date, subject } = mm;
        const chatText = { body, author_id, date, subject };
        const historyChatText = this.state.getchat;
        historyChatText.push(chatText)
        this.setState({
          getchat: historyChatText,
        })
      }
    } while (msg)

  }
  login = async (valus) => {
    const fields = {
      name: 0,
      channel_ids: { name: 0, uuid: 0, channel_partner_ids: 0, channel_type: 0 },
      doing_table_ids: {
        name: null,
        board_ids: {
          name: null,
          state: null,
          number: null,
          player: null,
          hands: null,
          dealer: null,
          auction: null
        }
      }
    }
    const userData = await odoo.login(valus);
    if (userData) {
      const Bus = odoo.env('bus.bus');
      Bus.start_poll(this.before_poll, this.after_poll);
      const me = await odoo.me(fields);
      const chn = me.attr('channel_ids').list();
      this.setState({
        channel_ids: chn,
        me: me,
        sid: userData,
      })
    }
  };
  async chatSubmit() {
    const { channel_ids, textChat } = this.state;
    if (channel_ids.length > 0) {
      const channel_id = channel_ids[0];
      channel_id.message_post({
        subject: textChat
      })
      this.setState({
        textChat:''
      })
    }
  }
  render() {
    const { sid, getchat } = this.state;
    let ChatTextDiv = [];
    getchat.map((item, index) => {
      const { author_id: { name }, date, subject } = item;
      ChatTextDiv.push(
        <Card
          bordered={false}
          style={{ textAlign: "left" }}
          title={<div><p>{name}<span style={{ paddingLeft: 20 }}>{date}</span></p></div>}
        >
          <p>{subject}</p>
        </Card>
      )
    })
    return (
      sid ?
        <div>
          <div style={{ minHeight: 600, border: " 1px solid #000" }}>{ChatTextDiv}</div>
          <TextArea value={this.state.textChat}  onChange={e => this.getTextChat(e)} rows={4} />
          <Button style={{float:"right",margin:20}} onClick={() => this.chatSubmit()}>确定</Button>
        </div> : <div>
          <LoginForm login={this.login} />
        </div>
    );
  }
}

export default Chat;
