import mail from './mail'

export default  {
    name: 'project',
    depends: {
         mail // , resource
    },

    models: {
        'res.partner': {
            fields: ['task_ids', 'task_count'],
        },

        'project.task.type': {
            fields: [
                'name','description','sequence','project_ids',
                'legend_priority','legend_blocked','legend_done','legend_normal',
                'mail_template_id','fold','rating_template_id','auto_validation_kanban_state'
            ],
        },

        'project.project': {
            fields: [
                'name', 'active','sequence','partner_id','company_id','currency_id',
                'favorite_user_ids','is_favorite','label_tasks',
                'tasks','resource_calendar_id','type_ids','task_count','task_ids',
                'color','user_id','alias_id','privacy_visibility','doc_count',
                'date_start','date','subtask_project_id',
                'percentage_satisfaction_task','percentage_satisfaction_project',
                'rating_request_deadline','rating_status','rating_status_period','portal_show_rating'
            ],

        },

        'project.task': {
            fields: [
                'name','active','description','priority','sequence',
                'stage_id','tag_ids','kanban_state','kanban_state_label',
                'create_date','write_date','date_start','date_end',
                'date_assign','date_deadline','date_last_stage_update',
                'project_id','notes','planned_hours','subtask_planned_hours',
                'user_id','partner_id','manager_id','company_id',
                'color','user_email','attachment_ids','displayed_image_id',
                'legend_blocked','legend_done','legend_normal',
                'parent_id','child_ids','subtask_project_id','subtask_count',
                'email_from','email_cc',
                'working_hours_open','working_hours_close',
                'working_days_open','working_days_close'

            ],
        },

        'project.tags': {
            fields: [ 'name','color' ],
        },

    }
}

