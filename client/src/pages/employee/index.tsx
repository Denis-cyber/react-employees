import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Descriptions, Divider, Space, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useGetEmployeeQuery, useRemoveEmployeeMutation } from "../../app/services/employees";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/authSlice";
import { Paths } from "../../paths";
import { Layout } from "../../components/layout";
import { CustomButton } from "../../components/customButton";
import { ErrorMessage } from "../../components/errorMessage";
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";

export const Employee = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const params = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetEmployeeQuery(params?.id || "");
  const [removeEmployee] = useRemoveEmployeeMutation();
  const user = useAppSelector(selectUser);

  if (isLoading) {
    return <span>Загрузка</span>;
  }

  if (!data) {
    navigate(Paths.home);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteUser = async () => {
    hideModal();

    try {
      if (data) {
        await removeEmployee(data.id).unwrap();
        navigate(`${Paths.status}/deleted`);
      }
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
      <Descriptions title='Информация о сотруднике' bordered>
        <Descriptions.Item
          label='Имя'
          span={3}
        >{`${data?.firstName} ${data?.lastName}`}</Descriptions.Item>
        <Descriptions.Item label='Возраст' span={3}>
          {data?.age}
        </Descriptions.Item>
        <Descriptions.Item label='Адрес' span={3}>
          {data?.address}
        </Descriptions.Item>
      </Descriptions>
      {user?.id === data?.userId && (
        <>
          <Divider orientation='left'>Действия</Divider>
          <Space>
            <Link to={`/employee/edit/${data?.id}`}>
              <CustomButton shape='round' type='default' icon={<EditOutlined />}>
                Редактировать
              </CustomButton>
            </Link>
            <CustomButton shape='round' danger onClick={showModal} icon={<DeleteOutlined />}>
              Удалить
            </CustomButton>
          </Space>
        </>
      )}
      <ErrorMessage message={error} />
      <Modal
        title='Подтвердите удаление'
        open={isModalOpen}
        onOk={handleDeleteUser}
        onCancel={hideModal}
        okText='Подтвердить'
        cancelText='Отменить'
      >
        Вы действительно хотите удалить сотрудника из таблицы?
      </Modal>
    </Layout>
  );
};
