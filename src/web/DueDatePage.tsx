import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useFunnelContext, FunnelData } from './FunnelContext';
import './funnel.css';

const DueDatePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    dueDate, setDueDate, specificDate, setSpecificDate,
    firstName, lastName, phoneNumber, lowerBound, upperBound, uploadedImages
  } = useFunnelContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    navigate('/budget');
  };

  const handleContinueClick = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!dueDate) {
      setError('Please select a due date option');
      setIsSubmitting(false);
      return;
    }

    if (dueDate === 'specific' && !specificDate) {
      setError('Please select a specific date');
      setIsSubmitting(false);
      return;
    }

    const funnelData: FunnelData = {
      firstName,
      lastName,
      phoneNumber,
      lowerBound,
      upperBound,
      dueDate,
      specificDate,
      uploadedImages
    };

    try {
      // In a real application, you would send this data to a backend server
      // For now, we'll just log it and navigate to the success page
      console.log('Submitting funnel data:', funnelData);
      
      // Navigate to the success page with the funnel data
      navigate('/success', { state: { funnelData } });
    } catch (error) {
      console.error('Error submitting funnel data:', error);
      setError('An error occurred while submitting the data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="funnel-page">
      <div className="progress-container">
        <button className="back-button" onClick={handleBackClick}>
          <FaArrowRight />
        </button>
        <div className="progress-bar">
          <div className="progress" style={{ width: '75%' }}></div>
        </div>
      </div>

      <div className="funnel-content">
        <h1>מתי אתה צריך את התכשיט?</h1>
        <div className="due-date-options">
          <button
            className={dueDate === 'now' ? 'selected' : ''}
            onClick={() => setDueDate('now')}
          >
            עכשיו
          </button>
          <button
            className={dueDate === 'week' ? 'selected' : ''}
            onClick={() => setDueDate('week')}
          >
            תוך שבוע
          </button>
          <button
            className={dueDate === 'month' ? 'selected' : ''}
            onClick={() => setDueDate('month')}
          >
            תוך חודש
          </button>
          <button
            className={dueDate === 'specific' ? 'selected' : ''}
            onClick={() => setDueDate('specific')}
          >
            תאריך ספציפי
          </button>
        </div>
        {dueDate === 'specific' && (
          <input
            type="date"
            value={specificDate}
            onChange={(e) => setSpecificDate(e.target.value)}
            className="specific-date-input"
          />
        )}
        {error && <div className="error-message">{error}</div>}
        <button 
          className="continue-button" 
          onClick={handleContinueClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'שולח...' : 'שלח'}
        </button>
      </div>
    </div>
  );
};

export default DueDatePage;