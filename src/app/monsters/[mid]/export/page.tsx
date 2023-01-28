"use client";

import { FormikProvider, useFormik } from "formik";
import { useFetchMonster } from "../../../../hooks/monsters";
import type { Monster } from "../../../../types/global";
import type { PossiblyEditableMonster } from "../../StatBlock";
import StatBlock from "../../StatBlock";

export default function Page(props: any) {
  const { data: monster, isLoading } = useFetchMonster(props.params.mid);
  const formik = useFormik<PossiblyEditableMonster>({
    initialValues: { editable: false, ...monster },
    onSubmit: (values: Monster) => console.warn(values),
  });
  return (
    <FormikProvider value={formik}>
      <StatBlock isLoading={isLoading} />
    </FormikProvider>
  );
}
