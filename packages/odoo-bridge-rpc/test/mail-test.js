import ODOO from '../src';

describe('jsonrpc', () => {
  it('all ok', done => {
    //test_browse_multi(done)
    //test(done)
    test(done);
  });
});

const get_odoo = async () => {
  const host = 'http://192.168.56.105:8069';
  const db = 'TT';
  const models = {
    //        'res.partner': ['name','email','user_id','company_id','category_id'],
    //        'res.company': ['name','email'],
    //        'res.country': ['name' ],
    'res.users': ['name', 'doing_table_ids'],
    'og.table': ['name', 'board_ids', 'channel_ids'],
    'og.board': [
      'name',
      'state',
      'number',
      'player',
      'hands',
      'dealer',
      'auction',
    ],

    'bus.bus': ['name'],
    'mail.channel': [
      'name',
      'uuid',
      'channel_partner_ids',
      'channel_type',
      'channel_message_ids',
    ],
    'mail.message': [
      'subject',
      'body',
      'subtype_id',
      'message_type',
      'author_id',
      'date',
      'channel_ids',
    ],
    'og.channel': ['name', 'table_id', 'type', 'mail_channel_id'],
  };

  const odoo = new ODOO({ host, db, models });
  return odoo;
};

const test = async done => {
  await test0();
};

const test0 = async () => {
  const odoo = await get_odoo();
  //console.log(odoo)

  const ss = await odoo.login({ login: '1011', password: '123' });
  //console.log(ss)

  const Bus = odoo.env('bus.bus');

  const before_poll = async () => {
    console.log('before 0');
    before_poll0(odoo);
  };

  const after_poll = async result => {
    console.log('after:', result);

    const get_msg = async channel_type => {
      msg = await Chn.poll(channel_type);
      console.log(new Date(), channel_type, msg);
      if (msg) {
        const mm = msg.look({
          subject: null,
          body: null,
          channel_ids: { channel_type: null },
        });
        console.log(channel_type, mm);
        const bd_msg = odoo.env('og.board').poll(msg.attr('id'));
        console.log(bd_msg);
      }
    };

    const Chn = odoo.env('mail.channel');
    let msg = null;
    do {
      await get_msg('channel');
      await get_msg('og_game_board');
    } while (msg);
  };

  Bus.start_poll(before_poll, after_poll);
};

const before_poll0 = async odoo => {
  //console.log('toplay-:', odoo)

  const Bus = odoo.env('bus.bus');

  if (Bus.longpoll_last > 0) {
    return;
  }

  const fields = {
    name: null,
    doing_table_ids: {
      name: null,
      board_ids: {
        name: null,
        state: null,
        number: null,
        player: null,
        hands: null,
        dealer: null,
        auction: null,
      },
    },
  };

  const user = await odoo.user(fields);
  //    console.log(user)
  const table = user.attr('doing_table_ids').list()[0];
  //console.log(table.look(fields.doing_table_ids))

  const boards = table.attr('board_ids');
  //.list()
  //    console.log(boards)
  //    console.log(boards._ids)

  //    console.log( boards.list() )

  const bd = boards.get_doing_board();
  console.log(bd);

  const bd2 = bd.look(fields.doing_table_ids.board_ids);
  console.log(bd2);

  const nn = bd.attr('name');
  console.log(nn);

  const player = bd.attr('player');
  const state = bd.attr('state');

  const bid = await bd.get_random_call();

  console.log(player, state, bid);
  const resss = await bd.bid(player, bid);
  console.log(player, state, bid, resss);

  /*
   */
};

/*

const test2 = async (done) => {
    const odoo = await get_odoo()
    //console.log(odoo)

    const ss = await odoo.login({login:'1011',password:'123'})
    //console.log(ss)


    const message_get = (message_id)=>{
        const msg = odoo.env('mail.message').view(message_id)
        console.log(msg.attr('subject'))

        if (msg.attr('subject') == 'og.board'){
            odoo.env('og.board').message_get(message_id)
        }
        else{
            console.log(msg.attr('subject'))
            console.log(msg.attr('body'))
        }

    }

    const before_poll = async () => {
        before_poll0(odoo)
    }

    const notify_1 = async (id, pos, call, info ) => {
        console.log('notify=', id, pos, call,info)
        const board = odoo.env('og.board').view( id )
        console.log('notify=', board.attr('auction'))
    }

    const notify_2 = async (id, pos, call, info ) => {
    }

    const notify_3 = async (id, pos, call, info ) => {
    }

    const fields = {
        name: null,
        doing_table_ids: {
            name:null,
            channel_ids: {mail_channel_id:{name: null}},
            board_ids: {
                name: null,
                state:null,
                number: null,
                player: null,
                hands: null,
                dealer: null,
                auction: null
            }
        }
    }

    const user = await odoo.user(fields)
//    console.log(user)
    const table = user.attr('doing_table_ids').list()[0]
//    console.log(table.look(fields.doing_table_ids))

    const subtype = await odoo.ref('mail.mt_comment')
    odoo.env('mail.message').notifications[subtype[1]] = message_get


    odoo.env('og.board').notifications = {
        bid: notify_1,
        play: notify_2,
        claim: notify_3,
    }
     //
    const Bus = odoo.env('bus.bus')
    Bus.before_poll = before_poll
    Bus.start_poll()


    done()
}


const test_play = async (odoo) => {


    //await test_init()

//    const user0 = user.look(fields)
//    console.log(user0)
//    const table0 = table.look(fields.doing_table_ids)
//    console.log(table0)


    await bd.play('S','H2')

    const bd3 = odoo.env('og.board').view(42)

    console.log(bd3.play)
}

*/
