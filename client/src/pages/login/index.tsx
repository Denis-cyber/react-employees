import { Card, Form, Input, Row } from "antd";
import { Layout } from "../../components/layout";

export const Login = () => {
  return (
    <Layout>
      <Row align='middle' justify='center'>
        <Card title='Войдите' style={{ width: "30rem" }}>
          <Form onFinish={() => null}>
            <Input />
          </Form>
        </Card>
      </Row>
    </Layout>
  );
};
