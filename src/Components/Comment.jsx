import React, { useState } from "react";
import { Input, Button, Skeleton } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

const Comment = ({ postId, comments = [], commentLoading }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleAddComment = () => {
    if (!commentText.trim() || !postId) return;

    dispatch({
      type: "comments/add",
      payload: { postId, content: commentText },
    });

    setCommentText("");
  };

  return (
    <div className="comments-section" style={{ marginTop: "30px" }}>
      

      {commentLoading ? (
        <Skeleton active />
      ) : (
        <div style={{ marginBottom: "20px" }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <img
                  src={comment.author.img_url}
                  alt=""
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <strong>
                    {comment.author.first_name} {comment.author.last_name}
                  </strong>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
              </div>
              <p style={{ marginLeft: "42px", marginBottom: 0 }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <Input
          className="comments"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onPressEnter={handleAddComment}
        />
       
      </div>
    </div>
  );
};

export default Comment;