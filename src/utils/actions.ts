import logger from "../server/common/logger";
import { Attack } from "../types/global";

const ATTACK = /attack/i;

//reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage plus 2d6 fire damage.
const ATTACK_TYPE = /(melee|ranged) (weapon|spell) (attack)/i;
const TO_HIT = /(\+?\d+) to hit/i;
const REACH = /(reach|range) (touch|\d+ [A-Za-z0-0]*)/i;
const TARGET = /[A-Za-z]* targets?/i;
const DAMAGE = /Hit: (\d+ )?\((.*?)\) ([A-Za-z]+) damage/i;
const DAMAGE_TWO = /plus:? (\d+ )?\(?(.*?)\)? ([A-Za-z]+) damage/i;

export function parseAction(action?: string): Attack | undefined {
  if (!action) {
    return undefined;
  }
  if (ATTACK.test(action)) {
    const typeResults = ATTACK_TYPE.exec(action);

    if (typeResults === null) {
      return undefined;
    }
    let type = {};
    type = { rangeType: typeResults[1], type: typeResults[2] };

    const toHitResults = TO_HIT.exec(action);
    if (toHitResults !== null && toHitResults[1]) {
      try {
        type = { ...type, toHit: parseInt(toHitResults[1]) };
      } catch (err) {
        logger.warn(`Non integer passed for toHit in action "${action}"`);
      }
    }

    const reachResults = REACH.exec(action);
    if (reachResults !== null) {
      type = { ...type, reach: reachResults[2] };
    }

    const targetResults = TARGET.exec(action);
    if (targetResults !== null) {
      type = { ...type, target: targetResults[0] };
    }

    const damageResults = DAMAGE.exec(action);
    if (damageResults !== null) {
      type = {
        ...type,
        damage: damageResults[2],
        damageType: damageResults[3],
      };
    }

    const damageTwoResults = DAMAGE_TWO.exec(action);
    if (damageTwoResults !== null) {
      console.warn(damageTwoResults);
      type = {
        ...type,
        damageTwo: damageTwoResults[2],
        damageTwoType: damageTwoResults[3],
      };
    }
    return type;
  }
  return undefined;
}
