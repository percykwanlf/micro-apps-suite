import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Menu, X } from 'lucide-react';

const CATEGORIES = ['Cleaning', 'Cooking/Recipes', 'Laundry', 'Emergency/Contacts', 'Misc Rules'];

export default function HouseholdManual() {
  const [instructions, setInstructions] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Load/Save Logic
  useEffect(() => {
    const saved = localStorage.getItem('helper_manual_data');
    if (saved) setInstructions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('helper_manual_data', JSON.stringify(instructions));
  }, [instructions]);

  // Logic to add
  const addInstruction = () => {
    if (!newTitle || !newDesc) return;
    const newItem = { id: Date.now(), title: newTitle, desc: newDesc, category: activeCategory };
    setInstructions([...instructions, newItem]);
    setNewTitle(''); setNewDesc('');
  };

  const deleteInstruction = (id) => setInstructions(instructions.filter(i => i.id !== id));

  const filtered = instructions.filter(i => 
    i.category === activeCategory && 
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Manual</h2>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} 
            className={`w-full text-left p-3 rounded mb-2 ${activeCategory === cat ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">{activeCategory}</h1>
        
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <input className="w-full p-2 mb-2 border rounded" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <textarea className="w-full p-2 mb-4 border rounded" placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <button onClick={addInstruction} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <Plus size={18} /> Add Instruction
          </button>
        </div>

        {/* List */}
        {filtered.map(item => (
          <div key={item.id} className="bg-white p-4 mb-4 rounded shadow border flex justify-between">
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
            <button onClick={() => deleteInstruction(item.id)} className="text-red-500"><Trash2 size={18}/></button>
          </div>
        ))}
      </main>
    </div>
  );
}