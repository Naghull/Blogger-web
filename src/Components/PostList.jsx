import React from "react";
import { Input, Skeleton } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const PostList = ({
  displayedPosts,
  selectedPost,
  onSelectPost,
  searchText,
  onSearchChange,
  postLoading,
  hasMore,
  observerTarget,
}) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/150x100?text=No+Image";
    e.target.onerror = null;
  };

  return (
    <div
      className="left-panel"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h3 className="panel-title">Published blogs</h3>

        <Input
          placeholder="Search..."
          prefix={<SearchOutlined style={{ color: "gray" }} />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: "220px" }}
        />
      </div>

      {postLoading && <p>Loading posts...</p>}
      {!postLoading && displayedPosts.length === 0 && (
        <p>No posts found...</p>
      )}


      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            overflowY: "scroll",
            paddingRight: "17px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              style={{
                display: "flex",
                gap: "12px",
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                backgroundColor:
                  selectedPost?.id === post.id ? "#f5f5f5" : "transparent",
              }}
            >
              <img
                src={
                  post.img_url ||
                  "https://via.placeholder.com/150x100?text=No+Image"
                }
                alt={post.title}
                onError={handleImageError}
                style={{
                  width: "80px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  {post.title}
                </p>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  {post.author.first_name} {post.author.last_name} ·{" "}
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          ))}

          {hasMore && (
            <div
              ref={observerTarget}
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              <Skeleton active />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList;
