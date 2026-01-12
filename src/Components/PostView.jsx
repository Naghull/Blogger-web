import React from "react";
import { Skeleton } from "antd";

const PostView = ({ post, postLoading, children }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Available";
    e.target.onerror = null;
  };

  const handleAuthorImageError = (e) => {
    e.target.src = "/profile.png";
    e.target.onerror = null;
  };

  return (
    <div className="right-panel">
      {postLoading ? (
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      ) : post ? (
        <>
          <div className="post-header">
            <img
              src={post.author.img_url || "/profile.png"}
              className="author-pic"
              alt={`${post.author.first_name} ${post.author.last_name}`}
              onError={handleAuthorImageError}
            />

            <div>
              <h4 className="author-name">
                {post.author.first_name}{" "}
                {post.author.last_name}
              </h4>
              <small className="date">
                {formatDate(post.createdAt)}
              </small>
            </div>
          </div>

          <img
            src={post.img_url || "https://via.placeholder.com/800x400?text=No+Image"}
            className="post-main-img"
            alt={post.title}
            onError={handleImageError}
          />

          <h2 className="post-main-title">{post.title}</h2>

          <p className="post-content">{post.content}</p>

          
          {children}
        </>
      ) : (
        <p className="default-message">Select a post...</p>
      )}
    </div>
  );
};

export default PostView;