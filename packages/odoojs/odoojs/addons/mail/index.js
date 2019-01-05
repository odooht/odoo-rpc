import base from '../base'
import bus from '../bus'

import mail_channel from './mail_channel'
import mail_message from './mail_message'


export default  {
    name: 'mail',
    depends: {base, bus},
    models: {
        ...mail_channel.models,
        ...mail_message.models,
    }
}

