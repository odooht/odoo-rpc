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
      getboard: [],
      textChat: '',
      me: null,
      //叫牌
      bid: '',
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
  getBidChange(e) {
    this.setState({
      bid: e.target.value
    })
  }
  before_poll = async () => {
    console.log('before 0')
  }

  after_poll = async (result) => {
    let msg = null;
    const fields = {
      name: null,
      state: null,
      number: null,
      player: null,
      hands: null,
      dealer: null,
      auction: null
    }
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
          getchat: historyChatText
        })

      }
    } while (msg)
    do {
      const channel_type = 'og_game_board'
      const Chn = odoo.env('mail.channel')
      // 连接类型通道获取消息
      msg = await Chn.poll(channel_type)
      if (msg) {
        // const mm = msg.look({
        //   subject: null,
        //   body: null,
        //   channel_ids: { channel_type: null },
        //   author_id: { id: null, name: null },
        //   date: null,
        // })
        const bd_msg = odoo.env('og.board').poll(msg.attr('id'));
        // console.log(bd_msg);
        const { id, method, args, info, board } = bd_msg;
        const {
          state: boardState,
          last_trick, //[]
          contract,
          dealer,
          auction,//[]
          player,
          result,
          declarer,
          current_trick,//[]
          hands,//[]
          openlead,
          ns_point,
          ew_point,
          ew_win,
          ns_win,
          number,
          tricks,//[]
        } = board.look(fields);
        const chatText = {
          id,
          method,
          args: JSON.stringify(args),
          board: {
            state: boardState,
            last_trick: JSON.stringify(last_trick), //[]
            contract,
            dealer,
            auction: JSON.stringify(auction),//[]
            player,
            result,
            declarer,
            current_trick: JSON.stringify(current_trick),//[]
            hands: JSON.stringify(hands),//[]
            openlead,
            ns_point,
            ew_point,
            ew_win,
            ns_win,
            number,
            tricks: JSON.stringify(tricks),//[]
          }
        }
        const historyChatText = this.state.getboard;
        historyChatText.push(chatText);
        this.setState({
          getboard: historyChatText
        })
      }
    } while (msg)
  }
  //登录
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
      //开启通道
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

  // 叫牌
  async handlergame() {
    // 叫牌得牌
    const { bid } = this.state;
   
    const { me } = this.state;
    const table = me.attr('doing_table_ids').list()[0];
    const boards = table.attr('board_ids');
    const bd = boards.get_doing_board();
    const player = bd.attr('player')
    // const bid = await bd.get_random_call()
    await bd.bid(player, bid)



  }
  render() {
    const { getchat, getboard } = this.state;
    let ChatTextDiv = [];
    let DealTextDiv = [];
    getchat.map((item, index) => {
      const { author_id: { name }, date, subject, body } = item;
      ChatTextDiv.push(
        <div key={index}>
          <p>{name}</p>
          <p>{subject}</p>
          <p>{date}</p>
          <p>{body}</p>
        </div>
      )
    })
    getboard.map((item, index) => {
      const { args, method, board: { state, auction, player } } = item;
      ChatTextDiv.push(
        <div key={index}>
          <p>111</p>
        </div>
      )
      DealTextDiv.push(
        <div key={index}>
          args<p>{args}</p>
          method<p>{method}</p>
          state<p>{state}</p>
          auction<p>{auction}</p>
          player<p>{player}</p>
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
        <h1>聊天显示框</h1>
        <div>{ChatTextDiv}</div>
        <h1>输入框</h1>
        <textarea onChange={e => this.getTextChat(e)} />
        <button onClick={() => this.chatSubmit()}>确定</button>
        <h1>打牌</h1>
        <h1>打牌显示框</h1>
        <div>{DealTextDiv}</div>
        <input onChange={e => this.getBidChange(e)} />
        <button onClick={() => this.handlergame()}>打牌</button>
      </div>
    );
  }
}
