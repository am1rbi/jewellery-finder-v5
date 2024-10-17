import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useFunnelContext } from './FunnelContext';
import './funnel.css';

const Funnel: React.FC = () => {
  const navigate = useNavigate();
  const { firstName, setFirstName, lastName, setLastName, phoneNumber, setPhoneNumber } = useFunnelContext();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBackClick = () => {
    navigate('/');
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\d{3}-\d{7}|\d{10})$/;
    return phoneRegex.test(phone);
  };

  const handleContinueClick = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'שם פרטי הוא שדה חובה';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'שם משפחה הוא שדה חובה';
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'מספר טלפון הוא שדה חובה';
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'מספר הטלפון אינו תקין. יש להזין בפורמט XXX-XXXXXXX או XXXXXXXXXX';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate('/budget');
    }
  };

  return (
    <div className="funnel-page">
      <div className="progress-container">
        <button className="back-button" onClick={handleBackClick}>
          <FaArrowRight />
        </button>
        <div className="progress-bar">
          <div className="progress" style={{ width: '25%' }}></div>
        </div>
      </div>

      <div className="funnel-content">
        <h1>הזינו את הפרטים שלכם</h1>
        <input
          type="text"
          placeholder="שם פרטי (חובה)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="name-input"
        />
        {errors.firstName && <div className="error-message">{errors.firstName}</div>}

        <input
          type="text"
          placeholder="שם משפחה (חובה)"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="name-input"
        />
        {errors.lastName && <div className="error-message">{errors.lastName}</div>}

        <input
          type="tel"
          placeholder="מספר טלפון נייד"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="phone-input"
        />
        {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}

        <button className="continue-button" onClick={handleContinueClick}>המשך</button>
      </div>
    </div>
  );
};

export default Funnel;