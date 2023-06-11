import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "@prisma/client";
import { Row } from "antd";
import { Paths } from "../../paths";
import { useAddEmployeeMutation } from "../../app/services/employees";
import { useAppSelector } from "../../app/hooks";
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { selectUser } from "../../features/auth/authSlice";
import { Layout } from "../../components/layout";
import { EmployeeForm } from "../../components/employeeForm";

export const AddEmployee = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const handleAddEmployee = async (data: Employee) => {
    try {
      await addEmployee(data).unwrap();

      navigate(`${Paths.status}/created`);
    } catch (err) {
      const maybeError = isErrorWithMessage(err);

      if (maybeError) {
        setError(err.data.message);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };
  const [addEmployee] = useAddEmployeeMutation();

  useEffect(() => {
    if (!user) {
      navigate(Paths.login);
    }
  }, [navigate, user]);

  return (
    <Layout>
      <Row align='middle' justify='center'>
        <EmployeeForm
          title='Добавить сотрудники'
          btnTExt='Добавить'
          onFinish={handleAddEmployee}
          error={error}
        />
      </Row>
    </Layout>
  );
};
