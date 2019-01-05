

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

const res_country_extend = (BaseClass)=>{
    class cls extends BaseClass {
        get_address_fields() {
            const data = this.call( 'get_address_fields', [] )
            //this.setattr('address_fields', data)
            return data;
        }
    }

    return cls
}

const res_currency_extend = (BaseClass) => {
    class cls extends BaseClass {
        amount_to_text(amount) {
            const data = this.call( 'amount_to_text', [amount] )
            return data;
        }

        round(amount) {
            const data = this.call( 'round', [amount] )
            return data;
        }

        compare_amounts(amount1, amount2) {
            const data = this.call( 'compare_amounts', [amount1, amount2] )
            return data;
        }

        is_zero(amount) {
            const data = this.call( 'is_zero', [amount] )
            return data;
        }

    }

    return cls

}

const res_users_extend = (BaseClass) => {
    class cls extends BaseClass {
    }

    cls.change_password = async (old_passwd, new_passwd) => {
        const data = cls.call( 'change_password', [old_passwd, new_passwd] )
        return data
    }

    cls.has_group = async (group_ext_id) => {
        const data = cls.call( 'has_group', [group_ext_id] )
        return data
    }

    return cls
}

export default  {
    name: 'base',
    depends: {},
    models: {
        'res.bank': {
            fields: [
                'name','street','street2','zip','city','state','country',
                'email','phone','active','bic'
            ]
        },

        'res.partner.bank': {
            fields: [
                'acc_type','acc_number','sanitized_acc_number','acc_holder_name',
                'partner_id','bank_id','bank_name','bank_bic',
                'sequence','currency_id','company_id','qr_code_valid'
            ]
        },

        'res.company': {
            fields: [
                'name','sequence','parent_id','child_ids','partner_id',
                'report_header','report_footer','logo','logo_web',
                'currency_id','user_ids','account_no',
                'street','street2','zip','city','state_id',
                'bank_ids','country_id','email','phone','website',
                'vat','company_registry','base_onboarding_company_state'
            ],
        },

        'res.country': {
            fields: ['name','code','address_format','currency_id',
                'image','phone_code', 'country_group_ids', 'state_ids',
                'name_position','vat_label'
            ],

            extend: res_country_extend
        },

        'res.country.group': {
            fields: ['name','country_ids'],
        },

        'res.country.state': {
            fields: ['country_id','name','code'],
        },

        'res.currency': {
            fields: [
                'name','symbol','rate','rate_ids','rounding','decimal_places',
                'active','position','date','currency_unit_label','currency_subunit_label'
            ],
            extend: res_currency_extend
        },

        'res.currency.rate': {
            fields: [
                'name','rate','currency_id','company_id'
            ],
        },

        'res.partner.category': {
            fields: [
                'name','color','parent_id','child_ids',
                'active','parent_path','partner_ids'
            ],
        },

        'res.partner.title': {
            fields: ['name','shortcut' ],
        },

        'res.partner': {
            fields: [
                'name','display_name','date','title',
                'parent_id','parent_name','child_ids',
                'ref','lang','tz','tz_offset',
                'user_id','vat','bank_ids','website','comment',
                'category_id','credit_limit','barcode',
                'active','customer','supplier','employee',
                'function','type',
                'street','street2','zip','city','state_id','country_id',
                'email','email_formatted','phone','mobile',
                'is_company','industry_id','company_type','company_id',
                'color','user_ids','partner_share','contact_address',
                'commercial_partner_id','commercial_company_name',
                'company_name','image','image_medium','image_small'
            ],

            extend: res_partner_extend
        },

        'res.partner.industry': {
            fields: ['name','full_name','active' ],
        },

        'res.groups': {
            fields: [
                'name','users','model_access','rule_groups',
                'comment','category_id','color','full_name','share'
            ],
        },

        'res.users.log': {
            fields: ['create_uid', 'create_date' ],
        },

        'res.users': {
            fields: [
                'name','partner_id','login','password','new_password',
                'signature','active','groups_id','log_ids','login_date',
                'share','companies_count','tz_offset'
            ],
            extend: res_users_extend
        },


    }
}

