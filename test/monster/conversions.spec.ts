import { assert } from "chai";
import deepEqual from "deep-equal-in-any-order";
import { convert } from "../../src/utils/conversions";

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
      desc: "The ogre has advantage on Wisdom (Perception) checks that rely on smell.",
    },
    {
      name: "Labyrinthine Recall",
      desc: "The ogre can perfectly recall any path it has traveled.",
    },
  ],
  actions: [
    {
      name: "Multiattack",
      desc: "The ogre makes two greatclub attacks.",
    },
    {
      name: "Greatclub",
      desc: "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.",
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
      desc: "While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
    },
  ],
  actions: [
    {
      name: "Dagger",
      desc: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage.",
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
      desc: "The drake has two heads, each of which can breathe fire out of one head and cold out of the other.",
    },
  ],
  actions: [
    {
      name: "Multiattack",
      desc: "The drake makes two attacks: one with its bite and one with its claws.",
    },
    {
      name: "Bite",
      desc: "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage.",
      attack_bonus: 7,
      damage_dice: "2d10",
      damage_bonus: 4,
    },
    {
      name: "Claws",
      desc: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.",
      attack_bonus: 7,
      damage_dice: "2d6",
      damage_bonus: 4,
    },
    {
      name: "Fire Breath (Recharge 5-6)",
      desc: "The drake exhales fire in a 15-foot cone. Each creature in that area must make a DC 14 Dexterity saving throw, taking 42 (12d6) fire damage on a failed save, or half as much damage on a successful one.",
      attack_bonus: 0,
      damage_dice: "12d6",
    },
    {
      name: "Cold Breath (Recharge 5-6)",
      desc: "The drake exhales cold in a 15-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) cold damage on a failed save, or half as much damage on a successful one.",
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
      desc: "The vampire carries a cursed dagger that can cast wizard spells. It has a +2 bonus to attack and damage rolls made with this magic weapon.",
    },
    {
      name: "Regeneration",
      desc: "The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point.",
    },
    {
      name: "Spider Climb",
      desc: "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
    },
    {
      name: "Vampire Weaknesses",
      desc: "The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage when it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
    },
  ],
};
describe("Parsing Tests Tests", () => {
  it("Can convert a basic monster", () => {
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

  it("Can convert a monster with delimited senses", () => {
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

  it("Can Convert a monster with object speed and separate saving throws", () => {
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
});
