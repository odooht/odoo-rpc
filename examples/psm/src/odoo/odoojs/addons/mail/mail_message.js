
const mail_message_extend = (BaseClass) => {
    // TBD
    class cls extends BaseClass {
    }

    cls.message_get = (message ) => {
        //console.log('mail:', message)
        const id = cls._set_one(message, {})
        const msg = cls.view(id)
        return msg
    }

    return cls

}

export default  {
    models: {
        'mail.message': {
            fields: [
                'subject','date','body',
                // TBD
            ],


            extend: mail_message_extend
        },
    }
}



