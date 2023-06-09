import { useAppSelector } from "../../app/hooks";

export const Employees = () => {
  const store = useAppSelector((s) => s);

  console.log(store);
  return <h1>Employees</h1>;
};
