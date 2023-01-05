import { assert } from "chai";
import { convert, toJSON } from "../../src/utils/conversions";

const OGRE = {
  name: "Yellow Ogre",
  size: "Large",
  type: "Giant",
  subtype: "Ogre",
  alignment: "Chaotic Evil",
  armor_class: 11,
  hit_points: 59,
  hit_dice: "7d10",
  speed: {
    walk: "40 ft.",
  },
  strength: 19,
  dexterity: 8,
  constitution: 16,
  intelligence: 5,
  wisdom: 7,
  charisma: 7,
  senses: {
    darkvision: "60 ft.",
  },
  languages: "Common, Giant",
  challenge_rating: 3,
  special_abilities: [
    {
      name: "Keen Smell",
      description:
        "The ogre has advantage on Wisdom (Perception) checks that rely on smell.",
    },
    {
      name: "Labyrinthine Recall",
      description: "The ogre can perfectly recall any path it has traveled.",
    },
  ],
  actions: [
    {
      name: "Multiattack",
      description: "The ogre makes two greatclub attacks.",
    },
    {
      name: "Greatclub",
      description:
        "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.",
    },
  ],
};

const KOBOLD = {
  name: "Kobold with Eyepatch",
  size: "Small",
  type: "humanoid",
  subtype: "kobold",
  alignment: "Lawful Evil",
  armor_class: 12,
  hit_points: 5,
  hit_dice: "1d6",
  speed: "30 ft.",
  strength: 7,
  dexterity: 15,
  constitution: 9,
  intelligence: 8,
  wisdom: 7,
  charisma: 8,
  perception: 112,
  senses: "darkvision 60 ft., passive Perception 8",
  languages: "Common, Draconic",
  challenge_rating: 0.25,
  special_abilities: [
    {
      name: "Sunlight Sensitivity",
      description:
        "While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
    },
  ],
  actions: [
    {
      name: "Dagger",
      description:
        "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage.",
      attack_bonus: 4,
      damage_dice: "1d4",
      damage_bonus: 2,
    },
  ],
};

const TWO_HEADED_DRAKE = {
  name: "Two-Headed Drake",
  size: "Large",
  type: "dragon",
  subtype: "",
  alignment: "unaligned",
  armor_class: 16,
  hit_points: 75,
  hit_dice: "10d10",
  speed: {
    walk: "30 ft.",
    fly: "60 ft.",
  },
  strength: 19,
  dexterity: 10,
  constitution: 17,
  intelligence: 5,
  wisdom: 12,
  charisma: 7,
  dexterity_save: 3,
  constitution_save: 6,
  wisdom_save: 4,
  damage_vulnerabilities: "",
  damage_resistances: "",
  damage_immunities: "fire",
  condition_immunities: "",
  senses: "darkvision 60 ft., passive Perception 11",
  languages: "",
  challenge_rating: 5,
  special_abilities: [
    {
      name: "Two Heads",
      description:
        "The drake has two heads, each of which can breathe fire out of one head and cold out of the other.",
    },
  ],
  actions: [
    {
      name: "Multiattack",
      description:
        "The drake makes two attacks: one with its bite and one with its claws.",
    },
    {
      name: "Bite",
      description:
        "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage.",
      attack_bonus: 7,
      damage_dice: "2d10",
      damage_bonus: 4,
    },
    {
      name: "Claws",
      description:
        "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.",
      attack_bonus: 7,
      damage_dice: "2d6",
      damage_bonus: 4,
    },
    {
      name: "Fire Breath (Recharge 5-6)",
      description:
        "The drake exhales fire in a 15-foot cone. Each creature in that area must make a DC 14 Dexterity saving throw, taking 42 (12d6) fire damage on a failed save, or half as much damage on a successful one.",
      attack_bonus: 0,
      damage_dice: "12d6",
    },
    {
      name: "Cold Breath (Recharge 5-6)",
      description:
        "The drake exhales cold in a 15-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) cold damage on a failed save, or half as much damage on a successful one.",
      attack_bonus: 0,
      damage_dice: "12d6",
    },
  ],
};

const VAMPIRE = {
  name: "Vampire with Cursed Dagger",
  size: "Medium",
  type: "Undead",
  subtype: "Vampire",
  alignment: "Chaotic Evil",
  armor_class: 16,
  hit_points: 78,
  hit_dice: "12d8",
  speed: {
    walk: 30,
  },
  strength: 16,
  dexterity: 18,
  constitution: 16,
  intelligence: 14,
  wisdom: 12,
  charisma: 18,
  saving_throws: {
    dexterity: 8,
    constitution: 6,
    wisdom: 4,
  },
  skills: {
    perception: 6,
    stealth: 8,
    arcana: 6,
  },
  damage_vulnerabilities: "radiant",
  damage_resistances:
    "necrotic; bludgeoning, piercing, and slashing from nonmagical weapons",
  damage_immunities: "poison",
  condition_immunities: "charmed, exhaustion, frightened, paralyzed, poisoned",
  senses: "darkvision 60 ft., passive Perception 16",
  languages: "Common, Infernal, Abyssal",
  challenge_rating: 6,
  special_abilities: [
    {
      name: "Cursed Dagger",
      description:
        "The vampire carries a cursed dagger that can cast wizard spells. It has a +2 bonus to attack and damage rolls made with this magic weapon.",
    },
    {
      name: "Regeneration",
      description:
        "The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point.",
    },
    {
      name: "Spider Climb",
      description:
        "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
    },
    {
      name: "Vampire Weaknesses",
      description:
        "The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage when it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
    },
  ],
};

const DRAGON = {
  name: "Ancient Blue Dragon",
  size: "Gargantuan",
  type: "Dragon",
  subtype: "",
  alignment: "Lawful Evil",
  armor_class: 22,
  hit_points: 481,
  hit_dice: "26d20 + 208",
  speed: {
    fly: 80,
    swim: 40,
  },
  strength: 30,
  dexterity: 10,
  constitution: 29,
  intelligence: 18,
  wisdom: 15,
  charisma: 23,
  dexterity_save: 7,
  constitution_save: 16,
  wisdom_save: 9,
  charisma_save: 13,
  perception: 16,
  damage_vulnerabilities: "",
  damage_resistances: "",
  damage_immunities: "Lightning",
  condition_immunities: "",
  senses: "Blindsight 60 ft., Darkvision 120 ft., Passive Perception 26",
  languages: "Common, Draconic",
  challenge_rating: 21,
  special_abilities: [
    {
      name: "Legendary Resistance (3/Day)",
      description:
        "If the dragon fails a saving throw, it can choose to succeed instead.",
    },
    {
      name: "Amphibious",
      description: "The dragon can breathe air and water.",
    },
    {
      name: "Actions",
      description:
        "The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The dragon regains spent legendary actions at the start of its turn.",
    },
  ],
  actions: [
    {
      name: "Multiattack",
      description:
        "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
    },
    {
      name: "Bite",
      description:
        "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage plus 14 (4d6) lightning damage.",
    },
    {
      name: "Claw",
      description:
        "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage.",
    },
    {
      name: "Tail",
      description:
        "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage.",
    },
    {
      name: "Frightful Presence",
      description:
        "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
    },
    {
      name: "Lightning Breath (Recharge 5-6)",
      description:
        "The dragon exhales lightning in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 24 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one.",
    },
  ],
  legendary_actions: [
    {
      name: "Detect",
      description: "The dragon makes a Wisdom (Perception) check.",
    },
    {
      name: "Tail Attack",
      description: "The dragon makes a tail attack.",
    },
    {
      name: "Wing Attack (Costs 2 Actions)",
      description:
        "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.",
    },
  ],
};
describe("Parsing Tests Tests", () => {
  it("Can convert a basic Ogre", () => {
    const monster = convert(OGRE);
    assert.equal(monster.name, "Yellow Ogre");
    assert.equal(monster.size, "Large");
    assert.equal(monster.type, "Giant");
    assert.equal(monster.subType, "Ogre");
    assert.equal(monster.alignment, "Chaotic Evil");
    assert.equal(monster.armorClass, 11);
    assert.equal(monster.hitPoints, 59);
    assert.equal(monster.hitDice, "7d10");
    assert.deepEqual(monster.speed, { walk: "40 ft." });
    assert.deepEqual(monster.attributes, {
      strength: 19,
      dexterity: 8,
      constitution: 16,
      intelligence: 5,
      wisdom: 7,
      charisma: 7,
    });
    assert.deepEqual(monster.saves, {});
    assert.deepEqual(monster.skills, {});
    assert.deepEqual(monster.conditionImmunities, []);
    assert.deepEqual(monster.damageResistances, []);
    assert.deepEqual(monster.damageResistances, []);
    assert.deepEqual(monster.senses, ["darkvision: 60 ft."]);
    assert.deepEqual(monster.languages, ["Common", "Giant"]);
    assert.equal(monster.challengeRating, 3);
    assert.deepEqual(monster.specialAbilities, [
      {
        name: "Keen Smell",
        description:
          "The ogre has advantage on Wisdom (Perception) checks that rely on smell.",
      },
      {
        name: "Labyrinthine Recall",
        description: "The ogre can perfectly recall any path it has traveled.",
      },
    ]);
    assert.deepEqual(monster.actions, [
      {
        name: "Multiattack",
        description: "The ogre makes two greatclub attacks.",
      },
      {
        name: "Greatclub",
        description:
          "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.",
      },
    ]);
  });

  it("Can convert a Kobold with delimited senses", () => {
    const monster = convert(KOBOLD);
    assert.deepEqual(monster.senses, [
      "darkvision 60 ft.",
      "passive Perception 8",
    ]);
    assert.deepEqual(monster.skills, { perception: 112 });
    assert.deepEqual(monster.actions, [
      {
        name: "Dagger",
        description:
          "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage.",
      },
    ]);
  });

  it("Can Convert a drake with object speed and separate saving throws", () => {
    const monster = convert(TWO_HEADED_DRAKE);
    assert.deepEqual(monster.speed, { walk: "30 ft.", fly: "60 ft." });
    assert.deepEqual(monster.saves, {
      dexterity: 3,
      wisdom: 4,
      constitution: 6,
    });
    assert.deepEqual(monster.languages, []);
    assert.deepEqual(monster.conditionImmunities, []);
    assert.deepEqual(monster.damageImmunities, ["fire"]);
    assert.deepEqual(monster.damageResistances, []);
  });

  it("Can conver a vampire with lots of different attributes", () => {
    const monster = convert(VAMPIRE);
    assert.equal(monster.name, "Vampire with Cursed Dagger");
    assert.equal(monster.size, "Medium");
    assert.equal(monster.type, "Undead");
    assert.equal(monster.subType, "Vampire");
    assert.equal(monster.alignment, "Chaotic Evil");
    assert.equal(monster.armorClass, 16);
    assert.equal(monster.hitPoints, 78);
    assert.equal(monster.hitDice, "12d8");
    assert.deepEqual(monster.speed, { walk: 30 });
    assert.deepEqual(monster.attributes, {
      strength: 16,
      dexterity: 18,
      constitution: 16,
      intelligence: 14,
      wisdom: 12,
      charisma: 18,
    });
    assert.deepEqual(monster.saves, {
      dexterity: 8,
      constitution: 6,
      wisdom: 4,
    });
    assert.deepEqual(monster.skills, { perception: 6, stealth: 8, arcana: 6 });
    assert.deepEqual(monster.damaveVulnerabilities, ["radiant"]);
    assert.deepEqual(monster.damageImmunities, ["poison"]);
    assert.deepEqual(monster.damageResistances, [
      "necrotic",
      "bludgeoning, piercing, and slashing from nonmagical weapons",
    ]);
    assert.deepEqual(monster.conditionImmunities, [
      "charmed",
      "exhaustion",
      "frightened",
      "paralyzed",
      "poisoned",
    ]);
    assert.deepEqual(monster.languages, ["Common", "Infernal", "Abyssal"]);
    assert.deepEqual(monster.specialAbilities, [
      {
        name: "Cursed Dagger",
        description:
          "The vampire carries a cursed dagger that can cast wizard spells. It has a +2 bonus to attack and damage rolls made with this magic weapon.",
      },
      {
        name: "Regeneration",
        description:
          "The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point.",
      },
      {
        name: "Spider Climb",
        description:
          "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      },
      {
        name: "Vampire Weaknesses",
        description:
          "The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage when it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
      },
    ]);
  });

  it("Can handle a dragon with legendary resistances", () => {
    const monster = convert(DRAGON);
    assert.equal(monster.name, "Ancient Blue Dragon");
    assert.equal(monster.hitDice, "26d20 + 208");
    assert.deepEqual(monster.speed, { fly: 80, swim: 40 });
    assert.deepEqual(monster.damageImmunities, ["Lightning"]);
    assert.deepEqual(monster.senses, [
      "Blindsight 60 ft.",
      "Darkvision 120 ft.",
      "Passive Perception 26",
    ]);

    assert.deepEqual(monster.specialAbilities, [
      {
        name: "Legendary Resistance (3/Day)",
        description:
          "If the dragon fails a saving throw, it can choose to succeed instead.",
      },
      {
        name: "Amphibious",
        description: "The dragon can breathe air and water.",
      },
      {
        name: "Actions",
        description:
          "The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The dragon regains spent legendary actions at the start of its turn.",
      },
    ]);
    assert.deepEqual(monster.actions, [
      {
        name: "Multiattack",
        description:
          "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      },
      {
        name: "Bite",
        description:
          "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage plus 14 (4d6) lightning damage.",
      },
      {
        name: "Claw",
        description:
          "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage.",
      },
      {
        name: "Tail",
        description:
          "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage.",
      },
      {
        name: "Frightful Presence",
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      },
      {
        name: "Lightning Breath (Recharge 5-6)",
        description:
          "The dragon exhales lightning in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 24 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one.",
      },
    ]);
    assert.deepEqual(monster.legendaryActions, [
      {
        name: "Detect",
        description: "The dragon makes a Wisdom (Perception) check.",
      },
      {
        name: "Tail Attack",
        description: "The dragon makes a tail attack.",
      },
      {
        name: "Wing Attack (Costs 2 Actions)",
        description:
          "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.",
      },
    ]);
  });
});

const GOBLIN_WITH_FRACTION =
  '{\n    "name": "Wise Goblin",\n    "size": "Small",\n    "type": "Humanoid (Goblinoid)",\n    "alignment": "Lawful Neutral",\n    "armor_class": 14,\n    "hit_points": 11,\n    "speed": "30 ft.",\n    "strength": 8,\n    "dexterity": 14,\n    "constitution": 10,\n    "intelligence": 16,\n    "wisdom": 18,\n    "charisma": 8,\n    "saving_throws": {\n        "dexterity": 4,\n        "intelligence": 5\n    },\n    "skills": {\n        "perception": 6,\n        "stealth": 4\n    },\n    "senses": "darkvision 60 ft., passive Perception 16",\n    "languages": "Common, Goblin",\n    "challenge_rating": 1/2,\n    "special_abilities": [\n        {\n            "name": "Nimble Escape",\n            "desc": "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."\n        }\n    ],\n    "actions": [\n        {\n            "name": "Rapier",\n            "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) piercing damage.",\n            "attack_bonus": 4,\n            "damage_dice": "1d8",\n            "damage_bonus": 1\n        },\n        {\n            "name": "Dagger",\n            "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage.",\n            "attack_bonus": 4,\n            "damage_dice": "1d4",\n            "damage_bonus": 2\n        }\n    ]\n}';

const VAMPIRE_WITH_PEG_LEG =
  '{    "name": "Vampire with a Peg Leg",    "size": "Medium",    "type": "Undead",    "subtype": "Vampire",    "alignment": "Lawful Evil",    "armor_class": 16,    "hit_points": 144,    "hit_dice": "18d8",    "speed": {        "walk": 30,        "climb": 30    },    "strength": 18,    "dexterity": 18,    "constitution": 18,    "intelligence": 18,    "wisdom": 18,    "charisma": 18,    "saving_throws": {        "strength": 9,        "dexterity": 9,        "constitution": 9,        "intelligence": 9,        "wisdom": 9,        "charisma": 9    },    "skills": {        "perception": 9,        "stealth": 9,        "intimidation": 9    },    "damage_vulnerabilities": "",    "damage_resistances": "necrotic; bludgeoning, piercing, and slashing from nonmagical weapons",    "damage_immunities": "poison",    "condition_immunities": "charmed, exhaustion, frightened, paralyzed, poisoned",    "senses": "darkvision 120 ft., passive Perception 19",    "languages": "Common, Infernal, Abyssal",    "challenge_rating": 10,    "special_abilities": [        {            "name": "Shapechanger",            "desc": "The vampire can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form."        },        {            "name": "Regeneration",            "desc": "The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point."        },        {            "name": "Spider Climb",            "desc": "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."        },        {            "name": "Vampire Weaknesses",            "desc": "The vampire has the following flaws:            -Forbiddance. The vampire can\'t enter a residence without an invitation from one of the occupants.            -Harmed by Running Water. The vampire takes 20 acid damage when it ends its turn in running water.            -Stake to the Heart. The vampire is destroyed if a piercing weapon made of wood is driven into its heart while it is incapacitated in its resting place.            -Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks."        },        {            "name": "Wall Walking",            "desc": "The vampire can walk through walls as if they were not there."        }    ]}';

describe("Preparsing", () => {
  it("can do basic JSON conversion", () => {
    assert.deepEqual(toJSON('{"hello": 12}'), { hello: 12 });
  });

  it("can handle GPT sending fractions thinking they are whole numbers", () => {
    try {
      JSON.parse(GOBLIN_WITH_FRACTION);
      assert.equal("bad json was let through", "yes it was");
    } catch (err) {
      //this should happen, the chatGPT json is bad
    }
    const json = toJSON(GOBLIN_WITH_FRACTION);
    console.warn(json);
    assert.equal(json.name, "Wise Goblin");
    assert.equal(json.challenge_rating, "1/2");
    const monster = convert(json);
    assert.equal(monster.name, "Wise Goblin");
    assert.equal(monster.challengeRating, "1/2");
  });

  it("can handle the peg leg", () => {
    const json = toJSON(VAMPIRE_WITH_PEG_LEG);
    const monster = convert(json);
    console.warn("FUCK YOU", monster);
  });
});
