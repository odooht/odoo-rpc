export default  {
    models: {
        'og.deal': {
            fields: [
                "name", "number", "dealer", "vulnerable",
                "card_str", "cards", "notes",
                "schedule_id", "game_id", "schedule_ids", "game_ids",
                "board_ids",
                //"match_ids", "match_line_ids"
            ]
        },

        'og.game': {
            fields: [
                "number", "name", "date_from", "date_thru",
                "game_type", "match_type", "org_type",
                "score_type", "score_uom", "state", "notes",
                "phase_ids", "schedule_ids", "round_ids", "deal_ids",
                "team_ids",
                "player_ids", "match_ids", "table_ids", "board_ids"
            ]
        },

        'og.phase': {
            fields: [
                "name", "number", "sequence",
                "game_id", "game_type", "match_type", "org_type",
                "score_type", "score_uom",
                "round_ids",
                "team_ids"
            ]
        },

        'og.schedule': {
            fields: [
                "name", "number", "date_from", "date_thru",
                "game_id", "deal_ids", "round_ids"
            ]
        },

        'og.round': {
            fields: [
                "phase_id", "game_id", "schedule_id",
                "last_in_phase", "date_from", "date_thru",
                "name", "number", "sequence",
                "deal_ids",
                "team_ids",
                "team_info_ids",
                "match_ids",
                "table_ids", "state",
                "board_ids"
            ]
        },

        'og.team': {
            fields: [
                "name",
                "partner_id",
                "number",
                "game_id", "phase_ids", "player_ids",
                "round_info_ids",
                "match_team_ids", "rank"
            ]
        },

        'og.team.player': {
            fields: [
                "name", "partner_id",
                "team_id", "role",
                "table_player_ids"
            ]
        },

        'og.team.round.info':{
            fields: [
                'name', 'number' ,'sequence',
                'round_id', 'team_id' ,
                'game_id', 'phase_ids', 'last_in_phase',

                'match_team_id', 'opp_team_id' ,'match_id',
                'imp' ,'imp_opp', 'vp', 'vp_opp' ,
                'score_uom' ,'score_manual' , 'score' ,
                'score_open', 'score_close',
                'rank_open', 'rank_close'
            ]
        },
    }
}





