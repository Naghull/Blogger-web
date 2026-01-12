
import React, { useState } from "react";
import "../styles/topbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutRequest } from "../redux/authSlice";
import ProfileModal from "./ProfileModal";


const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.auth);
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogout = () => {
    
    dispatch(
      logoutRequest({
        navigate,
      })
    );
  };

  return (
    <div className="topbar">
      <div className="logobar">
        <p className="logo">Logo</p>

        <Link to="/dashboard" className="btn-dash btn-link">
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
          style={{ width: 36, height: 36, borderRadius: "50%" }}
        />
      </div>

      {openMenu && (
        <div className="profile-menu">
          <p
            onClick={() => {
              setOpenProfile(true);
              setOpenMenu(false);
            }}
          >
            Profile
          </p>
          <p onClick={handleLogout}>Logout</p>
        </div>
      )}

      {openProfile && (
        <ProfileModal
          visible={openProfile}
          onClose={() => setOpenProfile(false)}
        />
      )}
    </div>
  );
};

export default Topbar;
