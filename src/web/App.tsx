import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { FunnelProvider } from './FunnelContext';
import LandingPage from './LandingPage';
import Funnel from './Funnel';
import BudgetPage from './BudgetPage';
import DueDatePage from './DueDatePage';
import SuccessPage from './SuccessPage';
import AdminPage from './AdminPage';

const App: React.FC = () => {
  return (
    <FunnelProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/funnel" element={<Funnel />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/due-date" element={<DueDatePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </FunnelProvider>
  );
};

export default App;