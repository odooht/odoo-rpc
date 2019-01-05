export default  {
    models: {
        'og.match': {
            fields: [
                "name", "number", "round_id", "phase_id",
                "game_id", "deal_ids",
                "host_tri_id", "guest_tri_id",
                "host_id", "guest_id",
                "date_from", "date_thru",
                "match_team_ids",
                "line_ids",

                "open_table_id", "close_table_id", "table_ids",
                "deal_count", "imp", "imp_manual", "host_imp","guest_imp",
                "vp", "vp_manual", "host_vp","guest_vp"
            ]
        },

        'og.match.team': {
            fields: [
                "name", "match_id",
                "tri_id", "team_id", "opp_team_id",
                "position",
                "imp", "imp_opp", "vp", "vp_opp"
            ]
        },

        'og.match.line': {
            fields: [
                "name", "match_id", "deal_id", "host_id", "guest_id",
                "open_table_id", "close_table_id",
                "open_board_id", "close_board_id",
                //"number",
                "open_declarer", "open_contract", "open_result",
                "open_ns_point", "open_ew_point",
                "close_declarer", "close_contract","close_result",
                "close_ns_point", "close_ew_point",
                "point", "host_point", "guest_point",
                "imp", "host_imp", "guest_imp"
            ]
        },

        'og.table': {
            fields: [
                "name", "number", "room_type", "match_id", "round_id",
                "schedule_id", "schedule_number", "phase_id", "game_id", "deal_ids",
                "date_from", "date_thru",
                "ns_team_id", "ew_team_id",
                "west_id", "north_id", "east_id", "south_id",
                "player_ids", "table_player_ids",

                "board_ids",
                "doing_board_id",
                "state"
            ]
        },

        'og.table.player': {
            fields: [
                "name", "table_id", "player_id", "partner_id",
                "team_id", "position"
            ]
        },

        'res.users': {
            fields: [
                "team_player_ids",
                "todo_table_ids",
                "done_table_ids",
                "doing_table_ids",
            ]
        },

    }
}




/*



*/

