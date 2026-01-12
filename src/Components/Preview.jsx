import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, Input, Upload, message as antdMessage, Skeleton } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import "../styles/preview.css";

const Preview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { previewPost, postLoading, currentUser } = useSelector((state) => state.auth);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [file, setFile] = useState(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [form] = Form.useForm();

  
  useEffect(() => {
    if (id) {
      dispatch({ type: "posts/fetchById", payload: id });
    }
  }, [id, dispatch]);


  useEffect(() => {
    if (!postLoading && !previewPost && id) {
 
      const timer = setTimeout(() => {
        if (!previewPost) {
          antdMessage.error("Post not found");
          navigate("/posts");
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [previewPost, postLoading, id, navigate]);

  if (postLoading) {
    return (
      <div className="preview-page">
        <div className="preview-header">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/posts")}
            type="text"
          >
            Back
          </Button>
        </div>
        <div className="preview-content">
          <Skeleton active avatar paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!previewPost) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const isOwner = currentUser?.id === previewPost.author?.id;


  const handleEdit = () => {
    if (previewPost.is_published) {
      antdMessage.warning("Please unpublish the post before editing");
      return;
    }
    form.setFieldsValue({
      title: previewPost.title,
      content: previewPost.content,
    });
    setOpenEditModal(true);
  };


  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Post",
      content: "Are you sure you want to delete this post?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        dispatch({ type: "posts/delete", payload: previewPost.id });
        navigate("/posts");
      },
    });
  };


  const handlePublish = async () => {
    setPublishLoading(true);
    if (previewPost.is_published) {
      await dispatch({ type: "posts/unpublish", payload: previewPost.id });
    } else {
      await dispatch({ type: "posts/publish", payload: previewPost.id });
    }
    
   
    setTimeout(() => {
      dispatch({ type: "posts/fetchById", payload: id });
      setPublishLoading(false);
    }, 1000);
  };


  const handleUpdate = async (values) => {
    if (previewPost.is_published) {
      antdMessage.error("Please unpublish the post before editing");
      setOpenEditModal(false);
      return;
    }

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

    await dispatch({
      type: "posts/update",
      payload: { id: previewPost.id, formData: fd },
    });

   
    setTimeout(() => {
      dispatch({ type: "posts/fetchById", payload: id });
    }, 1000);

    setOpenEditModal(false);
    form.resetFields();
    setFile(null);
  };

  const handleModalCancel = () => {
    setOpenEditModal(false);
    form.resetFields();
    setFile(null);
  };

  return (
    <div className="preview-page">
    
      <div className="card">
      <div className="preview-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/posts")}
          type="text"
          className="back"
        >
          Back
        </Button>

        {isOwner && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button danger onClick={handleDelete}className="delete"> 
              Delete
            </Button>
            <Button onClick={handleEdit} type="primary">
              Edit
            </Button>
            <Button
              type="primary"
              onClick={handlePublish}
              loading={publishLoading}
            >
              {previewPost.is_published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        )}
      </div>

 
      <div className="preview-content">
        
   

        {previewPost.img_url && (
          <img
            src={previewPost.img_url}
            alt="post"
            className="preview-main-img"
          />
        )}

        <h1 className="preview-title">{previewPost.title}</h1>

        <p className="preview-text">{previewPost.content}</p>
      </div>
</div>
     
      <Modal
        title="Edit Post"
        open={openEditModal}
        footer={null}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="title"
            label="Blog Title"
            rules={[{ required: true, message: "Please enter blog title" }]}
          >
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item
            label="Cover Image"
            extra="Max size: 2MB. Formats: JPG, PNG (Leave empty to keep current image)"
          >
            <Upload
              beforeUpload={(f) => {
                setFile(f);
                return false;
              }}
              maxCount={1}
              accept=".jpg,.jpeg,.png"
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>Choose Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter blog content" />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button onClick={handleModalCancel}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Preview;