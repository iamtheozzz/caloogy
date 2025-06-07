import React from 'react';
import { motion } from 'framer-motion';

const PremiumModal = ({ onClose, onUpgrade }) => {
  const plans = [
    {
      duration: '1 Month',
      price: 19.99,
      period: 'm',
      popular: false
    },
    {
      duration: '3 Months',
      price: 17.99,
      period: 'm',
      popular: true
    },
    {
      duration: '1 Year',
      price: 14.99,
      period: 'm',
      popular: false
    }
  ];

  return (
    <motion.div
      className="premium-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="premium-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="premium-ribbon"></div>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="premium-content">
          <h2>Upgrade to Premium</h2>
          <div className="premium-features">
            <div className="feature">
              <span className="feature-icon">✨</span>
              <p>Exclusive AI Features</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🚀</span>
              <p>Priority Access</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <p>Advanced Analytics</p>
            </div>
          </div>
          
          <div className="premium-plans">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`premium-plan ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3>{plan.duration}</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                <button 
                  className="premium-upgrade-button"
                  onClick={() => onUpgrade(plan)}
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PremiumModal; 