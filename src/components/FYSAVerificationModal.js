import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';

const FYSAVerificationModal = ({ user, userProfile, onClose, onVerificationComplete }) => {
  const [formData, setFormData] = useState({
    eduEmail: '',
    school: '',
    major: '',
    graduationYear: '',
    subscribeToNewsletter: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update Firestore database
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fysaRegistration: {
          eduEmail: formData.eduEmail,
          school: formData.school,
          major: formData.major,
          graduationYear: formData.graduationYear,
          subscribeToNewsletter: formData.subscribeToNewsletter,
          registrationDate: new Date().toISOString()
        }
      });

      // Send verification email
      await sendEmailVerification(user);

      // Update local state
      onVerificationComplete({
        ...userProfile,
        fysaRegistration: formData
      });

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error during FYSA registration:', error);
      setError('An error occurred during registration. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fysa-modal-overlay">
      <div className="fysa-modal">
        <div className="modal-header">
          <h2>FYSA Registration</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="eduEmail">Educational Email</label>
            <input
              type="email"
              id="eduEmail"
              name="eduEmail"
              value={formData.eduEmail}
              onChange={handleChange}
              required
              placeholder="Enter your educational email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="school">School</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              placeholder="Enter your school name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="major">Major</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
              placeholder="Enter your major"
            />
          </div>

          <div className="form-group">
            <label htmlFor="graduationYear">Graduation Year</label>
            <input
              type="number"
              id="graduationYear"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              required
              min="2024"
              max="2030"
              placeholder="Enter your expected graduation year"
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="subscribeToNewsletter"
                checked={formData.subscribeToNewsletter}
                onChange={handleChange}
              />
              Subscribe to FYSA news and event notifications
            </label>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FYSAVerificationModal; 