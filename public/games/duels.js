const actions = {};

const game = new Vue({
    el: '#game',
    data: {
        actions: actions
    },
    methods: {
        create_action(name, mp_cost, hp_damage, xp_gain) {
            let guid = chance.guid();
            let action = { guid, name, mp_cost, hp_damage, xp_gain };
            Vue.set(this.actions, guid, action);
            return action;
        }
    },
    components: {
        'vc-player': {
            template: '#player-template',
            data: new_player,
            props: ['id'],
            methods: {
                add_action(guid) {
                    this.action_guids.push(guid);
                },
                actions() {
                    return this.action_guids.map(guid => actions[guid]);
                }
            }
        }
    }
});

let player1 = game.$refs.player1;
let player2 = game.$refs.player2;

let kick = game.create_action('kick', 10, 20, 30);
let drop_kick = game.create_action('throw', 20, 50, 40);
player1.add_action(kick.guid);
player2.add_action(kick.guid);
player1.add_action(drop_kick.guid);

function new_player() {
    return {
        hp: 100,
        mp: 100,
        xp: 0,
        action_guids: [],
        reactions: {}
    };
}

function new_reaction(action, mp_drain, hp_critical) {

}

function get_random_action() {

}

// taking critical damage takes XP
// getting mana drained gives XP
