import { useState } from 'react';
import HouseholdManual from './HouseholdManual';
import FormulaDashboard from './FormulaDashboard';

export default function App() {
  const [activeApp, setActiveApp] = useState('menu');

  if (activeApp === 'olfacta') {
    return <FormulaDashboard 
      formula={{ id: '1', name: 'Midnight Jasmine', targetVolumeMl: 100, lines: [] }} 
      onUpdateFormula={(patch) => console.log('Update:', patch)} 
    />;
  }
  
  if (activeApp === 'manual') return <HouseholdManual />;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 p-4">
      <h1 className="text-3xl font-bold mb-8">My HK Startup Suite</h1>
      <div className="space-y-4">
        <button className="block w-64 p-4 bg-white shadow rounded-lg text-lg font-semibold hover:bg-blue-50 border" onClick={() => setActiveApp('olfacta')}>Olfacta (Perfume)</button>
        <button className="block w-64 p-4 bg-white shadow rounded-lg text-lg font-semibold hover:bg-blue-50 border" onClick={() => setActiveApp('manual')}>Helper Manual</button>
      </div>
    </div>
  );
}