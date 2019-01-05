import sales_team from './sales_team'
import mail from './mail'

const calendar = {}
const resource = {}


// TBD
const crm_lead_extend = (BaseClass)=>{

    class cls extends BaseClass {
        action_set_lost() {
            const data = this.call( 'action_set_lost' )
            //this.setattr('address_fields', data)
            this.browse({ probability:0, active: 0})
            return data;
        }

        action_set_won() {
            const data = this.call( 'action_set_won' )
            //this.setattr('address_fields', data)
            this.browse({ probability:0, stage_id: 0})
            return data;
        }
    }

    return cls
}


export default  {
    name: 'crm',
    depends: {
        sales_team , mail, // calendar, resource
    },
    models: {
        'res.partner': {
            fields: [
                'team_id', 'opportunity_ids',
                'meeting_ids','opportunity_count',
                'meeting_count'
            ],
        },

        'res.users': {
            fields: ['target_sales_won', 'target_sales_done'],
        },

        'crm.team': {
            fields: [
                'use_leads', 'use_opportunities','alias_id',
                'unassigned_leads_count',
                'opportunities_count','opportunities_amount',
            ],
        },

        'crm.stage': {
            fields: [
                'name', 'sequence','probability',
                'on_change',
                'requirements','team_id',
                'legend_priority','fold','team_count'
            ],
        },

        'crm.lead': {
            fields: [
                'name','partner_id','active','date_action_last',
                'email_from','website','team_id','kanban_state',
                'email_cc','description','tag_ids','contact_name','partner_name',
                'type','priority','date_closed','stage_id',
                'user_id','referred',
                'date_open','day_open','day_close',
                'date_last_stage_update','date_conversion',
                'message_bounce',
                'probability','planned_revenue','expected_revenue',
                'date_deadline','color',
                'partner_address_name','partner_address_email',
                'partner_address_phone','partner_is_blacklisted',
                'company_currency','user_email','user_login',
                'street','street2','zip','city','state_id','country_id',
                'phone','mobile','function','title',
                'company_id','meeting_count','lost_reason'
            ],

            extend: crm_lead_extend

        },

        'crm.lead.tag': {
            fields: [ 'name', 'color' ],
        },

        'crm.lost.reason': {
            fields: [ 'name', 'active' ],
        },

        'calendar.event': {
            fields: [ 'opportunity_id' ],
        },

    }
}

