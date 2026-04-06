import FormulaDashboard from './FormulaDashboard';
import { useState } from 'react';

export default function App() {
  // This tells React: "Watch this variable. If it changes, re-draw the app!"
  const [formula, setFormula] = useState({
    id: '1',
    name: 'Midnight Jasmine',
    targetVolumeMl: 100,
    lines: []
  });

  return (
    <FormulaDashboard 
      formula={formula} 
      // This function now tells React to update the state
      onUpdateFormula={(patch) => setFormula({ ...formula, ...patch })} 
    />
  );
}