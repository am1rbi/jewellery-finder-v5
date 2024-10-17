import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FunnelData } from './FunnelContext';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const funnelData = location.state?.funnelData as FunnelData;

  useEffect(() => {
    if (funnelData) {
      const savedData = JSON.parse(localStorage.getItem('funnelData') || '[]');
      const newEntry = {
        ...funnelData,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      const isDuplicate = savedData.some((entry: FunnelData & { id: string }) => 
        entry.firstName === newEntry.firstName &&
        entry.lastName === newEntry.lastName &&
        entry.phoneNumber === newEntry.phoneNumber
      );

      if (!isDuplicate) {
        savedData.push(newEntry);
        localStorage.setItem('funnelData', JSON.stringify(savedData));
      }
    } else {
      navigate('/');
    }
  }, [funnelData, navigate]);

  if (!funnelData) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);
  };

  const getDueDateText = (dueDate: string, specificDate: string) => {
    switch (dueDate) {
      case 'now': return 'מיידי';
      case 'week': return 'תוך שבוע';
      case 'month': return 'תוך חודש';
      case 'specific': return specificDate;
      default: return 'לא צוין';
    }
  };

  return (
    <div className="success-page">
      <div className="success-content">
        <FaCheckCircle className="success-icon" />
        <h1>תודה רבה!</h1>
        <p>קיבלנו את הפרטים שלך ונחזור אליך בהקדם.</p>
        <div className="summary">
          <h2>סיכום הפרטים:</h2>
          <div className="summary-item">
            <span className="summary-label">שם מלא:</span>
            <span className="summary-value">{`${funnelData.firstName} ${funnelData.lastName}`}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">טלפון:</span>
            <span className="summary-value">{funnelData.phoneNumber}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">תקציב:</span>
            <span className="summary-value">{`${formatCurrency(funnelData.lowerBound)} - ${formatCurrency(funnelData.upperBound)}`}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">תאריך יעד:</span>
            <span className="summary-value">{getDueDateText(funnelData.dueDate, funnelData.specificDate)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">מספר תמונות שהועלו:</span>
            <span className="summary-value">{funnelData.uploadedImages.length}</span>
          </div>
        </div>
        <button className="home-button" onClick={() => navigate('/')}>חזרה לדף הבית</button>
      </div>
    </div>
  );
};

export default SuccessPage;