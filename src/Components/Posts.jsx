import React, { useEffect, useState } from "react";
import "../styles/topbar.css";
import "../styles/posts.css";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequest } from "../redux/authSlice";

import { Button } from "antd";

import ProfileModal from "./ProfileModal";
import Search from "./Search";
import CreatePostModal from "./CreatePostModal";
import PostsTable from "./PostsTable";
import logo from "../pic/logo.png";

const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentUser,
    logoutLoading,
    userPosts = [],
    postLoading,
  } = useSelector((state) => state.auth);

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

 
  const handleLogout = () => {
    dispatch(logoutRequest({ navigate }));
  };


  useEffect(() => {
    if (currentUser?.id) {
      dispatch({ type: "posts/fetchUser" });
    }
  }, [dispatch, currentUser]);


  useEffect(() => {
 
    if (currentUser?.id) {
      dispatch({ type: "posts/fetchUser" });
    }

    const handleFocus = () => {
      if (currentUser?.id) {
        dispatch({ type: "posts/fetchUser" });
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [dispatch, currentUser]);

  
  const filteredPosts = userPosts.filter((p) =>
    p?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
    
      <div className="topbar">
        <div className="logobar">
          <img src={logo} alt="logo" style={{ marginLeft: 50 }} />

          <Link
            to="/dashboard"
            className="btn-dash btn-link"
            style={{ marginLeft: 30, color: "rgba(133,133,133,1)" }}
          >
            Dashboard
          </Link>

          <Link to="/posts" className="btn-post btn-link">
            Posts
          </Link>
        </div>

        <div className="top-profile" onClick={() => setOpenMenu(!openMenu)}>
          <img
            src={currentUser?.img_url || "/profile.png"}
            alt="profile"
            style={{ width: 36, height: 36, borderRadius: 9 }}
          />
        </div>

        {openMenu && (
          <div className="profile-dropdown-container">
            <div className="dropdown-arrow" />
            <div className="profile-dropdown">
              <p
                onClick={() => {
                  setOpenProfile(true);
                  setOpenMenu(false);
                }}
              >
                Profile
              </p>
              <p onClick={handleLogout}>
                {logoutLoading ? "Logging out..." : "Logout"}
              </p>
            </div>
          </div>
        )}

        {openProfile && (
          <ProfileModal
            visible={openProfile}
            onClose={() => setOpenProfile(false)}
          />
        )}
      </div>


      <div className="posts-page">
        <div className="posts-header">
          <h2 className="post">Posts</h2>

          <div className="posts-actions" style={{ display: "flex", gap: "10px" }}>
            <Search
              value={search}
              onChange={setSearch}
              placeholder="Search"
              style={{ width: 200 }}
            />
            <Button type="primary" onClick={() => setOpenModal(true)}>
              Create
            </Button>
          </div>
        </div>

  
        <PostsTable posts={filteredPosts} loading={postLoading} />
      </div>

      
      <CreatePostModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default Posts;