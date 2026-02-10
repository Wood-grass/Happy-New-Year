import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  return (
    <div className="relative min-h-screen">
      {!isHome && (
        <button
          onClick={() => navigate('/')}
          className="fixed top-4 left-4 z-50 p-3 bg-white/80 backdrop-blur-sm hover:bg-white text-red-800 rounded-full shadow-lg border border-red-100 transition-all duration-300 hover:scale-105 group"
          aria-label="返回首页"
        >
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium text-sm">
              返回首页
            </span>
          </div>
        </button>
      )}
      {children}
    </div>
  )
}

export default Layout
