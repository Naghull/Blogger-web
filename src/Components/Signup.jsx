
import React, { useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import right from "../pic/right.png";
import "../styles/signinsignup.css";
import { useNavigate } from "react-router-dom";  

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { error, errorMessage, loading, success } = useSelector(
    (state) => state.auth
  );

  const onFinish = (values) => {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
    };

    dispatch({ type: "postuser", payload });
  };

  useEffect(() => {
    if (error && errorMessage) {
      message.error(errorMessage);
    }
    if (success) {
      navigate("/") ;
      form.resetFields();
      
    }
  }, [error, errorMessage, success, form]);

  return (
    <div className="signup-container" style={{ display: "flex" }}>
      <div
        className="signup-left"
        style={{ flex: 1.2, padding: 20, width: "55%" }}
      >
        <div className="form-div">
          <p className="signin-title">Sign up for an account</p>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="signup-form"
          >
            <div className="name-row" style={{ display: "flex", gap: "10px" }}>
              <Form.Item
                name="first_name"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input size="large" placeholder="First Name" />
              </Form.Item>

              <Form.Item
                name="last_name"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input size="large" placeholder="Last Name" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input placeholder="Email" className="input" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Password" className="input" />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, val) {
                    if (!val || val === getFieldValue("password")) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}
            >
              <Input.Password
                className="input"
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="signup-btn button"
              size="large"
              loading={loading}
            >
              Sign Up
            </Button>

            <Text className="signinup-text">
              Already have an Account? <a href="/">Sign in</a>
            </Text>
          </Form>
        </div>
      </div>

      <div
        className="signup-right"
        style={{ flex: 1, backgroundColor: "#1890ff", padding: "50px" }}
      >
        <div className="info-box">
          <img src={right} alt="pic" style={{ margin: "auto" }} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
