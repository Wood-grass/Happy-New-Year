
import React, { useState } from 'react'
import { Heart, MapPin, User as UserIcon } from 'lucide-react'
import { supabase, useAuth } from './AuthProvider'

export interface Contribution {
  id: string
  title: string
  description: string
  images: string[]
  likes: number
  region: string
  category: string
  users?: {
    name: string
    avatar_url?: string
    hometown?: string
  }
}

interface Props {
  contribution: Contribution
  onLikeToggle?: (newLikes: number, isLiked: boolean) => void
}

const ContributionCard: React.FC<Props> = ({ contribution, onLikeToggle }) => {
  const { user } = useAuth()
  const [likes, setLikes] = useState(contribution.likes || 0)
  const [isLiked, setIsLiked] = useState(false) // In a real app, we'd check this from DB
  const [loading, setLoading] = useState(false)

  // Check if user liked this contribution on mount
  React.useEffect(() => {
    if (user) {
      checkIfLiked()
    }
  }, [user, contribution.id])

  const checkIfLiked = async () => {
    if (!user) return
    const { data } = await supabase
      .from('contribution_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('contribution_id', contribution.id)
      .maybeSingle()
    
    if (data) setIsLiked(true)
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if wrapped in Link
    e.stopPropagation()
    
    if (!user) {
      alert('请先登录后点赞')
      return
    }
    if (loading) return

    setLoading(true)
    try {
      // Optimistic update
      const newIsLiked = !isLiked
      const newLikes = newIsLiked ? likes + 1 : likes - 1
      
      setIsLiked(newIsLiked)
      setLikes(newLikes)

      const { data, error } = await supabase.rpc('toggle_like', {
        p_user_id: user.id,
        p_contribution_id: contribution.id
      })

      if (error) throw error

      // Verify result matches optimistic state
      if (data !== newIsLiked) {
        // Revert if mismatch (shouldn't happen often)
        setIsLiked(data)
        setLikes(data ? likes + 1 : likes - 1)
      }
      
      if (onLikeToggle) onLikeToggle(newLikes, newIsLiked)

    } catch (err) {
      console.error('Error toggling like:', err)
      // Revert
      setIsLiked(!isLiked)
      setLikes(isLiked ? likes + 1 : likes - 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      <div className="h-48 overflow-hidden relative bg-gray-100">
        {contribution.images && contribution.images.length > 0 ? (
          <img 
            src={contribution.images[0]} 
            alt={contribution.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            无图片
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {contribution.region}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {contribution.category}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1 group-hover:text-red-600 transition-colors">
          {contribution.title}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {contribution.description}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center text-gray-600 text-sm">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-2">
              {contribution.users?.avatar_url ? (
                <img src={contribution.users.avatar_url} alt={contribution.users.name || 'User'} />
              ) : (
                <UserIcon className="w-3 h-3 text-gray-500" />
              )}
            </div>
            <span className="truncate max-w-[80px]">{contribution.users?.name || '匿名用户'}</span>
          </div>
          
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors ${
              isLiked 
                ? 'text-red-600 bg-red-50' 
                : 'text-gray-500 hover:text-red-500 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContributionCard
