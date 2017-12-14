const reactions = {};
reactions[1] = []; // [{ action: <action that causes this reaction, reaction: <actual reaction> }];
reactions[2] = [];

const game = new Vue({
    el: '#game',
    data: {
        actions: {}
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
                    actions: []
                };
            },
            props: ['id'],
            methods: {
                add_actions(...rest) {
                    this.actions.push.apply(this.actions, rest);
                },
                get_actions() {
                    return this.actions;
                },
                perform_action(action) {
                    this.mp -= action.mp_cost;
                    this.xp += action.xp_gain;
                    this.$emit('act', action);
                },
                react(action) {
                    let reaction = this.get_reaction(action);

                    this.hp -= action.hp_damage;

                    this.hp -= reaction.crit;
                    this.xp -= reaction.crit * 2;

                    this.mp -= reaction.drain;
                    this.xp += reaction.drain * 3;
                    this.$emit('spawn-mana', reaction.drain);
                },
                get_reaction(action) {
                    return get_reaction(this.id, action);
                },
                set_reaction(action, reaction) {
                    set_reaction(this.id, action, reaction);
                },
                get_all_reactions() {
                    return reactions[this.id];
                },
                consume_mana(amount) {
                    this.mp += amount;
                }
            }
        }
    }
});

// at high XP characters bleed HP but regen MP faster

let pass = game.create_action('pass', 0, 0, 0);
let punch = game.create_action('punch', 10, 20, 30);
let kick = game.create_action('kick', 20, 50, 40);
let caress = game.create_action('caress', 15, 10, 25);

var player1 = game.$refs.player1;
var player2 = game.$refs.player2;

player1.add_actions(pass, punch, kick);
player2.add_actions(pass, punch, caress);
player1.set_reaction(pass, { crit: 0, drain: 0 });
player2.set_reaction(pass, { crit: 0, drain: 0 });

function get_reaction(id, action) {
    return get_reaction_record(id, action).reaction;
}

function set_reaction(id, action, reaction) {
    let record = get_reaction_record(id, action);
    record.reaction = reaction;
}

function get_reaction_record(id, action) {
    let record = reactions[id].find(obj => obj.action === action);
    if (!record) {
        record = { action: action, reaction: generate_reaction() };
        reactions[id].push(record);
    }
    return record;
}

function generate_reaction() {
    return {
        crit: chance.integer({ min: 0, max: 10 }),
        drain: chance.integer({ min: 0, max: 10 })
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