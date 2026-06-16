import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import DestinationsPage from './pages/admin/DestinationsPage.jsx'
import TagsPage from './pages/admin/TagsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin/destinations" element={<DestinationsPage />} />
      <Route path="/admin/tags" element={<TagsPage />} />
    </Routes>
  )
}