import './index.css';
import { useMicrophone } from './useMicrophone';

function App() {
  
  // Notice we dropped the '80' parameter! The AI handles the threshold now.
  const { isListening, isAlarming, startListening, stopListening, confidence } = useMicrophone();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center font-sans">
      
      <div className="bg-white w-[350px] p-6 rounded-2xl shadow-lg flex flex-col gap-4">
        
        {/* The Header Area */}
        <div className="flex justify-between items-center">
          <div 
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAlarming 
                ? 'bg-red-50 text-red-600' 
                : isListening 
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isAlarming ? 'ALARM TRIGGERED!' : isListening ? 'AI Monitoring...' : 'System Offline'}
          </div>
          
          {/* New UI: Real-time AI Confidence Score */}
          {isListening && !isAlarming && (
             <div className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
               Match: {confidence}%
             </div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900">
          Living Room Sensor
        </h2>
        
        <p className="text-gray-500 text-sm leading-relaxed h-12">
          {isAlarming 
            ? 'Acoustic pattern matched! Alerting devices...'
            : isListening
            ? 'Neural network active. Listening for specific acoustic signature...'
            : 'Sensor is disarmed. Click below to load the AI model.'
          }
        </p>

        <button 
          onClick={isListening ? stopListening : startListening}
          className={`px-4 py-3 rounded-lg font-medium transition-colors text-white mt-2 ${
            isAlarming
              ? 'bg-red-600 hover:bg-red-700'
              : isListening 
                ? 'bg-gray-800 hover:bg-gray-900' 
                : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isAlarming 
            ? 'Silence Alarm & Reset' 
            : isListening 
              ? 'Disarm Sensor (AI Off)' 
              : 'Arm Sensor (AI On)'}
        </button>

      </div>
    </div>
  );
}

export default App;