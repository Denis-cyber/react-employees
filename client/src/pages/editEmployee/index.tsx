import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Employee } from "@prisma/client";
import { Row } from "antd";
import { useEditEmployeeMutation, useGetEmployeeQuery } from "../../app/services/employees";
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { Layout } from "../../components/layout";
import { EmployeeForm } from "../../components/employeeForm";
import { Paths } from "../../paths";

export const EditEmployee = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState("");
  const { data, isLoading } = useGetEmployeeQuery(params.id || "");
  const [editEmployee] = useEditEmployeeMutation();

  if (isLoading) {
    return <span>Загрузка...</span>;
  }

  const handleEditEmployee = async (employee: Employee) => {
    try {
      const editedEmployee = {
        ...data,
        ...employee,
      };

      await editEmployee(editedEmployee).unwrap();
      navigate(`${Paths.status}/updated`);
    } catch (err) {
      const maybeError = isErrorWithMessage(err);

      if (maybeError) {
        setError(err.data.message);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  return (
    <Layout>
      <Row align='middle' justify='center'>
        <EmployeeForm
          title='Редактировать сотрудника'
          btnTExt='Редактировать'
          error={error}
          employee={data}
          onFinish={handleEditEmployee}
        />
      </Row>
    </Layout>
  );
};
