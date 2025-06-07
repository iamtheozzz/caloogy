import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import googleLogo from '../g.svg';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isEmailLinkSent, setIsEmailLinkSent] = useState(false);
  const [isEmailLinkMode, setIsEmailLinkMode] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [subscribeNews, setSubscribeNews] = useState(false);

  // 检查是否是邮箱链接登录
  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
          }
          
          if (email) {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            onClose();
          }
        } catch (error) {
          if (error.code && error.code !== 'auth/invalid-action-code') {
            console.error('Email link sign in error:', error);
            setError(getErrorMessage(error));
          }
        }
      }
    };

    handleEmailLinkSignIn();
  }, []);

  // 验证邮箱格式
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // 处理错误信息
  const getErrorMessage = (error) => {
    if (!error.code) return 'An error occurred. Please try again';
    
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/invalid-action-code':
        return 'The sign-in link is invalid or has expired';
      case 'auth/expired-action-code':
        return 'The sign-in link has expired';
      default:
        if (error.code.startsWith('auth/')) {
          console.error('Unhandled auth error code:', error.code);
          return error.message || 'An error occurred. Please try again';
        }
        return '';
    }
  };

  // 验证密码
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      setError('Password should be at least 6 characters');
      return false;
    }
    return true;
  };

  // 验证确认密码
  const validateConfirmPassword = (pass, confirmPass) => {
    if (pass !== confirmPass) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  // 处理密码输入变化
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin && confirmPassword) {
      validateConfirmPassword(newPassword, confirmPassword);
    }
    if (newPassword) {
      validatePassword(newPassword);
    }
  };

  // 处理确认密码输入变化
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (newConfirmPassword) {
      validateConfirmPassword(password, newConfirmPassword);
    }
  };

  // 检查用户是否已有资料
  const checkUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists();
  };

  // 保存用户资料到 Firestore
  const saveUserProfile = async (uid) => {
    try {
      await setDoc(doc(db, "users", uid), {
        firstName,
        lastName,
        birthday,
        email,
        subscribeNews,
        premium: false,
        createdAt: new Date().toISOString()
      });
      setShowProfileForm(false);
      onClose();
    } catch (error) {
      setError('Failed to save profile. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 验证邮箱格式
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // 验证密码
    if (!isEmailLinkMode) {
      if (!password) {
        setError('Please enter your password');
        return;
      }
      if (!validatePassword(password)) {
        return;
      }
      if (!isLogin) {
        if (!confirmPassword) {
          setError('Please confirm your password');
          return;
        }
        if (!validateConfirmPassword(password, confirmPassword)) {
          return;
        }
      }
    }
    
    try {
      if (isEmailLinkMode) {
        const actionCodeSettings = {
          url: window.location.href,
          handleCodeInApp: true
        };
        
        try {
          await sendSignInLinkToEmail(auth, email, actionCodeSettings);
          window.localStorage.setItem('emailForSignIn', email);
          setIsEmailLinkSent(true);
          setError(''); // 清除任何现有错误
        } catch (emailError) {
          console.error('Email link error:', emailError);
          setError(getErrorMessage(emailError));
        }
      } else {
        if (isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const hasProfile = await checkUserProfile(userCredential.user.uid);
          if (!hasProfile) {
            setShowProfileForm(true);
          } else {
            onClose();
          }
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, "users", userCredential.user.uid), {
            email,
            subscribeNews,
            premium: false,
            createdAt: new Date().toISOString()
          });
          setShowProfileForm(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(getErrorMessage(error));
    }
  };

  // 处理资料提交
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !birthday) {
      setError('Please fill in all fields');
      return;
    }
    await saveUserProfile(auth.currentUser.uid);
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            
            {showProfileForm ? (
              <form onSubmit={handleProfileSubmit}>
                <h2>Complete Your Profile</h2>
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
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="auth-button">
                  Complete Profile
                </button>
              </form>
            ) : (
              <>
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {!isEmailLinkMode && (
                    <>
                      <div className="password-input-container">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                      {!isLogin && (
                        <div className="password-input-container">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  
                  {error && <p className="error-message">{error}</p>}
                  
                  <button type="submit" className="auth-button">
                    {isEmailLinkMode 
                      ? 'Send Login Link' 
                      : (isLogin ? 'Login' : 'Sign Up')}
                  </button>
                </form>
                
                <button 
                  className="switch-mode-button"
                  onClick={() => setIsEmailLinkMode(!isEmailLinkMode)}
                >
                  {isEmailLinkMode 
                    ? 'Use Password Instead' 
                    : 'Login with Email Link'}
                </button>
                
                <button 
                  className="switch-mode-button"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </button>
                
                <div className="divider">or</div>
                
                <button 
                  className="google-button"
                  onClick={handleGoogleSignIn}
                >
                  <img src={googleLogo} alt="Google" className="google-logo" />
                  Continue with Google
                </button>
                
                <button 
                  className="guest-button"
                  onClick={handleGuestLogin}
                >
                  Continue as Guest
                </button>

                {!isLogin && !isEmailLinkMode && (
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
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal; 