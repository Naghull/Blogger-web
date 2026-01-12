  import { createSlice } from "@reduxjs/toolkit";

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  const authSlice = createSlice({
    name: "auth",
    initialState: {
      currentUser: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken || null,

      loading: false,
      postLoading: false,
      logoutLoading: false,
      profileLoading: false,

      error: false,
      errorMessage: "",
      success: false,

      commonposts: [],
      selectedPost: null,
      userPosts: [],
      previewPost: null,

      // Comments
      comments: {},
      commentLoading: false,
    },

    reducers: {
    
      signupStart: (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      },
      signupSuccess: (state) => {
        state.loading = false;
        state.success = true;
      },
      signupFail: (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      },

      signinStart: (state) => {
        state.loading = true;
        state.error = false;
      },
      signinSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentUser = action.payload.details;
        state.token = action.payload.token;
      },
      signinFail: (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      },


      getCommonPostStart: (state) => {
        state.postLoading = true;
      },
      getCommonPostSuccess: (state, action) => {
        state.postLoading = false;
        state.commonposts = action.payload || [];
      },
      getCommonPostFail: (state) => {
        state.postLoading = false;
        state.commonposts = [];
      },

      selectPost: (state, action) => {
        state.selectedPost = action.payload;
      },

  
      logoutRequest: (state) => {
        state.logoutLoading = true;
      },
      logoutSuccess: (state) => {
        state.currentUser = null;
        state.token = null;
        state.commonposts = [];
        state.userPosts = [];
        state.previewPost = null;
        state.selectedPost = null;
        state.comments = {};
        state.logoutLoading = false;
      },


      updateProfileStart: (state) => {
        state.profileLoading = true;
        state.error = false;
      },
      updateProfileSuccess: (state, action) => {
        state.profileLoading = false;
        state.currentUser = action.payload;
      },
      updateProfileFail: (state, action) => {
        state.profileLoading = false;
        state.error = true;
        state.errorMessage = action.payload;
      },

      fetchUserPostsStart: (state) => {
        state.postLoading = true;
      },
      fetchUserPostsSuccess: (state, action) => {
        state.postLoading = false;
        state.userPosts = action.payload || [];
      },
      fetchUserPostsFail: (state) => {
        state.postLoading = false;
        state.userPosts = [];
      },

  
      addNewPostToUserPosts: (state, action) => {
        state.userPosts = [action.payload, ...state.userPosts];
      },

      setPreviewPost: (state, action) => {
        state.previewPost = action.payload;
      },
      clearPreviewPost: (state) => {
        state.previewPost = null;
      },

  
      fetchSinglePostStart: (state) => {
        state.postLoading = true;
      },
      fetchSinglePostSuccess: (state, action) => {
        state.postLoading = false;
        state.previewPost = action.payload;
      },
      fetchSinglePostFail: (state) => {
        state.postLoading = false;
      },

      updatePostStart: (state) => {
        state.loading = true;
      },
      updatePostSuccess: (state, action) => {
        state.loading = false;
        state.previewPost = action.payload;
      },
      updatePostFail: (state) => {
        state.loading = false;
      },


      fetchCommentsStart: (state) => {
        state.commentLoading = true;
      },
      fetchCommentsSuccess: (state, action) => {
        state.commentLoading = false;
        state.comments[action.payload.postId] = action.payload.comments;
      },
      fetchCommentsFail: (state) => {
        state.commentLoading = false;
      },

      addCommentSuccess: (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        state.comments[postId].push(comment);
      },

      updateCommentSuccess: (state, action) => {
        const { postId, commentId, updatedComment } = action.payload;
        if (state.comments[postId]) {
          const idx = state.comments[postId].findIndex((c) => c.id === commentId);
          if (idx !== -1) {
            state.comments[postId][idx] = updatedComment;
          }
        }
      },

      deleteCommentSuccess: (state, action) => {
        const { postId, commentId } = action.payload;
        if (state.comments[postId]) {
          state.comments[postId] = state.comments[postId].filter(
            (c) => c.id !== commentId
          );
        }
      },
    },
  });

  export const {
    signupStart,
    signupSuccess,
    signupFail,
    signinStart,
    signinSuccess,
    signinFail,
    getCommonPostStart,
    getCommonPostSuccess,
    getCommonPostFail,
    selectPost,
    logoutRequest,
    logoutSuccess,
    updateProfileStart,
    updateProfileSuccess,
    updateProfileFail,
    fetchUserPostsStart,
    fetchUserPostsSuccess,
    fetchUserPostsFail,
    addNewPostToUserPosts,
    setPreviewPost,
    clearPreviewPost,
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
  } = authSlice.actions;

  export default authSlice.reducer;