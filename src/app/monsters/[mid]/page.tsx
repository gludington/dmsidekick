"use client";
import Loading from "../../Loading";
import { useFetchMonster } from "../../../hooks/monsters";
import MonsterView from "./monster";

export default function Page(props: { params: { mid: string } }) {
  const { data, isLoading } = useFetchMonster(props.params.mid);

  if (isLoading) {
    return <Loading />;
  }
  return <MonsterView monster={data} />;
}
