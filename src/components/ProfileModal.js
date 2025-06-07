import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PremiumModal from './PremiumModal';

const ProfileModal = ({ user, userProfile, onClose, onProfileUpdate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [subscribeNews, setSubscribeNews] = useState(false);
  const [error, setError] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // 当 userProfile 更新时，更新表单数据
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
      setBirthday(userProfile.birthday || '');
      setSubscribeNews(userProfile.subscribeNews || false);
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !birthday) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const updatedProfile = {
        firstName,
        lastName,
        birthday,
        email: user.email,
        subscribeNews,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
      
      // 通过 props 更新父组件中的状态
      onProfileUpdate(updatedProfile);
      
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied. Please check your authentication status.');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    }
  };

  const handleUpgradeToPremium = () => {
    setShowPremiumModal(true);
  };

  const handlePremiumUpgrade = async (plan) => {
    try {
      // 检查是否已过期
      if (userProfile?.premiumEndDate) {
        const endDate = new Date(userProfile.premiumEndDate);
        const now = new Date();
        if (endDate < now) {
          // 如果已过期，更新 premium 状态为 false
          const updatedProfile = {
            ...userProfile,
            premium: false,
            premiumPlan: null,
            premiumStartDate: null,
            premiumEndDate: null,
            updatedAt: new Date().toISOString()
          };
          await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
          onProfileUpdate(updatedProfile);
        }
      }

      // 显示支付提示
      setError('Payment system is coming soon. Please check back later.');
      setShowPremiumModal(false);
    } catch (error) {
      console.error('Error handling premium upgrade:', error);
      setError('Failed to process upgrade. Please try again.');
    }
  };

  // 修改 PremiumStatus 组件
  const PremiumStatus = ({ userProfile }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      if (userProfile?.premiumEndDate) {
        const updateTimeLeft = () => {
          const end = new Date(userProfile.premiumEndDate);
          const now = new Date();
          const diff = end - now;

          if (diff <= 0) {
            // 如果过期，更新数据库中的 premium 状态
            const updatePremiumStatus = async () => {
              try {
                const updatedProfile = {
                  ...userProfile,
                  premium: false,
                  premiumPlan: null,
                  premiumStartDate: null,
                  premiumEndDate: null,
                  updatedAt: new Date().toISOString()
                };
                await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
                onProfileUpdate(updatedProfile);
              } catch (error) {
                console.error('Error updating premium status:', error);
              }
            };
            updatePremiumStatus();
            setTimeLeft('Expired');
            return;
          }

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          setTimeLeft(`${days}d ${hours}h ${minutes}m remaining`);
        };

        updateTimeLeft();
        const timer = setInterval(updateTimeLeft, 60000); // Update every minute
        return () => clearInterval(timer);
      }
    }, [userProfile?.premiumEndDate]);

    return (
      <div className="premium-status">
        <p>Premium expires: {new Date(userProfile.premiumEndDate).toLocaleDateString()}</p>
        <p className="time-left">{timeLeft}</p>
      </div>
    );
  };

  return (
    <>
      <motion.div
        className="auth-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="auth-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>×</button>
          
          <h2>Edit Profile</h2>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
            <div className="subscribe-option">
              <label>
                <input
                  type="checkbox"
                  checked={subscribeNews}
                  onChange={(e) => setSubscribeNews(e.target.checked)}
                />
                Subscribe to Caloogy news and updates
              </label>
            </div>
            {userProfile?.premium ? (
              <PremiumStatus userProfile={userProfile} />
            ) : (
              <button 
                type="button" 
                className="premium-button"
                onClick={handleUpgradeToPremium}
              >
                Upgrade to Premium
              </button>
            )}
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="auth-button">
              Save Changes
            </button>
          </form>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showPremiumModal && (
          <PremiumModal
            onClose={() => setShowPremiumModal(false)}
            onUpgrade={handlePremiumUpgrade}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileModal; 