import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "@prisma/client";
import { Table } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { CustomButton } from "../../components/customButton";
import { Layout } from "../../components/layout";
import { useGetAllEmployeesQuery } from "../../app/services/employees";
import { Paths } from "../../paths";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/authSlice";

const columns: ColumnsType<Employee> = [
  {
    title: "Имя",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Возраст",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Адрес",
    dataIndex: "address",
    key: "address",
  },
];

export const Employees = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { data, isLoading } = useGetAllEmployeesQuery();

  const goToAddUser = () => navigate(Paths.employeeAdd);

  useEffect(() => {
    if (!user) {
      navigate(Paths.login);
    }
  }, [navigate, user]);

  return (
    <Layout>
      <CustomButton type='primary' onClick={goToAddUser} icon={<PlusCircleOutlined />}>
        Добавить
      </CustomButton>
      <Table
        loading={isLoading}
        dataSource={data}
        pagination={false}
        columns={columns}
        rowKey={(record) => record.id}
        onRow={(record) => ({ onClick: () => navigate(`${Paths.employee}/${record.id}`) })}
      />
    </Layout>
  );
};
