import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login } from "../redux/slices/authSlice";
import { Button, Checkbox, Input, Card, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { showToast } from "../components/Toaster";
import "../styles/Login.css";

const { Text } = Typography;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [remember, setRemember] = useState(true);



  const handleLogin = async () => {
    if (!email || !password) {
      showToast.error("Email and password are required!");
      return;
    }


    const resultAction: any = await dispatch(login({ email, password }));
    
    if (login.fulfilled.match(resultAction)) {
      showToast.success("Login Successful!");
      navigate("/users", { replace: true });
    } else {
      showToast.error(resultAction.payload || "Login Failed");
    }
  };

  return (
    <div className="login-bg">
      <Card className="login-card">
        {error && <Text type="danger">{error}</Text>}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)}>
            Remember me
          </Checkbox>

          <Button
            block
            type="primary"
            size="large"
            onClick={handleLogin}
            loading={loading}
          >
            Log in
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
