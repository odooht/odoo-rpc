

const res_partner_extend = (BaseClass) => {
    class cls extends BaseClass {
        async address_get() {
            const data = this.call( 'address_get' )
            // cls._records = ??
            //this.setattr('address_fields', data)
            return data;
        }

        async update_address(vals) {
            const data = this.call( 'update_address', [vals] )
            return this.address_get();
        }

        async create_company() {
            const data = this.call( 'create_company', [] )
            return await this.browse({ parent_id: 0, child_ids: 0 })
        }

    }

    cls.main_partner = async () => {
        const data = cls.call( 'main_partner', [] )
        return data
    }

    cls.find_or_create = async (email) => {
        const data = cls.call( 'find_or_create', [email] )
        return await cls.browse(data)
    }

    return cls
}


export default  {
    name: 'base',
    depends: {},
    models: {
        'res.partner': {
            fields: ['name','email','image_small'],
            extend: res_partner_extend
        },
    }
}

