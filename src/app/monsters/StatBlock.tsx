import styles from "./statblock.module.css";
import { Transition } from "@headlessui/react";
import Loading from "../Loading";
import type { Monster } from "../../types/global";

function CreatureHeading({ monster }: { monster: Monster }) {
  return (
    <>
      <div className={styles.creatureHeading}>
        <h1>{monster?.name}</h1>
        <h2>
          {monster?.size} {monster?.type}, {monster.alignment}
        </h2>
      </div>
      <svg height="5" width="100%" className={styles.taperedRule}>
        <polyline points="0,0 400,2.5 0,5"></polyline>
      </svg>
      <div className={styles.topStats}></div>
    </>
  );
}

function mod(value?: number): string {
  if (!value) return "";
  const mod = (value - 10) / 2;
  return `${value} (${value < 10 ? Math.floor(mod) : "+" + Math.floor(mod)})`;
}

function listOrMap(value: any): string {
  try {
    return list(value);
  } catch (err) {
    return listMap(value);
  }
}
function list(value: string | string[] | undefined | null): string {
  if (!value) {
    return ":";
  }
  if (typeof value === "string") {
    return `: ${value}`;
  }
  if (value.length === 0) return ":";

  return `: ${value.join(", ")}`;
}

function listMap(
  value: string | { [key: string]: any } | undefined | null
): string {
  if (!value) {
    return ":";
  }
  if (typeof value === "string") {
    return `: ${value}`;
  }
  return `: ${Object.keys(value)
    .map((key) => {
      return key + " " + value[key];
    })
    .join(", ")}`;
}

function listNumberMap(
  value: string | { [key: string]: number } | undefined | null
): string {
  if (!value) {
    return ":";
  }
  if (typeof value === "string") {
    return `: ${value}`;
  }
  return `: ${Object.keys(value)
    .filter((key) => value[key] !== 0)
    .map((key) => {
      const val = value?.[key] || 0;
      return key + " " + (val < 0 ? "" : "+") + val;
    })
    .join(", ")}`;
}

function savingThrow(ability: string, value: number | undefined): string {
  if (!value) {
    return "";
  }
  return `${ability} ${value < 0 ? "" : "+"}${value} `;
}

function TaperedRule() {
  return (
    <svg height="5" width="100%" className={styles.taperedRule}>
      <polyline points="0,0 400,2.5 0,5"></polyline>
    </svg>
  );
}

function TopStats({ monster }: { monster: Monster }) {
  return (
    <div className={styles.topStats}>
      <div className={`${styles.propertyLine} ${styles.first}`}>
        <h4>Armor Class</h4> <p>{monster.armorClass}</p>
      </div>
      <div className={styles.propertyLine}>
        <h4>Hit Points</h4>{" "}
        <p>
          {monster?.hitPoints}{" "}
          {monster?.hitDice ? `(${monster.hitDice})` : null}
        </p>
      </div>
      <div className={`${styles.propertyLine} ${styles.last}`}>
        <h4>Speed</h4> <p>{listMap(monster?.speed)}</p>
      </div>
      <TaperedRule />
      <div className={styles.abilities}>
        <div className={styles.abilityStrength}>
          <h4>STR</h4> <p>{mod(monster?.attributes.strength)}</p>
        </div>
        <div className={styles.abilityDexterity}>
          <h4>DEX</h4>
          <p>{mod(monster?.attributes.dexterity)}</p>
        </div>
        <div className={styles.abilityConstitution}>
          <h4>CON</h4>
          <p>{mod(monster?.attributes.constitution)}</p>
        </div>
        <div className={styles.abilityIntelligence}>
          <h4>INT</h4>
          <p>{mod(monster?.attributes.intelligence)}</p>
        </div>
        <div className={styles.abilityWisdom}>
          <h4>WIS</h4>
          <p>{mod(monster?.attributes.wisdom)}</p>
        </div>
        <div className={styles.abilityCharisma}>
          <h4>CHA</h4>
          <p>{mod(monster?.attributes.charisma)}</p>
        </div>
      </div>
      <TaperedRule />
      <div className={`${styles.propertyLine} ${styles.first}`}>
        <h4>Saving Throws</h4>{" "}
        <p>
          {savingThrow("STR", monster.saves.strength)}
          {savingThrow("DEX", monster?.saves.dexterity)}
          {savingThrow("CON", monster?.saves.constitution)}
          {savingThrow("INT", monster?.saves.intelligence)}
          {savingThrow("WIS", monster?.saves.wisdom)}
          {savingThrow("CHA", monster?.saves.charisma)}
        </p>
      </div>
      <div className={styles.propertyLine}>
        <h4>Skills</h4> <p>{listNumberMap(monster?.skills)}</p>
      </div>
      <div className={`${styles.propertyLine}`}>
        <h4>Damage Resistances</h4> <p>{list(monster?.damageResistances)} </p>
      </div>
      <div
        className={`${styles.propertyLine}${
          monster?.damageResistances?.length > 0 ? ` ${styles.first}` : ""
        }`}
      >
        <h4>Damage Immunities</h4> <p>{list(monster?.damageImmunities)} </p>
      </div>
      <div className={styles.propertyLine}>
        <h4>Condition Immunities</h4>{" "}
        <p>{list(monster?.conditionImmunities)}</p>
      </div>
      <div className={styles.propertyLine}>
        <h4>Senses</h4>{" "}
        <p>
          {list(monster?.senses)}
          {/*monster?.perception
            ? `passive Perception ${monster.perception}`
  : ""*/}
        </p>
      </div>
      <div className={styles.propertyLine}>
        <h4>Languages</h4> <p>{list(monster?.languages)}</p>
      </div>
      <div className={`${styles.propertyLine} ${styles.last}`}>
        <h4>Challenge</h4> <p>: {monster?.challengeRating}</p>
      </div>
      <TaperedRule />
    </div>
  );
}

function ActionBlock({
  values,
}: {
  values: { name: string; desc?: string; description?: string }[];
}) {
  if (!values || values.length === 0) {
    return null;
  }
  return (
    <>
      {values.map((ability) => (
        <div key={ability.name} className={styles.propertyBlock}>
          <h4>{ability.name}</h4> <p>{ability.desc || ability.description}</p>
        </div>
      ))}
    </>
  );
}

export default function StatBlock({
  monster,
  isLoading,
  loadingText = "Loading Monster",
}: {
  monster: Monster;
  isLoading: boolean;
  loadingText?: string;
}) {
  console.debug("stat block", monster);
  return (
    <div className="pb-203 flex h-[calc(100vh-40px)] flex-1 flex-col">
      <Transition
        show={isLoading}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute z-10 m-5 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-0">
          <Loading text={loadingText} />
        </div>
      </Transition>
      <div
        className={`${styles.statBlock} ${styles.wide}${
          isLoading ? " opacity-10" : ""
        }`}
      >
        <hr className={styles.orangeBorder} />
        <div className={styles.sectionLeft}>
          <CreatureHeading monster={monster} />
          <TopStats monster={monster} />
          <ActionBlock values={monster.specialAbilities} />
        </div>
        <div className={styles.sectionRight}>
          {monster?.actions.length > 0 ? (
            <div className={styles.actions}>
              <h3>Actions</h3>
              <ActionBlock values={monster.actions} />
            </div>
          ) : null}
          {monster?.legendaryActions?.length > 0 ? (
            <div className={styles.actions}>
              <h3>Legendary Actions</h3>
              <ActionBlock values={monster.legendaryActions} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
