export type SearchResults<T> = {
  page: number;
  size: number;
  total: number;
  content: T[];
};

export type MonsterSearchResults = SearchResults<Monster>;

export type NameAndDescription = {
  name: string;
  description?: string;
};

export type Attributes = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type Saves = Partial<Attributes>;

export type Attack = Partial<{
  type: string;
  rangeType: string;
  toHit: number;
  reach: string;
  target: string;
  damage: string;
  damageType: string;
  damageTwo: string;
  damageTwoType: string;
}>;

export type Action = NameAndDescription & {
  attack?: Attack;
};

export type Monster = {
  id?: string;
  name: string;
  size?: string;
  type?: string;
  subType?: string;
  alignment?: string;
  armorClass?: number;
  hitPoints?: number;
  hitDice?: string;
  speed?: { [key: string]: string | number };
  attributes: Abilities;
  saves: Saves;
  skills?: {
    [key: string]: number;
  };
  senses?: string[];
  damageVulnerabilities: string[];
  damageImmunities: string[];
  damageResistances: string[];
  conditionImmunities: string[];
  languages: string[];
  challengeRating: string;
  specialAbilities: NameAndDescription[];
  actions: Action[];
  legendaryActions: Action[];
};
