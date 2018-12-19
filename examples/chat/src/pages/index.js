import React, { Component } from 'react';
import odoo from '@/odoo-bridge-rpc/odoo';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      channel_ids: [],
      getchat: [],
      textChat: '',
      me: null,
    }
  }
  getUserChange(e) {
    const value = e.target.value;
    this.setState({
      user: value
    })
  }
  getPawChange(e) {
    const value = e.target.value;
    this.setState({
      password: value
    })
  }
  getTextChat(e) {
    const value = e.target.value;
    this.setState({
      textChat: value
    })
  }
  before_poll = async () => {
    console.log('before 0')
  }

  after_poll = async (result) => {
    let msg = null
    do {
      const channel_type = 'og_game_board'
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
  async login() {
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

    const { user: login, password } = this.state;
    const values = { login, password };
    // const userData = await odoo.login(values);
    const userData = await odoo.login({ login: '101', password: '101.101' });
    if (userData) {
      const Bus = odoo.env('bus.bus');
      Bus.start_poll(this.before_poll, this.after_poll);
      const me = await odoo.me(fields);
      const chn = me.attr('channel_ids').list();
      this.setState({
        channel_ids: chn,
        me: me
      })
    }
  }
  async chatSubmit() {
    const { channel_ids, textChat } = this.state;
    if (channel_ids.length > 0) {
      const channel_id = channel_ids[0];
      channel_id.message_post({
        subject: `Hello`,
        body: { textChat }
      })
    }
  }
  async handlergame() {
    const fields = {
      name: null,
      state: null,
      number: null,
      player: null,
      hands: null,
      dealer: null,
      auction: null
    }
    const { me } = this.state;
    const table = me.attr('doing_table_ids').list()[0];
    const boards = table.attr('board_ids');
    const bd = boards.get_doing_board();
    const player = bd.attr('player')
    // const bid = await bd.get_random_call()
    await bd.bid(player, 'Pass')
  }
  render() {
    const { getchat } = this.state;
    let ChatTextDiv = [];
    getchat.map((item, index) => {
      const { author_id: { name }, date, subject } = item;
      ChatTextDiv.push(
        <div>
          <p>{name}</p>
          <p>{subject}</p>
          <p>{date}</p>
        </div>
      )
    })
    return (
      <div className="App">
        <h1>登录</h1>
        <div>
          <input onChange={e => this.getUserChange(e)} placeholder="用户名" />
          <input onChange={e => this.getPawChange(e)} placeholder="密码" />
          <button onClick={() => this.login()}>登录</button>
        </div>
        <h1>显示框</h1>
        <div>{ChatTextDiv}</div>
        <h1>输入框</h1>
        <textarea onChange={e => this.getTextChat(e)} />
        <button onClick={() => this.chatSubmit()}>确定</button>
        <h1>打牌</h1>
        <button onClick={() => this.handlergame()}>打牌</button>
      </div>
    );
  }
}














// const user = await odoo.user(fields)
//     const table = user.attr('doing_table_ids').list()[0]
//     const boards = table.attr('board_ids')
//     const bd = boards.get_doing_board()
//     console.log(bd)

//     const bd2 = bd.look(fields.doing_table_ids.board_ids)
//     console.log(bd2)