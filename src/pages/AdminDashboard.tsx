import React, { useEffect, useState } from 'react'
import { useAuth, supabase } from '../components/AuthProvider'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X, Loader2, ArrowLeft, Eye } from 'lucide-react'

interface Contribution {
  id: string
  title: string
  description: string
  category: string
  region: string
  images: string[]
  created_at: string
  status: 'pending' | 'approved' | 'rejected'
  user_id: string
  user?: {
    name: string
    phone: string
  }
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'admin' && user.phone !== '13800138000') {
       // Check permission
    }

    fetchPendingContributions()
  }, [user, navigate])

  const fetchPendingContributions = async () => {
    try {
      setLoading(true)
      
      // Try to fetch with user details first
      const { data, error } = await supabase
        .from('user_contributions')
        .select(`
          *,
          user:users!user_contributions_user_id_fkey ( name, phone )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) {
         console.warn("Join fetch failed, falling back to simple fetch", error)
         // Fallback: fetch contributions without user details
         const { data: simpleData, error: simpleError } = await supabase
            .from('user_contributions')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            
         if (simpleError) throw simpleError
         
         // If we have contributions, let's try to fetch user info manually for them
         if (simpleData && simpleData.length > 0) {
            const userIds = [...new Set(simpleData.map(c => c.user_id))]
            const { data: users } = await supabase
              .from('users')
              .select('id, name, phone')
              .in('id', userIds)
              
            const usersMap = new Map(users?.map(u => [u.id, u]))
            
            const enrichedData = simpleData.map(c => ({
              ...c,
              user: usersMap.get(c.user_id)
            }))
            setContributions(enrichedData)
         } else {
            setContributions(simpleData || [])
         }
         return
      }
      
      setContributions(data || [])
    } catch (error) {
      console.error('Error fetching contributions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setActionLoading(id)
      const { error } = await supabase
        .from('user_contributions')
        .update({ 
          status, 
          reviewer_id: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setContributions(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error updating status:', error)
      alert('操作失败')
    } finally {
      setActionLoading(null)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">非遗内容审核后台</h1>
          </div>
          <div className="text-sm text-gray-500">
            管理员: {user.user_metadata?.name || user.phone}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : contributions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">暂无待审核内容</h3>
            <p className="text-gray-500">所有提交的内容都已处理完毕。</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {contributions.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 md:h-auto bg-gray-100 flex-shrink-0 relative group">
                  {item.images && item.images.length > 0 ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      无图片
                    </div>
                  )}
                  {item.images && item.images.length > 0 && (
                     <a 
                       href={item.images[0]} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                     >
                       <Eye className="w-6 h-6 mr-2" /> 查看大图
                     </a>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">{item.category}</span>
                        <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md">{item.region}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.description}</p>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <span className="font-medium mr-2">提交人:</span> 
                      {/* @ts-ignore */}
                      {item.user?.name || '未知用户'} ({item.user?.phone || item.user_id})
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handleReview(item.id, 'approved')}
                      disabled={actionLoading === item.id}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {actionLoading === item.id ? <Loader2 className="animate-spin w-4 h-4" /> : <><Check className="w-4 h-4 mr-1" /> 通过</>}
                    </button>
                    <button
                      onClick={() => handleReview(item.id, 'rejected')}
                      disabled={actionLoading === item.id}
                      className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {actionLoading === item.id ? <Loader2 className="animate-spin w-4 h-4" /> : <><X className="w-4 h-4 mr-1" /> 拒绝</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
