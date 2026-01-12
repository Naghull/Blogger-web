import React, { useEffect } from "react";
import { Checkbox, Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";   
import right from "../pic/right.png";
import "../styles/signinsignup.css";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { loading, success, error, errorMessage, token } = useSelector(
    (state) => state.auth
  );

  const onFinish = (values) => {
    dispatch({
      type: "loginUser",
      payload: {
        email: values.email,
        password: values.password,
      },
    });
  };


  useEffect(() => {
    if (success && token) {
      navigate("/dashboard", { replace: true });
    }
  }, [success, token, navigate]);

  
  useEffect(() => {
    if (error && errorMessage) {
      message.error(  errorMessage);
      console.log(errorMessage);
    }
  }, [error, errorMessage]);

  return (
    <div className="signin-page">
      <div className="signin-left">
        <div className="signin-form-container">
          <p className="signin-title">Sign in to your account</p>

          <Form layout="vertical" className="signin-form" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input placeholder="Email" className="input" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password placeholder="Password" className="input" />
            </Form.Item>

            <Form.Item className="signin-options">
              <Checkbox className="savepassword">
                <span className="savepassword-text">Save password</span>
              </Checkbox>

              <a href="#" className="forget-link">
                Forgot Password?
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                block
                className="button"
                loading={loading}
                htmlType="submit"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <p className="signinup-text">
            Don't have an Account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>

      <div className="signin-right">
        <div className="info-box">
          <img src={right} alt="pic" className="auth-img" />
        </div>
      </div>
    </div>
  );
};

export default Signin;