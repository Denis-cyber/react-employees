import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { Card, Form, Row, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useRegisterMutation } from "../../app/services/auth";
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { selectUser } from "../../features/auth/authSlice";
import { Layout } from "../../components/layout";
import { CustomInput } from "../../components/customInput";
import { PasswordInput } from "../../components/passwordInput";
import { CustomButton } from "../../components/customButton";
import { ErrorMessage } from "../../components/errorMessage";

type RegisterData = Omit<User, "id"> & { confirmPassword: string };

export const Register = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [error, setError] = useState("");
  const [registerUser] = useRegisterMutation();

  const register = async (data: RegisterData) => {
    try {
      await registerUser(data).unwrap();

      navigate(Paths.home);
    } catch (err) {
      console.log("err", err);
      const maybeError = isErrorWithMessage(err);

      if (maybeError) {
        setError(err.data.message);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate(Paths.home);
    }
  }, [user, navigate]);

  return (
    <Layout>
      <Row align='middle' justify='center'>
        <Card title='Зарегистрируйтесь' style={{ width: "30rem" }}>
          <Form onFinish={register}>
            <CustomInput type='text' name='name' placeholder='Имя' />
            <CustomInput type='email' name='email' placeholder='Email' />
            <PasswordInput name='password' placeholder='Пароль' />
            <PasswordInput name='confirmPassword' placeholder='Повторите пароль' />
            <CustomButton type='primary' htmlType='submit'>
              Зарегистрироваться
            </CustomButton>
          </Form>
          <Space direction='vertical' size='large'>
            <Typography.Text>
              Уже зарегистрированы? <Link to={Paths.login}>Войдите</Link>
            </Typography.Text>
            <ErrorMessage message={error} />
          </Space>
        </Card>
      </Row>
    </Layout>
  );
};
