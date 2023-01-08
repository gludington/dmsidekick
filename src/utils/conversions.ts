import type {
  Action,
  Attack,
  Monster,
  NameAndDescription,
} from "../types/monster";
import { parseAction } from "./actions";

export function toJSON(input: string): any {
  const val = input.replaceAll(/: ?(\d+\/\d+)/g, ': "$1"');
  return JSON.parse(val);
}

function toList(
  value: string | string[] | { [key: string]: any } | undefined | null
): string[] {
  if (!value) {
    return [];
  }
  if (typeof value === "string") {
    return value.length === 0 ? [] : [value];
  }
  if (Array.isArray(value)) {
    return value;
  }

  return Object.keys(value).map((key) => `${key}: ${value[key]}`);
}

function toListFromDelimited(
  value: string | string[] | { [key: string]: any } | undefined | null,
  delimiter: string
) {
  if (typeof value === "string") {
    if (value.indexOf(delimiter) !== -1) {
      return toList(value.split(delimiter).map((val) => val.trim()));
    }
  }
  return toList(value);
}

function toNameAndDescription(
  input: {
    name: string;
    desc?: string;
    description?: string;
  }[]
): NameAndDescription[] {
  return input.map(
    (spec: { name: string; desc?: string; description?: string }) => {
      return { name: spec.name, description: spec.desc || spec.description };
    }
  );
}

function oneOf(...vals: any[]) {
  return vals.find((val) => !!val);
}

function saves(input: any) {
  const saves: any = {};

  const strength = oneOf(
    input["strength_save"],
    input["saving_throws"]?.["strength"]
  );
  if (strength) {
    saves.strength = strength;
  }
  const dexterity = oneOf(
    input["dexterity_save"],
    input["saving_throws"]?.["dexterity"]
  );
  if (dexterity) {
    saves.dexterity = dexterity;
  }
  const constitution = oneOf(
    input["constitution_save"],
    input["saving_throws"]?.["constitution"]
  );
  if (constitution) {
    saves.constitution = constitution;
  }
  const intelligence = oneOf(
    input["intelligence_save"],
    input["saving_throws"]?.["intelligence"]
  );
  if (intelligence) {
    saves.intelligence = intelligence;
  }
  const wisdom = oneOf(
    input["wisdom_save"],
    input["saving_throws"]?.["wisdom"]
  );
  if (wisdom) {
    saves.wisdom = wisdom;
  }
  const charisma = oneOf(
    input?.["charisma_save"],
    input["saving_throws"]?.["charisma"]
  );
  if (charisma) {
    saves.charisma = charisma;
  }

  return saves;
}

function skills(input: any) {
  const skills = input.skills || {};
  if (!skills.perception && input.perception) {
    skills.perception = input.perception;
  }
  return skills;
}

function toActions(input: any): Action[] {
  if (!input) {
    return [];
  }
  const bases = toNameAndDescription(input);
  return bases.map((base) => {
    const action = parseAction(base.description);
    if (action) {
      return { ...base, attack: action };
    } else {
      return base;
    }
  });
}

function actions(input: any): Action[] {
  return toActions(input["actions"]);
}

function legendaryActions(input: any): Action[] {
  return toActions(input["legendary_actions"]);
}

function specialAbilities(input: any): NameAndDescription[] {
  if (input["special_abilities"]) {
    return toNameAndDescription(input["special_abilities"]);
  }
  return [];
}

export function convert(input: any): Monster {
  const monster: Monster = {
    name: input.name,
    size: input.size,
    type: input.type,
    subType: input.subtype,
    alignment: input.alignment,
    armorClass: input.armor_class,
    hitPoints: input.hit_points,
    hitDice: input.hit_dice,
    speed: input.speed,
    attributes: {
      strength: input.strength,
      dexterity: input.dexterity,
      constitution: input.constitution,
      intelligence: input.intelligence,
      wisdom: input.wisdom,
      charisma: input.charisma,
    },
    saves: saves(input),
    skills: skills(input),
    conditionImmunities: toListFromDelimited(input.condition_immunities, ","),
    damageVulnerabilities: toList(input.damage_vulnerabilities),
    damageImmunities: toList(input.damage_immunities),
    damageResistances: toListFromDelimited(input.damage_resistances, ";"),
    senses: toListFromDelimited(input.senses, ","),
    languages: toListFromDelimited(input.languages, ","),
    challengeRating: input.challenge_rating,
    specialAbilities: specialAbilities(input),
    actions: actions(input),
    legendaryActions: legendaryActions(input),
  };

  return monster;
}
