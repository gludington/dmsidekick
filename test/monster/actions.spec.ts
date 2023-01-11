import { assert } from "chai";
import { parseAction } from "../../src/utils/actions";

describe("Parsing Action Strings", () => {
  it("can convert a flaming greatsword", () => {
    assert.deepEqual(
      parseAction(
        "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage plus 2d6 fire damage."
      ),
      {
        type: "Weapon",
        rangeType: "Melee",
        reach: "5 ft",
        target: "one target",
        toHit: 6,
        damage: "2d6 + 6",
        damageType: "slashing",
        damageTwo: "2d6",
        damageTwoType: "fire",
      }
    );
  });

  it("can convert our dragon bite", () => {
    assert.deepEqual(
      parseAction(
        "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 7 (2d6) fire damage."
      ),
      {
        type: "Weapon",
        rangeType: "Melee",
        reach: "15 ft",
        target: "one target",
        toHit: 14,
        damage: "2d10 + 8",
        damageType: "piercing",
        damageTwo: "2d6",
        damageTwoType: "fire",
      }
    );
  });
  it("can convert our dragon claw", () => {
    assert.deepEqual(
      parseAction(
        "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      ),
      {
        type: "Weapon",
        rangeType: "Melee",
        reach: "10 ft",
        target: "one target",
        toHit: 14,
        damage: "2d6 + 8",
        damageType: "slashing",
      }
    );
  });

  it("can convert our dragon tail", () => {
    assert.deepEqual(
      parseAction(
        "Melee Weapon Attack: +14 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      ),
      {
        type: "Weapon",
        rangeType: "Melee",
        reach: "20 ft",
        target: "one target",
        toHit: 14,
        damage: "2d8 + 8",
        damageType: "bludgeoning",
      }
    );
  });
});
