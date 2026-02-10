import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, supabase } from '../components/AuthProvider'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface Contribution {
  id: string
  title: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  images: string[]
}

const Profile: React.FC = () => {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    } else if (user) {
      fetchContributions()
    }
  }, [user, loading, navigate])

  const fetchContributions = async () => {
    if (!user) return
    setFetching(true)
    try {
      const { data, error } = await supabase
        .from('user_contributions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContributions(data || [])
    } catch (error) {
      console.error('Error fetching contributions:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="text-green-600 flex items-center text-xs"><CheckCircle className="w-3 h-3 mr-1" /> 已通过</span>
      case 'rejected':
        return <span className="text-red-600 flex items-center text-xs"><XCircle className="w-3 h-3 mr-1" /> 已拒绝</span>
      default:
        return <span className="text-yellow-600 flex items-center text-xs"><Clock className="w-3 h-3 mr-1" /> 审核中</span>
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif text-red-900">个人中心</h1>
        <button 
          onClick={handleSignOut}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        >
          退出登录
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8 flex items-center border-t-4 border-yellow-500 relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-red-50 to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 bg-red-100 rounded-full mr-6 flex items-center justify-center text-3xl relative z-10 border-2 border-white shadow-sm">
           👤
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1 text-gray-900">{user.user_metadata?.name || user.phone || '用户'}</h2>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <span>{user.user_metadata?.hometown || '未知家乡'}</span>
            <span className="text-gray-300">|</span>
            <span className="font-mono">{user.phone}</span>
          </p>
          <div className="mt-2 inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            🐴 马年基因探索者
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center text-gray-800">
            <span className="mr-2">❤️</span> 我的收藏
          </h3>
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p>暂无收藏内容</p>
            <p className="text-sm mt-2 text-gray-400">快去探索非遗技艺吧！</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center justify-between text-gray-800">
            <div className="flex items-center">
              <span className="mr-2">📤</span> 上传记录
            </div>
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{contributions.length} 条</span>
          </h3>
          
          {fetching ? (
            <div className="py-12 text-center text-gray-400">加载记录中...</div>
          ) : contributions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p>暂无上传记录</p>
              <p className="text-sm mt-2 text-gray-400">分享您身边的年俗故事</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {contributions.map(item => (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-200 transition-colors">
                  <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 mr-3">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">无图</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                    <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
