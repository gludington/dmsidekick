/* eslint-disable */
var generateUUID = (function () {
    "use strict";

    var a = 0,
      b = [];
    return function () {
      var c = new Date().getTime() + 0,
        d = c === a;
      a = c;
      for (var e = new Array(8), f = 7; 0 <= f; f--) {
        e[f] =
          "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(
            c % 64
          );
        c = Math.floor(c / 64);
      }
      c = e.join("");
      if (d) {
        for (f = 11; 0 <= f && 63 === b[f]; f--) {
          b[f] = 0;
        }
        b[f]++;
      } else {
        for (f = 0; 12 > f; f++) {
          b[f] = Math.floor(64 * Math.random());
        }
      }
      for (f = 0; 12 > f; f++) {
        c +=
          "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(
            b[f]
          );
      }
      return c;
    };
  })(),
  generateRowID = function () {
    "use strict";
    return generateUUID().replace(/_/g, "Z");
  };
/* end from the aaron */
function getAttribute(char, name) {
  const attributes = findObjs({
    _type: "attribute",
    _characterid: char.id,
    name: name,
  });
  if (attributes.length > 0) {
    const attarr = attributes.filter((att) => att.get("name") === "name");
    if (attarr.length > 0) {
      return attarr[0];
    }
  }
  return undefined;
}
function createOrSetAttribute(char, name, value, max) {
  let att = getAttribute(char, name);
  if (value !== undefined && value != null) {
    if (!att) {
      att = createObj("attribute", {
        name: name,
        current: 0,
        max: 0,
        _characterid: char.id,
      });
    }
    //does not appear to recalculate unless you double set
    att.setWithWorker({
      current: 1,
      max: null,
    });

    att.setWithWorker({
      current: value,
      max: max === undefined ? null : max,
    });
  }
  return att;
}

function createNPC(name) {
  const char = createObj("character", {
    name: name,
  });
  createOrSetAttribute(char, "npc", 1);
  return char;
}

function join(prop) {
  if (!prop) {
    return "";
  }
  return prop.join(", ");
}

function createAction(npc, action, stem) {
  const uuid = generateUUID();
  createOrSetAttribute(npc, `${stem}_{uuid}_name`, action.name);
  createOrSetAttribute(npc, `${stem}_{uuid}_description`, action.description);

  if (action.attack) {
    createOrSetAttribute(npc, `${stem}_{uuid}_attack_flag`, "on");
    if (action.attack.rangeType) {
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_type`,
        action.attack.rangeType
      );
    }
    if (action.attack.toHit) {
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_tohit`,
        action.attack.toHit
      );
    }
    if (action.attack.reach) {
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_range`,
        action.attack.reach
      );
    }
    if (action.attack.target) {
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_target`,
        action.attack.target
      );
    }

    if (action.attack.damage) {
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_damage`,
        action.attack.damage
      );
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_crit`,
        action.attack.damage
      );
    }
    if (action.attack.damageType) {
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_damagetype`,
        action.attack.damageType
      );
    }
    if (action.attack.damageTwo) {
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_damage2`,
        action.attack.damageTwo
      );
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_crit2`,
        action.attack.damage
      );
    }
    if (action.attack.damageTwoType) {
      createOrSetAttribute(
        npc,
        `${stem}_{uuid}_attack_damagetype2`,
        action.attack.damageTwo
      );
    }
  }
}
on("chat:message", function (msg) {
  log("-------");
  if (msg.type === "api" && msg.content.startsWith("!ack")) {
    const char = findObjs({
      name: "Ancient Blue Dragon",
    });
    const attributes = findObjs({
      _characterid: "-NLCshx4aiZMIzFfDwZa",
    });
    log(attributes);
    log(findObjs({}));
  }
  if (msg.type === "api" && msg.content.startsWith("!dmsidekick")) {
    const input = msg.content.substring("!dmsidekick".length).trim();
    const json = JSON.parse(input);
    const npc = createNPC(json.name);
    createOrSetAttribute(npc, "npc_name", json.name);
    createOrSetAttribute(
      npc,
      "npc_type",
      `${json.type}${json.subType ? ` ${json.subType}` : ""}${
        json.alignment ? `, ${json.alignment}` : ""
      }`
    );
    createOrSetAttribute(npc, "npc_ac", json.armorClass);
    createOrSetAttribute(npc, "hp", json.hitPoints, json.hitPoints);
    createOrSetAttribute(npc, "npc_hpformula", json.hitDice);
    Object.keys(json.attributes).forEach((att) => {
      createOrSetAttribute(npc, att, json.attributes[att]);
    });
    let speed = "";
    Object.keys(json.speed).forEach(
      (move) => (speed += move + " " + json.speed[move] + " ")
    );
    createOrSetAttribute(npc, "npc_speed", speed.trim());

    Object.keys(json.saves).forEach((att) => {
      createOrSetAttribute(
        npc,
        `npc_${att.substring(0, 3)}_save`,
        json.attributes[att]
      );
      createOrSetAttribute(
        npc,
        `npc_${att.substring(0, 3)}_save_base`,
        json.attributes[att]
      );
      createOrSetAttribute(
        npc,
        `npc_${att.substring(0, 3)}_save_flag`,
        json.attributes[att]
      );
    });
    createOrSetAttribute(npc, "npc_senses", join(json.senses));
    createOrSetAttribute(npc, "npc_languages", join(json.languages));
    createOrSetAttribute(
      npc,
      "npc_vulnerabilities",
      join(json.damageVulnerabilities)
    );
    createOrSetAttribute(npc, "npc_resistances", join(json.damageResistances));
    createOrSetAttribute(npc, "npc_immunities", join(json.damageImmunities));
    createOrSetAttribute(
      npc,
      "npc_condition_immunities",
      join(json.conditionImmunities)
    );

    createOrSetAttribute(npc, "npc_challenge", json.challengeRating);
    createOrSetAttribute(npc, "npc_options-flag", "0");
    createOrSetAttribute(npc, "l1mancer_status", "completed");
    json.specialAbilities.forEach((spec) => {
      const uuid = generateUUID();
      createOrSetAttribute(npc, `repeating_npctrait_${uuid}_name`, spec.name);
      createOrSetAttribute(
        npc,
        `repeating_npctrait_${uuid}_description`,
        spec.description
      );
    });
    json.actions.forEach((action) => {
      createAction(npc, action, "repeating_npcaction");
    });
    json.legendaryActions.forEach((action) => {
      createAction(npc, action, "repeating_npcaction-l");
    });
  }
  log("--------");
});
