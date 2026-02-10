-- 用户表 (users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(100),
  avatar_url TEXT,
  hometown VARCHAR(100),
  birth_year INTEGER,
  gene_profile JSONB,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'inheritor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_gene_profile ON users USING GIN(gene_profile);

-- 用户上传内容表 (user_contributions)
CREATE TABLE IF NOT EXISTS user_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  images TEXT[], -- 存储图片URL数组
  video_url TEXT,
  category VARCHAR(50),
  region VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES users(id),
  review_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON user_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON user_contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON user_contributions(created_at DESC);

-- 访问权限设置
-- 用户上传内容权限
GRANT SELECT ON user_contributions TO anon;
GRANT ALL ON user_contributions TO authenticated;

-- 创建行级安全策略
ALTER TABLE user_contributions ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的待审核内容
-- Note: This assumes user_id in user_contributions matches auth.uid()
CREATE POLICY user_view_own_pending ON user_contributions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR status != 'pending');

-- 审核员可以查看和更新所有内容
CREATE POLICY admin_manage_all ON user_contributions
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  ));
