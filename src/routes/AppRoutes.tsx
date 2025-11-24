import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import DispatchMap from '../pages/DispatchMap';
import Fleet from '../pages/Fleet';
import Incidents from '../pages/Incidents';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<DispatchMap />} />
        <Route path="fleet" element={<Fleet />} />
        <Route path="incidents" element={<Incidents />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;