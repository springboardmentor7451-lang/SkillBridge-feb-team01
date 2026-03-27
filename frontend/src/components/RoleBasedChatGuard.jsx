import React, { useEffect, useState } from 'react';
import { Alert, Spin } from 'antd';
import { useAuth } from '../context/AuthContext';
import { canChatWith } from '../services/chatService';

/**
 * RoleBasedChatGuard - Validates if current user can chat with target user
 * 
 * Rules:
 * - Volunteers can only chat with NGOs they've applied to
 * - NGOs can only chat with volunteers who applied to their opportunities
 * - Prevents random/unrelated chats
 */
const RoleBasedChatGuard = ({ targetUserId, children, onUnauthorized }) => {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [canChat, setCanChat] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      if (!targetUserId || !user) {
        setChecking(false);
        return;
      }

      try {
        const allowed = await canChatWith(targetUserId);
        setCanChat(allowed);
      } catch (error) {
        setCanChat(false);
      } finally {
        setChecking(false);
      }
    };

    checkPermission();
  }, [targetUserId, user]);

  if (checking) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin tip="Verifying chat permissions..." />
      </div>
    );
  }

  if (!canChat) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    
    return (
      <Alert
        type="warning"
        showIcon
        message="Chat Not Available"
        description={
          user?.role === 'volunteer'
            ? 'You can only chat with NGOs for opportunities you have applied to.'
            : 'You can only chat with volunteers who have applied to your opportunities.'
        }
        style={{ margin: '20px' }}
      />
    );
  }

  return <>{children}</>;
};

export default RoleBasedChatGuard;
