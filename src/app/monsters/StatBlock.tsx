import styles from "./statblock.module.css";
import { Transition } from "@headlessui/react";
import Loading from "../Loading";
import type { Monster } from "../../types/global";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import {
  EditableBlock,
  Plus,
  TextArea,
  TextField,
  Trash,
} from "./[mid]/components";
import { FieldArray, useFormikContext } from "formik";

function CreatureHeading({ onToggle }: { onToggle?: () => void }) {
  const { values: monster } = useFormikContext<PossiblyEditableMonster>();

  return (
    <>
      <div className={`${styles.creatureHeading}`}>
        <div>
          <EditableBlock
            editable={monster.editable}
            view={
              <div>
                <h1>{monster?.name}</h1>

                <h2>
                  {monster?.size} {monster?.type}, {monster.alignment}
                </h2>
              </div>
            }
            edit={
              <>
                <TextField name="name" label="Name" />
                <div className="grid grid-cols-3">
                  <TextField name="size" label="Size" />
                  <TextField name="type" label="Type" />
                  <TextField name="subType" label="Sub-Type" />
                </div>
              </>
            }
          />
        </div>
        {onToggle ? (
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none sm:hidden sm:h-10 sm:w-10"
            onClick={() => onToggle()}
          >
            <ChatBubbleLeftEllipsisIcon />
          </button>
        ) : null}
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

function TopStats() {
  const { values: monster } = useFormikContext<PossiblyEditableMonster>();

  return (
    <div className={styles.topStats}>
      <EditableBlock
        editable={monster.editable}
        view={
          <>
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
          </>
        }
        edit={
          <>
            <TextField name="armorClass" label="Armor Class" type="number" />
            <div className="flex gap-3">
              <TextField name="hitPoints" label="Hit Points" type="number" />
              <TextField name="hitDice" label="Hit Dice" />
            </div>
            <TextField name="speed" label="Speed" />
          </>
        }
      />
      <TaperedRule />
      <EditableBlock
        editable={monster.editable}
        view={
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
        }
        edit={
          <div className="flex gap-3">
            <TextField name="attributes.strength" label="STR" type="number" />
            <TextField name="attributes.dexterity" label="DEX" type="number" />
            <TextField
              name="attributes.constitution"
              label="CON"
              type="number"
            />
            <TextField
              name="attributes.intelligence"
              label="INT"
              type="number"
            />
            <TextField name="attributes.wisdom" label="WIS" type="number" />
            <TextField name="attributes.charisma" label="CHA" type="number" />
          </div>
        }
      />

      <TaperedRule />
      <div className={`${styles.propertyLine} ${styles.first}`}>
        <EditableBlock
          editable={monster.editable}
          view={
            <>
              <h4>Saving Throws</h4>
              <p>
                {savingThrow("STR", monster.saves.strength)}
                {savingThrow("DEX", monster?.saves.dexterity)}
                {savingThrow("CON", monster?.saves.constitution)}
                {savingThrow("INT", monster?.saves.intelligence)}
                {savingThrow("WIS", monster?.saves.wisdom)}
                {savingThrow("CHA", monster?.saves.charisma)}
              </p>
            </>
          }
          edit={
            <>
              <h4>Saving Throws (0 or blank to omit)</h4>
              <div className="flex gap-3">
                <TextField name="saves.strength" label="STR" type="number" />
                <TextField name="saves.dexterity" label="DEX" type="number" />
                <TextField
                  name="saves.constitution"
                  label="CON"
                  type="number"
                />
                <TextField
                  name="saves.intelligence"
                  label="INT"
                  type="number"
                />
                <TextField name="saves.wisdom" label="WIS" type="number" />
                <TextField name="saves.charisma" label="CHA" type="number" />
              </div>
            </>
          }
        />
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
  header,
  name,
  values,
  editable,
}: {
  header?: string;
  name: string;
  values: { name: string; desc?: string; description?: string }[];
  editable: boolean;
}) {
  if (!editable && (!values || values.length === 0)) {
    return null;
  }
  return (
    <EditableBlock
      editable={editable}
      view={
        <>
          {header ? <h3>{header}</h3> : null}
          {values.map((ability) => (
            <div key={ability.name} className={styles.propertyBlock}>
              <h4>{ability.name}</h4>{" "}
              <p>{ability.desc || ability.description}</p>
            </div>
          ))}
        </>
      }
      edit={
        <div className="grid grid-cols-edit-icon">
          <FieldArray name={name}>
            {(arrayHelpers) => (
              <>
                <h1>Abilities</h1>
                <div>
                  <Plus
                    onClick={() =>
                      arrayHelpers.push({ name: "", description: "" })
                    }
                  />
                </div>
                <div className="col-span-2">
                  {values?.map((spec, index) => (
                    <div
                      key={`${name}.${index}.name`}
                      className="grid grid-cols-edit-icon rounded-xl border-2 border-stat-block-rust p-2"
                    >
                      <div className="mx-2">
                        <TextField
                          name={`${name}.${index}.name`}
                          label="Name"
                        />
                      </div>
                      <div>
                        <Trash onClick={() => arrayHelpers.remove(index)} />
                      </div>
                      <div className="col-span-2 mx-2">
                        <TextArea
                          name={`${name}.${index}.description`}
                          label="Description"
                          rows={4}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </FieldArray>
        </div>
      }
    />
  );
}

export type PossiblyEditableMonster = Monster & { editable: boolean };

export default function StatBlock({
  isLoading,
  loadingText = "Loading Monster",
  onToggle,
}: {
  isLoading: boolean;
  loadingText?: string;
  onToggle?: () => void;
}) {
  const { values: monster } = useFormikContext<PossiblyEditableMonster>();
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
        <div
          className={`$styles.wide} absolute z-10 m-5 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-0 sm:w-1/2`}
        >
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
          <CreatureHeading onToggle={onToggle} />
          <TopStats />
          <ActionBlock
            name="specialAbilities"
            values={monster.specialAbilities}
            editable={monster.editable}
          />
        </div>
        <div className={styles.sectionRight}>
          <div className={styles.actions}>
            <ActionBlock
              header="Actions"
              name="actions"
              values={monster.actions}
              editable={monster.editable}
            />
          </div>
          <div className={styles.actions}>
            <ActionBlock
              header="Legendary Actions"
              name="legendaryActions"
              values={monster.legendaryActions}
              editable={monster.editable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
