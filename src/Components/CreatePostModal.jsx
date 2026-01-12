import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Button, message as antdMessage } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePostModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [load,setLoad]=useState(false);
  const [navi,setNavi]=useState("");
 const {loading} = useSelector(
     (state) => state.auth
   );
   
   useEffect(()=>{

   },[loading])
  
  
  const handleSubmit = (values) => {
    setLoad(true);
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("content", values.content);

    if (file) {

      if (file.size > 2 * 1024 * 1024) {
        antdMessage.error("File size must be less than 2MB");
        return;
      }


      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        antdMessage.error("Only JPG and PNG formats are allowed");
        return;
      }

      fd.append("file", file);
    }

    dispatch({
      type: "posts/create",
      payload: { formData: fd, navigate },
    });
    handleClose();
    
  };

  const handleClose =  () => {
    if(loading) {
      form.resetFields();
      setFile(null);
      setLoad(false);
    }
    onClose();
  };

  const handleCancel=()=>{
    handleClose();
    form.resetFields();
  }

  return (
    <Modal

      width={420}
      style={{ top: 110 }}

      open={open}
      footer={null}
      onCancel={handleClose}

    >
      <p className="title">Title</p>
      <Form form={form} layout="vertical" onFinish={handleSubmit} >
        <Form.Item
          name="title"
          label="Blog Title"
          rules={[{ required: true, message: "Please enter blog title" }]}
        >
          <Input placeholder="Enter blog title" style={{
            backgroundColor: "rgba(241, 241, 242, 1)", border: "none", width: "375.5px",
            height: "48px",
            borderRadius: "6px"
          }} />
        </Form.Item>

        <Form.Item
          label="Cover Image"
          extra="Max size: 2MB. Formats: JPG, PNG"
        >

          <Upload
            beforeUpload={(f) => {
              setFile(f);
              return false;
            }}
            maxCount={1}
            accept=".jpg,.jpeg,.png"
            onRemove={() => setFile(null)}

            style={{
              backgroundColor: "rgba(241, 241, 242, 1)", border: "none", width: "375.5px",
              height: "48px",
              borderRadius: "6px"
            }}

          >

            <Button type="primary" icon={<UploadOutlined />} style={{ margin: "7px 230px" }}>Choose Image</Button>
          </Upload>

        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please enter content" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter blog content" style={{
            backgroundColor: "rgba(241, 241, 242, 1)", border: "none", width: "375.5px",
            height: "176px",
            borderRadius: "6px"
          }} />
        </Form.Item>

        <div
          className="modal-actions"
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Button onClick={handleCancel}>Cancel</Button>
          <Button htmlType="submit" type="primary" loading={load}>
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;