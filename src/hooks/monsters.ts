import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import type { Monster } from "../types/monster";

const MAX_ATTEMPTS = 20;
const GET_INTERVAL = 4000;

export const DEFAULT_MONSTER: Monster = {
  name: "DM Sidekick",
  size: "Small",
  type: "Construct",
  alignment: "Lawful Neutral",
  armorClass: 10,
  speed: { walk: "5ft" },
  hitPoints: 7,
  attributes: {
    strength: 8,
    dexterity: 10,
    constitution: 6,
    intelligence: 18,
    wisdom: 12,
    charisma: 20,
  },
  saves: {
    strength: -4,
  },
  skills: {
    Persuasion: 5,
    Deception: -2,
  },
  damageResistances: [],
  damageImmunities: [],
  conditionImmunities: ["Shame"],
  senses: ["Common"],
  languages: ["Common", "Java", "Typescript"],
  challengeRating: "1/64",
  damageVulnerabilities: [],
  specialAbilities: [
    {
      name: "Crash",
      description:
        "Upon getting no response or bad response back from the AI, DM Sidekick can panic and crash",
    },
  ],
  actions: [
    {
      name: "Chat",
      description: "DM Sidekick can hold a conversation with a user",
    },
    {
      name: "Build",
      description:
        "DM Sidekick can generate a Stat Block from the user's imput.  This may take 3-8 rounds, during which time DM Sidekick must maintain concentration",
    },
  ],
  legendaryActions: [],
};

export const useFetchMonster = (id: string | undefined) => {
  const monsterRef = useRef<Monster>(DEFAULT_MONSTER);
  const counterRef = useRef<number>(0);
  const queryClient = useQueryClient();
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    counterRef.current = 1;
    queryClient.invalidateQueries(["getMonster", id]);
  }, [id, queryClient]);
  const [isFetching, setIsFetching] = useState(false);
  useQuery(
    ["getMonster", id],
    async () => {
      setIsError(false);
      if (id) {
        setIsFetching(true);
        return await axios
          .get(`/api/monsters/${id}`)
          .then((response) => response.data);
      } else {
        monsterRef.current = DEFAULT_MONSTER;
        counterRef.current = 1;
        return { id: null, complete: true, monster: DEFAULT_MONSTER };
      }
    },
    {
      refetchInterval: (data) => {
        return !data || data.complete || counterRef.current > MAX_ATTEMPTS
          ? -1
          : GET_INTERVAL;
      },
      onSuccess: (data) => {
        if (data.complete && data.monster) {
          monsterRef.current = data.monster;
          setIsFetching(false);
          setIsError(false);
        }
      },
      onSettled: () => {
        counterRef.current = counterRef.current + 1;
        if (counterRef.current > MAX_ATTEMPTS) {
          setIsError(true);
          setIsFetching(false);
        }
      },
    }
  );

  return {
    id,
    data: monsterRef.current,
    isLoading: isFetching,
    isError,
  };
};
