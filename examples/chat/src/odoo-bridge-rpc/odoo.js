import ODOO from './src/index';

const host = '/api'
const db = 'TT'
const models = {
        'res.users': ['name', 'doing_table_ids','channel_ids','login','partner_id','company_id','category_id'],
        'og.table': ['name', 'board_ids', 'channel_ids'],
        'og.board': ['name', 'state', 'number', 'player', 'hands', 'dealer', 'auction'],

        'bus.bus': ['name'],
        'mail.channel': ['name', 'uuid', 'channel_partner_ids', 'channel_type', 'channel_message_ids'],
        'mail.message': ['subject', 'body', 'subtype_id', 'message_type', 'author_id', 'date', 'channel_ids'],
        'og.channel': ['name', 'table_id', 'type', 'mail_channel_id'],
}

const odoo = new ODOO({ host, db, models })

export default odoo
