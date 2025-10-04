import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Transfer from './Transfer';
import Accounts from './Accounts';
import CardDetail from './CardDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/card/:cardId" element={<CardDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
