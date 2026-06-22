import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// ========== 用户 ==========
export const login = (loginName, password) =>
  api.post('/user/login', { loginName, password })

export const register = (regName, password, nickname) =>
  api.post('/user/register', { regName, password, nickname })

export const getUserInfo = () =>
  api.get('/user/info')

export const updateUserInfo = (data) =>
  api.put('/user/info', data)

export const updatePassword = (oldPassword, newPassword) =>
  api.put('/user/password', { oldPassword, newPassword })

// ========== 目的地 ==========
export const getDestinations = () =>
  api.get('/destinations')

export const getDestinationOptions = () =>
  api.get('/destinations/options')

export const createDestination = (data) =>
  api.post('/destinations', data)

export const updateDestination = (id, data) =>
  api.put(`/destinations/${id}`, data)

export const deleteDestination = (id) =>
  api.delete(`/destinations/${id}`)

// ========== 标签 ==========
export const getTags = () =>
  api.get('/tags')

export const createTag = (name) =>
  api.post('/tags', { name })

export const updateTag = (id, data) =>
  api.put(`/tags/${id}`, data)

export const deleteTag = (id) =>
  api.delete(`/tags/${id}`)

// ========== 游记 ==========
export const getPosts = (params) =>
  api.get('/posts', { params })

export const getPostDetail = (id) =>
  api.get(`/posts/${id}`)

export const createPost = (data) =>
  api.post('/posts', data)

export const updatePost = (id, data) =>
  api.put(`/posts/${id}`, data)

export const deletePost = (id) =>
  api.delete(`/posts/${id}`)

export const getMyPosts = () =>
  api.get('/posts/my')

// ========== 评论 ==========
export const getComments = (postId) =>
  api.get(`/comment/list/${postId}`)

export const getCommentCount = (postId) =>
  api.get(`/comment/count/${postId}`)

export const publishComment = (postId, content, parentId) =>
  api.post('/comment/publish', { postId, content, parentId })

export const deleteComment = (commentId) =>
  api.delete(`/comment/delete/${commentId}`)

export const adminDeleteComment = (commentId) =>
  api.delete(`/comment/admin/delete/${commentId}`)

// ========== 收藏 ==========
export const getFavoriteStatus = (postId) =>
  api.get(`/favorite/check/${postId}`)

export const doFavorite = (postId) =>
  api.post(`/favorite/${postId}`)

export const unFavorite = (postId) =>
  api.delete(`/favorite/${postId}`)

export const getMyFavorites = () =>
  api.get('/favorite/list')

// ========== 文件上传 ==========
const uploadFile = (url, file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(url, form).then((response) => {
    const payload = response.data
    if (
      payload?.code === 200 &&
      (payload?.data == null || payload?.data === '') &&
      typeof payload?.message === 'string' &&
      payload.message.startsWith('/uploads/')
    ) {
      return {
        ...response,
        data: {
          ...payload,
          data: payload.message,
        },
      }
    }
    return response
  })
}

export const uploadCover = (file) =>
  uploadFile('/upload/cover', file)

export const uploadImage = (file) =>
  uploadFile('/upload/image', file)

export const uploadAvatar = (file) =>
  uploadFile('/upload/avatar', file)

export default api
