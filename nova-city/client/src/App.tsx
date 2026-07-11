import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './state/AuthContext';
import { ToastProvider } from './state/ToastContext';
import { ReferenceDataProvider } from './state/ReferenceDataContext';
import { NavShell } from './components/NavShell';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { Dashboard } from './screens/Dashboard';
import { Gym } from './screens/Gym';
import { Crimes } from './screens/Crimes';
import { Jail } from './screens/Jail';
import { Hospital } from './screens/Hospital';
import { Combat } from './screens/Combat';
import { Market } from './screens/Market';
import { Inventory } from './screens/Inventory';
import { Travel } from './screens/Travel';
import { Galaxy } from './screens/Galaxy';
import { Faction } from './screens/Faction';
import { Mail } from './screens/Mail';
import { Leaderboard } from './screens/Leaderboard';

function ProtectedArea() {
  const { character, ready } = useAuth();
  if (!ready) return <div className="loading-screen">Loading NOVA CITY…</div>;
  if (!character) return <Navigate to="/login" replace />;
  return (
    <ReferenceDataProvider>
      <NavShell />
    </ReferenceDataProvider>
  );
}

function GuestArea({ children }: { children: JSX.Element }) {
  const { character, ready } = useAuth();
  if (!ready) return <div className="loading-screen">Loading NOVA CITY…</div>;
  if (character) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<GuestArea><Login /></GuestArea>} />
          <Route path="/register" element={<GuestArea><Register /></GuestArea>} />
          <Route element={<ProtectedArea />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gym" element={<Gym />} />
            <Route path="/crimes" element={<Crimes />} />
            <Route path="/jail" element={<Jail />} />
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/combat" element={<Combat />} />
            <Route path="/market" element={<Market />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/galaxy" element={<Galaxy />} />
            <Route path="/faction" element={<Faction />} />
            <Route path="/mail" element={<Mail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
