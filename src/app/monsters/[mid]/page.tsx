"use client";

import { useFetchMonster } from "../../../hooks/monsters";
import StatBlock from "../StatBlock";

export default function Page(props: any) {
  const { data, isLoading } = useFetchMonster(props.params.mid);
  return <StatBlock monster={data} isLoading={isLoading} />;
}
