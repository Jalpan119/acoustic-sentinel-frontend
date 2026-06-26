import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' 
import Dashboard from './Dashboard.tsx' 
import './index.css'

function AppSwitcher() {
  // Default to the safe Dashboard view for all devices
  const [currentView, setCurrentView] = useState<'dashboard' | 'sensor'>('dashboard');

  return (
    <div className="relative min-h-screen">
      {/* Universal Navigation Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setCurrentView(currentView === 'dashboard' ? 'sensor' : 'dashboard')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all border border-indigo-500"
        >
          {currentView === 'dashboard' ? '⚙️ Go to Sensor (Arm)' : '📊 Back to Dashboard'}
        </button>
      </div>
      
      {/* Render the selected component */}
      {currentView === 'dashboard' ? <Dashboard /> : <App />}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppSwitcher />
  </React.StrictMode>,
)