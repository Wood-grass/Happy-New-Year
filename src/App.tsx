import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ARScan from './pages/ARScan'
import HeritageDetail from './pages/HeritageDetail'
import HeritageList from './pages/HeritageList'
import GeneProfile from './pages/GeneProfile'
import CoCreation from './pages/CoCreation'
import Profile from './pages/Profile'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ar-scan" element={<ARScan />} />
        <Route path="/heritage/:id" element={<HeritageDetail />} />
        <Route path="/heritage/list" element={<HeritageList />} />
        <Route path="/gene-profile" element={<GeneProfile />} />
        <Route path="/co-creation" element={<CoCreation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Layout>
  )
}

export default App
