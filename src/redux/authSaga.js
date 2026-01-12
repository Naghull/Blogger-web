import { call, put, takeLatest } from "redux-saga/effects";
import { message } from "antd";

import {
  signupStart,
  signupSuccess,
  signupFail,
  signinStart,
  signinSuccess,
  signinFail,
  getCommonPostStart,
  getCommonPostSuccess,
  getCommonPostFail,
  logoutSuccess,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFail,
  fetchUserPostsStart,
  fetchUserPostsSuccess,
  fetchUserPostsFail,
  setPreviewPost,
  fetchSinglePostStart,
  fetchSinglePostSuccess,
  fetchSinglePostFail,
  updatePostStart,
  updatePostSuccess,
  updatePostFail,
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFail,
  addCommentSuccess,
  updateCommentSuccess,
  deleteCommentSuccess,
} from "./authSlice";

import {
  signupUserAPI,
  loginUserAPI,
  logoutUserAPI,
  fetchPostsAPI,
  updateProfileAPI,
  fetchUserPostsAPI,
  createPostAPI,
  updatePostAPI,
  deletePostAPI,
  unpublishPostAPI,
  publishPostAPI,
  getPostByIdAPI,
  fetchCommentsAPI,
  addCommentAPI,
  updateCommentAPI,
  deleteCommentAPI,
} from "../services/api";


function* postUserWatch(action) {
  try {
    yield put(signupStart());
    const res = yield call(signupUserAPI, action.payload);
    yield put(signupSuccess(res.data.data));
    message.success("Signup successful!");
  } catch (err) {
    const msg = err?.response?.data?.message || "Signup failed";
    yield put(signupFail(msg));
    message.error(msg);
  }
}


function* signinUserWatch(action) {
  try {
    yield put(signinStart());
    const res = yield call(loginUserAPI, action.payload);

    const userData = res.data.data;
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.details));

    yield put(signinSuccess(userData));
    message.success("Login successful!");

 
    yield call(fetchPostsWithToken);
    yield call(fetchUserPostsSaga);
  } catch (err) {
    const msg = err?.response?.data?.message || "Invalid credentials";
    yield put(signinFail(msg));
    //message.error(msg);
  }
}


function* fetchPostsWithToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    yield put(getCommonPostStart());
    const res = yield call(fetchPostsAPI, token);
    
 
    const allPosts = res.data.data || [];
    

    const userStr = localStorage.getItem("user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    

    const filteredPosts = allPosts.filter(post => {
   
      if (post.is_published) return true;
      
     
      if (currentUser && post.author.id === currentUser.id) {
        return false;
      }
      
      return true;
    });
    
    console.log("All posts from API:", allPosts.length);
    console.log("Filtered posts for dashboard:", filteredPosts.length);
    
 
    yield put(getCommonPostSuccess(filteredPosts));
  } catch (err) {
    console.error("Error fetching posts:", err);
    yield put(getCommonPostFail());
  }
}

function* fetchUserPostsSaga() {
  try {
    yield put(fetchUserPostsStart());
    const res = yield call(fetchUserPostsAPI);
    
   
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      yield put(fetchUserPostsFail());
      return;
    }
    
    const currentUser = JSON.parse(userStr);
    
  
    const allPosts = res.data.data || [];
    const userPosts = allPosts.filter(
      post => post.author.id === currentUser.id
    );
    
    
    yield put(fetchUserPostsSuccess(userPosts));
  } catch {
    yield put(fetchUserPostsFail());
  }
}


function* fetchSinglePostSaga({ payload }) {
  try {
    yield put(fetchSinglePostStart());
    const res = yield call(getPostByIdAPI, payload);
    yield put(fetchSinglePostSuccess(res.data.data));
  } catch (err) {
    yield put(fetchSinglePostFail());
    message.error(err?.response?.data?.message || "Failed to load post");
  }
}


function* createPostSaga({ payload }) {
  try {
    const res = yield call(createPostAPI, payload.formData);
    const newPost = res.data.data;
    

    yield put(setPreviewPost(newPost));
    

    yield call(fetchUserPostsSaga);
    
    message.success("Post created successfully!");
    

    if (payload.navigate) {
      payload.navigate(`/preview/${newPost.id}`);
    }
  } catch (err) {
    message.error(err?.response?.data?.message || "Create failed");
  }
}


function* updatePostSaga({ payload }) {
  try {
    yield put(updatePostStart());
    const res = yield call(updatePostAPI, payload.id, payload.formData);
    const updatedPost = res.data.data;
    
    yield put(updatePostSuccess(updatedPost));
    message.success("Post updated successfully!");
    

    yield call(fetchUserPostsSaga);
    

    if (updatedPost.is_published) {
      yield call(fetchPostsWithToken);
    }
  } catch (err) {
    yield put(updatePostFail());
    message.error(err?.response?.data?.message || "Update failed");
  }
}


function* publishPostSaga({ payload }) {
  try {
    const res = yield call(publishPostAPI, payload);
    const publishedPost = res.data.data;
    
    message.success("Post published successfully!");
    
  
    yield call(fetchUserPostsSaga);
    
   
    yield call(fetchPostsWithToken);
    

    yield put(updatePostSuccess(publishedPost));
  } catch (err) {
    message.error(err?.response?.data?.message || "Publish failed");
  }
}


function* unpublishPostSaga({ payload }) {
  try {
    yield call(unpublishPostAPI, payload);
    message.success("Post unpublished successfully!");
    
 
    yield call(fetchUserPostsSaga);
    
   
    yield call(fetchPostsWithToken);
  } catch (err) {
    message.error(err?.response?.data?.message || "Unpublish failed");
  }
}

function* deletePostSaga({ payload }) {
  try {
    yield call(deletePostAPI, payload);
    message.success("Post deleted successfully!");
    yield call(fetchUserPostsSaga);
    yield call(fetchPostsWithToken);
  } catch (err) {
    message.error(err?.response?.data?.message || "Delete failed");
  }
}


function* logoutUserWatch(action) {
  try {
    yield call(logoutUserAPI);
  } catch (err) {
    console.log("Logout API error:", err);
  }


  localStorage.clear();

  yield put(logoutSuccess());
  message.success("Logged out successfully!");


  if (action.payload?.navigate) {
    action.payload.navigate("/");
  }
}


function* updateProfileWatch(action) {
  try {
    yield put(updateProfileStart());

    const formData = new FormData();
    formData.append("first_name", action.payload.first_name);
    formData.append("last_name", action.payload.last_name);
    if (action.payload.file) formData.append("file", action.payload.file);

    const res = yield call(updateProfileAPI, formData);

    localStorage.setItem("user", JSON.stringify(res.data.data));
    yield put(updateProfileSuccess(res.data.data));
    message.success("Profile updated successfully!");
  } catch (err) {
    const msg = err?.response?.data?.message || "Update failed";
    yield put(updateProfileFail(msg));
    message.error(msg);
  }
}


function* fetchCommentsSaga({ payload }) {
  try {
    yield put(fetchCommentsStart());
    const res = yield call(fetchCommentsAPI, payload);
    yield put(
      fetchCommentsSuccess({
        postId: payload,
        comments: res.data.data || [],
      })
    );
  } catch (err) {

    if (err?.response?.status === 404) {
      yield put(
        fetchCommentsSuccess({
          postId: payload,
          comments: [],
        })
      );
    } else {
      yield put(fetchCommentsFail());
    }
  }
}

function* addCommentSaga({ payload }) {
  try {
    const res = yield call(addCommentAPI, payload.postId, payload.content);
    yield put(
      addCommentSuccess({
        postId: payload.postId,
        comment: res.data.data,
      })
    );
    message.success("Comment added successfully!");
  } catch (err) {
    message.error(err?.response?.data?.message || "Failed to add comment");
  }
}

function* updateCommentSaga({ payload }) {
  try {
    const res = yield call(
      updateCommentAPI,
      payload.postId,
      payload.commentId,
      payload.content
    );
    yield put(
      updateCommentSuccess({
        postId: payload.postId,
        commentId: payload.commentId,
        updatedComment: res.data.data,
      })
    );
    message.success("Comment updated successfully!");
  } catch (err) {
    message.error(err?.response?.data?.message || "Failed to update comment");
  }
}

function* deleteCommentSaga({ payload }) {
  try {
    yield call(deleteCommentAPI, payload.postId, payload.commentId);
    yield put(
      deleteCommentSuccess({
        postId: payload.postId,
        commentId: payload.commentId,
      })
    );
    message.success("Comment deleted successfully!");
  } catch (err) {
    message.error(err?.response?.data?.message || "Failed to delete comment");
  }
}

export function* authSaga() {
  yield takeLatest("postuser", postUserWatch);
  yield takeLatest("loginUser", signinUserWatch);
  yield takeLatest("auth/logoutRequest", logoutUserWatch);
  yield takeLatest("updateProfile", updateProfileWatch);
  yield takeLatest("auth/fetchPosts", fetchPostsWithToken);

  yield takeLatest("posts/fetchUser", fetchUserPostsSaga);
  yield takeLatest("posts/fetchById", fetchSinglePostSaga);
  yield takeLatest("posts/create", createPostSaga);
  yield takeLatest("posts/update", updatePostSaga);
  yield takeLatest("posts/publish", publishPostSaga);
  yield takeLatest("posts/unpublish", unpublishPostSaga);
  yield takeLatest("posts/delete", deletePostSaga);

  yield takeLatest("comments/fetch", fetchCommentsSaga);
  yield takeLatest("comments/add", addCommentSaga);
  yield takeLatest("comments/update", updateCommentSaga);
  yield takeLatest("comments/delete", deleteCommentSaga);
}