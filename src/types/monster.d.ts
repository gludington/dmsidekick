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

export type Monster = {
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
  damaveVulnerabilities: string[];
  damageImmunities: string[];
  damageResistances: string[];
  conditionImmunities: string[];
  languages: string[];
  challengeRating: string;
  specialAbilities: NameAndDescription[];
  actions: NameAndDescription[];
};
