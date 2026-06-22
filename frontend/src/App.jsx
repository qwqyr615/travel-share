import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'

import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import PostListPage from './pages/PostListPage.jsx'
import PostDetailPage from './pages/PostDetailPage.jsx'
import PostEditPage from './pages/PostEditPage.jsx'
import DestinationsPage from './pages/admin/DestinationsPage.jsx'
import TagsPage from './pages/admin/TagsPage.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/new" element={<PostEditPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/posts/:id/edit" element={<PostEditPage />} />
        <Route path="/admin/destinations" element={<DestinationsPage />} />
        <Route path="/admin/tags" element={<TagsPage />} />
      </Routes>
    </Layout>
  )
}
