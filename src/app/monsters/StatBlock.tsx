import styles from "./statblock.module.css";
import { Transition } from "@headlessui/react";
import Loading from "../Loading";
import type { Monster } from "../../types/global";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import type { TextFieldProps } from "./[mid]/components";
import {
  EditableBlock,
  Plus,
  TextArea,
  TextField,
  Trash,
} from "./[mid]/components";
import {
  FieldArray,
  FormikProvider,
  useFormik,
  useFormikContext,
} from "formik";
import { useEffect, useMemo, useRef } from "react";

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
                <div className="grid grid-cols-4 gap-2">
                  <TextField name="size" label="Size" addClass="text-sm" />
                  <TextField name="type" label="Type" addClass="text-sm" />
                  <TextField
                    name="subType"
                    label="Sub-Type"
                    addClass="text-sm"
                  />
                  <TextField
                    name="alignment"
                    label="Alignemnt"
                    addClass="text-sm"
                  />
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

function useComponentWillUnmount(cleanupCallback: () => void) {
  const callbackRef = useRef(cleanupCallback);
  callbackRef.current = cleanupCallback; // always up to date
  useEffect(() => {
    return () => callbackRef.current();
  }, []);
}

function MapSubForm({
  header,
  nameLabel,
  valueLabel,
  values,
  typeProps,
  onClose,
}: {
  header: string;
  nameLabel: string;
  valueLabel: string;
  values: { [key: string]: string | number };
  typeProps?: TextFieldProps;
  onClose: (values: { [key: string]: string | number }) => void;
}) {
  const arr = useMemo(
    () =>
      Object.keys(values).map((name) => {
        return { name: name, value: values[name] };
      }),
    [values]
  );
  const formik = useFormik({
    initialValues: { arr: arr },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => {},
  });

  useComponentWillUnmount(() => {
    const toSubmit: { [key: string]: string | number } = {};
    formik.values.arr.forEach((val) => {
      if (val.name?.length && val.value && String(val.value).length) {
        toSubmit[val.name] = val.value;
      }
    });
    onClose(toSubmit);
  });

  return (
    <FormikProvider value={formik}>
      <FieldArray name="arr">
        {(arrayHelpers) => (
          <>
            <div className="grid grid-cols-edit-icon">
              <h4>{header}</h4>
              <div>
                <Plus
                  onClick={() => {
                    arrayHelpers.push({ name: "", value: "" });
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-edit-icon">
              {formik.values.arr.map((spec, index) => (
                <>
                  <div className="grid grid-cols-2">
                    <TextField
                      key={`${spec}_${index}.name`}
                      name={`arr[${index}].name`}
                      label={nameLabel}
                      onChange={(evt) => {
                        formik.setFieldValue(
                          `arr[${index}].name`,
                          evt.currentTarget.value
                        );
                      }}
                    />
                    <TextField
                      key={`${spec}_${index}.value`}
                      name={`arr[${index}].value`}
                      label={valueLabel}
                      onChange={(evt) => {
                        formik.setFieldValue(
                          `arr[${index}].value`,
                          evt.currentTarget.value
                        );
                      }}
                      {...typeProps}
                    />
                  </div>
                  <Trash onClick={() => arrayHelpers.remove(index)} />
                </>
              ))}
            </div>
          </>
        )}
      </FieldArray>
    </FormikProvider>
  );
}

function TopStats() {
  const { values: monster, setFieldValue } =
    useFormikContext<PossiblyEditableMonster>();

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
            <MapSubForm
              header="Speed"
              nameLabel="Type"
              valueLabel="Speed"
              values={monster.speed || {}}
              onClose={(values: { [key: string]: string | number }) => {
                setFieldValue("speed", values);
              }}
            />
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
              <p className="px-2">
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
        <EditableBlock
          editable={monster.editable}
          view={
            <>
              <h4>Skills</h4> <p>{listNumberMap(monster?.skills)}</p>
            </>
          }
          edit={
            <>
              <MapSubForm
                header="Skills"
                nameLabel="Skill"
                valueLabel="Bonus"
                values={monster.skills || {}}
                onClose={(values: { [key: string]: string | number }) => {
                  setFieldValue("skills", values);
                }}
                typeProps={{ type: "number" }}
              />
            </>
          }
        />
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
        <h4>Senses</h4> <p>{list(monster?.senses)}</p>
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
  values: {
    name: string;
    desc?: string;
    description?: string;
    attack?: {
      rangeType: string;
      type: string;
      target: string;
      toHit: number;
      damage: string;
      damageType: string;
      damageTwo?: string;
      damageTwoType?: string;
    };
  }[];
  editable: boolean;
}) {
  const formik = useFormikContext();
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
                      <div>
                        <label
                          className="px-2"
                          htmlFor={`${name}.${index}.isAttack`}
                        >
                          Is Attack:
                        </label>
                        <input
                          id={`${name}.${index}.isAttack`}
                          type="checkbox"
                          checked={Boolean(spec.attack)}
                          onChange={(evt) => {
                            console.warn(evt.target.checked);
                            if (evt.target.checked) {
                              formik.setFieldValue(`${name}.${index}.attack`, {
                                rangeType: "Melee",
                                type: "Weapon",
                                target: "One target",
                                toHit: 0,
                                damage: "1d6",
                              });
                            } else {
                              formik.setFieldValue(
                                `${name}.${index}.attack`,
                                undefined
                              );
                            }
                          }}
                        />
                      </div>

                      {spec.attack ? (
                        <div className="col-span-2 mx-2 grid grid-cols-3">
                          <TextField
                            name={`${name}.${index}.attack.rangeType`}
                            label="Range"
                          />
                          <TextField
                            name={`${name}.${index}.attack.type`}
                            label="Type"
                          />
                          <TextField
                            name={`${name}.${index}.attack.target`}
                            label="Target"
                          />
                          <TextField
                            name={`${name}.${index}.attack.toHit`}
                            label="To Hit"
                            type="number"
                          />
                          <TextField
                            name={`${name}.${index}.attack.damage`}
                            label="Damage"
                          />
                          <TextField
                            name={`${name}.${index}.attack.damageType`}
                            label="Type"
                          />
                          <div></div>
                          <TextField
                            name={`${name}.${index}.attack.damageTwo`}
                            label="Damage Two"
                          />
                          <TextField
                            name={`${name}.${index}.attack.damageTwoType`}
                            label="Damage Two Type"
                          />
                        </div>
                      ) : null}
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
