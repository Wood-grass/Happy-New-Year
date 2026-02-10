import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { MapPin, User, Phone, ShieldCheck } from 'lucide-react'

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    hometown: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { simpleLogin } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { name, hometown, phone } = formData
    if (!name || !hometown || !phone) {
      return setError('请填写完整信息')
    }
    
    // Simple validation for phone
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return setError('请输入有效的手机号码')
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await simpleLogin(phone, name, hometown)
      if (error) throw error
      navigate('/profile')
    } catch (err: any) {
      console.error(err)
      setError(err.message || '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 bg-[url('https://images.unsplash.com/photo-1548625361-1c5c52c67923?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-white/90">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-8 border-red-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 100 100">
             <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="80" fill="#DC2626">马</text>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-red-900 font-serif tracking-wider">年味基因库</h1>
        <p className="text-center text-gray-500 mb-8">输入信息，立即开启您的文化寻根之旅</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                placeholder="怎么称呼您？" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">家乡城市</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={formData.hometown}
                onChange={(e) => setFormData({...formData, hometown: e.target.value})}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                placeholder="例如：江苏苏州" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                placeholder="仅用于唯一身份标识" 
                maxLength={11}
              />
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3.5 rounded-lg hover:bg-red-700 transition-all font-bold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2 transform hover:-translate-y-0.5"
          >
            {loading ? '正在进入...' : '立即开启'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link to="/" className="text-sm text-gray-500 hover:text-red-700 inline-flex items-center transition-colors">
            暂不登录，先看看 
            <span className="ml-1 text-lg">→</span>
          </Link>
          
          <Link to="/admin/login" className="text-xs text-gray-400 hover:text-gray-600 flex items-center transition-colors">
            <ShieldCheck className="w-3 h-3 mr-1" />
            管理员入口
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
