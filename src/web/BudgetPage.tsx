import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useFunnelContext } from './FunnelContext';
import './funnel.css';

const BudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const { lowerBound, setLowerBound, upperBound, setUpperBound } = useFunnelContext();

  const handleBackClick = () => {
    navigate('/funnel');
  };

  const handleContinueClick = () => {
    navigate('/due-date');
  };

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setUpperBound(value);
  };

  const formatBudget = (value: number) => {
    return `₪${value.toLocaleString('he-IL')}`;
  };

  return (
    <div className="funnel-page">
      <div className="progress-container">
        <button className="back-button" onClick={handleBackClick}>
          <FaArrowRight />
        </button>
        <div className="progress-bar">
          <div className="progress" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div className="funnel-content">
        <h1>מה התקציב שלך?</h1>
        <div className="budget-inputs">
        <input
          type="text"
          value={formatBudget(upperBound)}
          readOnly
        />
        <span> - </span>
        <input
          type="text"
          value={formatBudget(lowerBound)}
          readOnly
        />
        </div>
        <input
          type="range"
          min={1000}
          max={20000}
          step={500}
          value={upperBound}
          onChange={handleBudgetChange}
          className="budget-slider"
        />

        <button className="continue-button" onClick={handleContinueClick}>המשך</button>
      </div>
    </div>
  );
};

export default BudgetPage;