
CREATE OR REPLACE FUNCTION toggle_like(p_user_id UUID, p_contribution_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Check if like exists
    SELECT EXISTS (
        SELECT 1 FROM contribution_likes
        WHERE user_id = p_user_id AND contribution_id = p_contribution_id
    ) INTO v_exists;

    IF v_exists THEN
        -- Unlike
        DELETE FROM contribution_likes
        WHERE user_id = p_user_id AND contribution_id = p_contribution_id;

        UPDATE user_contributions
        SET likes = likes - 1
        WHERE id = p_contribution_id;

        RETURN FALSE; -- Indicates "unliked"
    ELSE
        -- Like
        INSERT INTO contribution_likes (user_id, contribution_id)
        VALUES (p_user_id, p_contribution_id);

        UPDATE user_contributions
        SET likes = likes + 1
        WHERE id = p_contribution_id;

        RETURN TRUE; -- Indicates "liked"
    END IF;
END;
$$ LANGUAGE plpgsql;
