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
        },
        on_act_1(action) {
            player2.react(action);
        },
        on_act_2(action) {
            player1.react(action);
        },
        on_spawn_mana_1(amount) {
            player2.consume_mana(amount);
        },
        on_spawn_mana_2(amount) {
            player1.consume_mana(amount);
        }
    },
    components: {
        'vc-player': {
            template: '#player-template',
            data: function () {
                return {
                    hp: 100,
                    mp: 100,
                    xp: 0,
                    action_guids: [],
                    reactions: {}
                };
            },
            props: ['id'],
            methods: {
                add_actions(...rest) {
                    rest = rest.map((action) => (typeof action === 'object') ? action.guid : action);
                    this.action_guids.push.apply(this.action_guids, rest);
                },
                get_actions() {
                    return this.action_guids.map(guid => actions[guid]);
                },
                perform_action(action) {
                    this.mp -= action.mp_cost;
                    this.xp += action.xp_gain;
                    this.$emit('act', action);
                },
                react(action) {
                    let reaction = this.reactions[action.guid];
                    if (!reaction) {
                        reaction = this.create_reaction(action.guid);
                    }

                    this.hp -= action.hp_damage;

                    this.hp -= reaction.crit;
                    this.xp -= reaction.crit;

                    this.mp -= reaction.drain;
                    this.xp += reaction.drain;
                    this.$emit('spawn-mana', reaction.drain);
                },
                create_reaction(action, crit, drain) {
                    action = (typeof action === 'object') ? action.guid : action;
                    let reaction = assignDefined(gen_reaction(), { crit, drain });
                    this.reactions[action] = reaction;
                    return reaction;
                },
                consume_mana(amount) {
                    this.mp += amount;
                }
            }
        }
    }
});

var player1 = game.$refs.player1;
var player2 = game.$refs.player2;

let pass = game.create_action('pass', 0, 0, 0);
let punch = game.create_action('punch', 10, 20, 30);
let kick = game.create_action('kick', 20, 50, 40);
let caress = game.create_action('caress', 15, 10, 25);
player1.add_actions(pass, punch, kick);
player2.add_actions(pass, punch, caress);
player1.create_reaction(pass, 0, 0);
player2.create_reaction(pass, 0, 0);

function gen_reaction() {
    return {
        crit: chance.integer({ min: 0, max: 20 }),
        drain: chance.integer({ min: -5, max: 25 })
    };
}

function assignDefined(target, ...sources) {
    // source: https://stackoverflow.com/a/39514270/7399080
    // modified by kinrany

    for (const source of sources) {
        for (const key in source) {
            const val = source[key];
            if (val !== undefined) {
                target[key] = val;
            }
        }
    }
    return target;
}