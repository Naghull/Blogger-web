import React, { useEffect, useState, useRef, useCallback } from "react";
import "../styles/topbar.css";
import "../styles/dashboard.css";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequest, selectPost } from "../redux/authSlice";

import ProfileModal from "./ProfileModal";
import PostList from "./PostList";
import PostView from "./PostView";
import Comment from "./Comment";
import logo from "../pic/logo.png";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentUser,
    logoutLoading,
    commonposts = [],
    selectedPost,
    token,
    postLoading,
    comments = {},
    commentLoading,
  } = useSelector((state) => state.auth);

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [displayCount, setDisplayCount] = useState(10);

  const observerTarget = useRef(null);

  const handleLogout = () => {
    dispatch(logoutRequest({ navigate }));
  };


  useEffect(() => {
    if (token) {
      dispatch({ type: "auth/fetchPosts" });
    }
  }, [token, dispatch]);


  useEffect(() => {
    const handleFocus = () => {
      if (token) {
        dispatch({ type: "auth/fetchPosts" });
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [token, dispatch]);


  useEffect(() => {
    if (commonposts.length > 0 && !selectedPost) {
      dispatch(selectPost(commonposts[0]));
    }
  }, [commonposts, selectedPost, dispatch]);

  useEffect(() => {
    if (selectedPost?.id && !comments[selectedPost.id]) {
      dispatch({ type: "comments/fetch", payload: selectedPost.id });
    }
  }, [selectedPost, dispatch, comments]);


  const filteredPosts = commonposts.filter((post) => {
    const text = searchText.toLowerCase();
    return (
      post.title.toLowerCase().includes(text) ||
      post.author.first_name.toLowerCase().includes(text) ||
      post.author.last_name.toLowerCase().includes(text)
    );
  });


  const displayedPosts = filteredPosts.slice(0, displayCount);

  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && displayedPosts.length < filteredPosts.length) {
      setDisplayCount((prev) => prev + 10);
    }
  }, [displayedPosts.length, filteredPosts.length]);

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);


  useEffect(() => {
    setDisplayCount(10);
  }, [searchText]);

  const handleSelectPost = (post) => {
    dispatch(selectPost(post));
  };

  const postComments = selectedPost ? comments[selectedPost.id] || [] : [];

  return (
    <div>

      <div className="topbar">
        <div className="logobar">
          <img src={logo} alt="logo" style={{ marginLeft: "50px" }} />

          <Link
            to="/dashboard"
            className="btn-dash btn-link"
            style={{ marginLeft: "30px" }}
          >
            Dashboard
          </Link>

          <Link
            to="/posts"
            className="btn-post btn-link"
            style={{ color: "rgba(133, 133, 133, 1)" }}
          >
            Posts
          </Link>
        </div>

        <div className="top-profile" onClick={() => setOpenMenu(!openMenu)}>
          <img
            src={currentUser?.img_url || "/profile.png"}
            alt="profile"
            style={{ width: 36, height: 36, borderRadius: "9px" }}
          />
        </div>

        {openMenu && (
          <div className="profile-dropdown-container">
            <div className="dropdown-arrow"></div>
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


      <div className="dashboard-container">

        <PostList
          displayedPosts={displayedPosts}
          selectedPost={selectedPost}
          onSelectPost={handleSelectPost}
          searchText={searchText}
          onSearchChange={setSearchText}
          postLoading={postLoading}
          hasMore={displayedPosts.length < filteredPosts.length}
          observerTarget={observerTarget}
        />


        <PostView post={selectedPost} postLoading={postLoading}>
          <Comment
            postId={selectedPost?.id}
            comments={postComments}
            commentLoading={commentLoading}
          />
        </PostView>
      </div>
    </div>
  );
};

export default Dashboard;
