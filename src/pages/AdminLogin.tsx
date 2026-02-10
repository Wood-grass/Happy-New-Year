import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { ShieldCheck, Lock, User, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

// Mock Admin Credentials (In real app, this should be in DB)
const ADMIN_ACCOUNTS = [
  { username: 'admin01', password: 'password123', name: '超级管理员' },
  { username: 'reviewer_bj', password: 'password123', name: '北京审核员' },
  { username: 'reviewer_sh', password: 'password123', name: '上海审核员' }
]

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { simpleLogin } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { username, password } = formData
    
    if (!username || !password) {
      return setError('请输入账号和密码')
    }

    setLoading(true)
    setError('')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const admin = ADMIN_ACCOUNTS.find(
      acc => acc.username === username && acc.password === password
    )

    if (admin) {
      // Log in as this admin user
      // We use a special phone number prefix to identify them or just set role
      // For consistency with simpleLogin, we treat username as name, and generate a fake phone
      const fakePhone = `199${Math.random().toString().slice(2, 10)}` 
      
      try {
        // We reuse simpleLogin but we need to ensure they get 'admin' role
        // Ideally we should have a separate adminLogin method, but for this demo:
        // We will just log them in, and the AdminDashboard will allow access based on our session state
        // To make this work properly with AdminDashboard checks, we might need to update AuthProvider
        // OR, we can just use the special '13800138000' phone for all admins to pass the check in AdminDashboard
        
        const adminPhone = '13800138000' // Super admin phone that passes check
        
        await simpleLogin(adminPhone, admin.name, 'Admin HQ')
        navigate('/admin')
      } catch (err) {
        setError('系统错误')
      }
    } else {
      setError('账号或密码错误')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-100">
      <div className="w-full max-w-md p-8 bg-stone-800 rounded-xl shadow-2xl border border-stone-700">
        <div className="flex items-center justify-between mb-8">
           <Link to="/login" className="text-stone-400 hover:text-white transition-colors">
             <ArrowLeft className="w-5 h-5" />
           </Link>
           <div className="flex items-center text-red-500 font-bold tracking-wider">
             <ShieldCheck className="w-5 h-5 mr-2" />
             ADMIN PORTAL
           </div>
           <div className="w-5" /> {/* Spacer */}
        </div>

        <h2 className="text-2xl font-bold text-center mb-8 text-white">管理员登录</h2>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Account</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-stone-500" />
              </div>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full pl-10 pr-3 py-3 bg-stone-900 border border-stone-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white placeholder-stone-600" 
                placeholder="请输入管理员账号" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-stone-500" />
              </div>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-3 py-3 bg-stone-900 border border-stone-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white placeholder-stone-600" 
                placeholder="请输入密码" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-600 transition-all font-bold shadow-lg disabled:opacity-50 mt-4"
          >
            {loading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-stone-600">
          <p>测试账号: admin01 / password123</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
