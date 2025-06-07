import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileModal from './ProfileModal';

const AuthButton = ({ onShowAuthModal }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            setUserProfile(profileData);
            // 如果用户没有填写资料，显示资料填写模态框
            if (!profileData.firstName || !profileData.lastName || !profileData.birthday) {
              setShowProfileModal(true);
            }
          } else {
            // 如果用户文档不存在，创建新文档并显示资料填写模态框
            setShowProfileModal(true);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          if (error.code === 'permission-denied') {
            console.error('Permission denied. Please check Firestore rules.');
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        if (!user) {
          throw new Error('No user logged in');
        }

        // 1. 更新 Firestore 文档
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          accountvalid: false,
          deletedAt: new Date().toISOString()
        });

        // 2. 删除 Firestore 中的用户文档
        await deleteDoc(userRef);

        // 3. 删除 Firebase Auth 中的用户
        await deleteUser(user);
        
        // 4. 显示成功消息
        alert('Account deleted successfully');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account. Please try again.');
      }
    }
  };

  if (!user) {
    return (
      <button className="auth-button" onClick={onShowAuthModal}>
        Sign In
      </button>
    );
  }

  return (
    <div className="auth-button-container" ref={dropdownRef}>
      <button 
        className={`auth-button profile-button ${userProfile?.premium ? 'premium' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {userProfile?.firstName || 'Profile'}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            className="profile-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button onClick={() => {
              setShowProfileModal(true);
              setShowDropdown(false);
            }}>
              Profile
            </button>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={handleDeleteAccount} className="delete-account">
              Delete Account
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileModal && (
          <ProfileModal 
            user={user}
            userProfile={userProfile}
            onClose={() => setShowProfileModal(false)}
            onProfileUpdate={(updatedProfile) => setUserProfile(updatedProfile)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthButton; 