import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';

const StudentVerificationModal = ({ user, userProfile, onClose, onVerificationComplete }) => {
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [eduEmail, setEduEmail] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async () => {
    if (!school || !major || !graduationYear || !eduEmail) {
      setError('Please fill in all required fields');
      return;
    }

    setIsVerifying(true);
    try {
      // 计算开始和结束时间
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 一个月后

      // 更新用户资料
      const updatedProfile = {
        ...userProfile,
        studentVerification: {
          school,
          major,
          graduationYear,
          eduEmail,
          verificationStatus: 'valid',
          verificationDate: startDate.toISOString()
        },
        premium: true,
        premiumStartDate: startDate.toISOString(),
        premiumEndDate: endDate.toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 保存到数据库
      await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });

      // 发送验证邮件
      try {
        await sendEmailVerification(user, {
          url: window.location.href,
          handleCodeInApp: true,
          email: eduEmail
        });
        
        // 更新成功
        onVerificationComplete(updatedProfile);
        onClose();
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        setError('Failed to send verification email. Please try again.');
        // 如果邮件发送失败，回滚 premium 状态
        const rollbackProfile = {
          ...updatedProfile,
          premium: false,
          premiumStartDate: null,
          premiumEndDate: null,
          studentVerification: {
            ...updatedProfile.studentVerification,
            verificationStatus: 'pending'
          }
        };
        await setDoc(doc(db, "users", user.uid), rollbackProfile, { merge: true });
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      setError('Failed to submit verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      className="auth-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="auth-modal student-verification-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Student Verification</h2>
        
        <div className="user-info">
          <div className="info-row">
            <strong>Account Email:</strong>
            <input
              type="email"
              value={user?.email || ''}
              disabled
            />
          </div>
          <div className="info-row">
            <strong>First Name:</strong>
            <input
              type="text"
              value={userProfile?.firstName || ''}
              disabled
            />
          </div>
          <div className="info-row">
            <strong>Last Name:</strong>
            <input
              type="text"
              value={userProfile?.lastName || ''}
              disabled
            />
          </div>
          <div className="info-row">
            <strong>Birthday:</strong>
            <input
              type="text"
              value={userProfile?.birthday ? new Date(userProfile.birthday).toLocaleDateString() : ''}
              disabled
            />
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleVerification(); }}>
          <input
            type="text"
            placeholder="School Name"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Graduation Year"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            min="2024"
            max="2030"
            required
          />

          <div className="edu-email-section">
            <input
              type="email"
              placeholder="My Education Email"
              value={eduEmail}
              onChange={(e) => setEduEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Student Status'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StudentVerificationModal; 