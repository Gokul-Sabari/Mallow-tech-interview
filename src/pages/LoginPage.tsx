// src/pages/LoginPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login } from "../redux/slices/authSlice";

import { Button, Checkbox, Form, Input, Typography, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import "../styles/Login.css";


const { Text, Title, Link } = Typography;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/users");
    }
  }, [isAuthenticated, navigate]);

  const onFinish = (values: { email: string; password: string; remember: boolean }) => {
    dispatch(login({ email: values.email, password: values.password }));
  };

  return (
    <div className="login-bg">
      <Card className="login-card">
      

        {error && <Text type="danger">{error}</Text>}

        <Form
          name="login_form"
          initialValues={{
            remember: true,
            email: "eve.holt@reqres.in",
            password: "cityslicka",
          }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
          
            name="email"
            rules={[
              { type: "email", required: true, message: "Please input your Email!" },
            ]}
          >
            <Input size="large" prefix={<UserOutlined/>} placeholder="Enter email" />
          </Form.Item>

          <Form.Item
          
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          <div className="login-control-row">
            <Checkbox defaultChecked>Remember me</Checkbox>
         
          </div>

          <Button block type="primary" htmlType="submit" size="large" loading={loading}>
            Log in
          </Button>

          <div className="login-footer">
         
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
