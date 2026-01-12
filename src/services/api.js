import axios from "axios";

const BASE_URL = "https://interns-mini-project.onrender.com/api/v1";

const getToken = () => localStorage.getItem("token");

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export const signupUserAPI = (data) => {
  return apiClient.post("/auth/signup", data);
};

export const loginUserAPI = (data) => {
  return apiClient.post("/auth/login", data);
};

export const logoutUserAPI = () => {
  return apiClient.post("/auth/logout");
};

export const updateProfileAPI = (formData) => {
  return apiClient.put("/user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};




export const fetchPostsAPI = () => {
  return apiClient.get("/posts");
};


export const fetchUserPostsAPI = () => {
  return apiClient.get("/posts");
};


export const createPostAPI = (formData) => {
  return apiClient.post("/posts/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const updatePostAPI = (id, formData) => {
  return apiClient.put(`/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const deletePostAPI = (id) => {
  return apiClient.delete(`/posts/${id}`);
};


export const publishPostAPI = (id) => {
  return apiClient.patch(`/posts/${id}/publish`);
};


export const unpublishPostAPI = (id) => {
  return apiClient.patch(`/posts/${id}/unpublish`);
};


export const getPostByIdAPI = (id) => {
  return apiClient.get(`/posts/${id}`);
};




export const fetchCommentsAPI = (postId) => {
  return apiClient.get(`/posts/${postId}/comments`);
};


export const addCommentAPI = (postId, content) => {
  return apiClient.post(`/posts/${postId}/comments`, { content });
};


export const updateCommentAPI = (postId, commentId, content) => {
  return apiClient.put(`/posts/${postId}/comments/${commentId}`, { content });
};


export const deleteCommentAPI = (postId, commentId) => {
  return apiClient.delete(`/posts/${postId}/comments/${commentId}`);
};