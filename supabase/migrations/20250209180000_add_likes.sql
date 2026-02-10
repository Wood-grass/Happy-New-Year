
-- Add likes column to user_contributions
ALTER TABLE user_contributions ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Create contribution_likes table
CREATE TABLE IF NOT EXISTS contribution_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contribution_id UUID REFERENCES user_contributions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, contribution_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_contribution_likes_user_id ON contribution_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_contribution_likes_contribution_id ON contribution_likes(contribution_id);
