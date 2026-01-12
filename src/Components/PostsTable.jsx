import React from "react";
import { Table, Button, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../styles/posts.css";

const PostsTable = ({ posts, loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Post Name",
      dataIndex: "title",
      className: "post-title-column",
      render: (text, record) => (
        <span
          className="post-title-text"
          onClick={() => navigate(`/preview/${record.id}`)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      className: "post-title-column",
      render: (t) =>
        new Date(t).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Updated at",
      dataIndex: "updatedAt",
      className: "post-title-column",
      render: (t) =>
        new Date(t).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Actions",
      className: "post-title-column",
      render: (_, r) => (
        <div className="post-actions">
          {r.is_published && (
            <Button
              size="small"
              type="primary"
              className="unpublish"
              onClick={() =>
                dispatch({
                  type: "posts/unpublish",
                  payload: r.id,
                })
              }
            >
              Unpublish
            </Button>
          )}

          <Popconfirm
            title="Delete this post?"
            description="Are you sure you want to delete this post?"
            onConfirm={() =>
              dispatch({
                type: "posts/delete",
                payload: r.id,
              })
            }
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" className="delete">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      className="posts-table"
      columns={columns}
      dataSource={posts}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      style={{ margin: "30px" }}
    />
  );
};

export default PostsTable;
