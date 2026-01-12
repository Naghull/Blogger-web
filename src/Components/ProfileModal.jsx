import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";


const ProfileModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { currentUser, profileLoading } = useSelector((state) => state.auth);

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible && currentUser) {
      form.setFieldsValue({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
      });
    } else if (!visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, currentUser, form]);

  const handleFinish = (values) => {
    const file = fileList[0]?.originFileObj || null;

    dispatch({
      type: "updateProfile",
      payload: {
        first_name: values.first_name,
        last_name: values.last_name,
        file,
      },
    });

    setFileList([]);
    onClose();
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setFileList([{ ...file, originFileObj: file }]);
      return false;
    },
    onRemove: () => setFileList([]),
    fileList,
    maxCount: 1,
    showUploadList: false,
  };

  return (
    <Modal
      title="Profile"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      style={{ top: 110 }}
      className="profile-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="profile-form"
      >
        <Form.Item
          label={<span className="form-label">First Name *</span>}
          name="first_name"
          rules={[{ required: true }]}
        >
          <Input className="form-input" />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Last Name *</span>}
          name="last_name"
          rules={[{ required: true }]}
        >
          <Input className="form-input" />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Profile Image</span>}
        >
          <Upload {...uploadProps}>
            <Button className="upload-input" icon={<UploadOutlined />}>
              Choose Image
            </Button>
          </Upload>
        </Form.Item>

        <div className="form-actions">
          <Button
            type="primary"
            htmlType="submit"
            loading={profileLoading}
            className="submit-btn"
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
