import { useEffect, useState } from 'react';

function Dashboard() {
  const [logs, setLogs] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  // New State: Controls the full-screen visual flash
  const [isFlashing, setIsFlashing] = useState(false);
  
  const TOPIC_NAME = "jalpan-sentinel-6a-to-10-xyz";

  useEffect(() => {
    if (!isMonitoring) return;

    console.log(`🔌 Laptop Dashboard connected to channel: ${TOPIC_NAME}`);
    const eventSource = new EventSource(`https://ntfy.sh/${TOPIC_NAME}/sse`);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        
        if (parsedData.event === "message") {
          setLogs((prev) => [parsedData.message, ...prev]);

          // Swapped to a much louder, highly piercing, and sustained alarm clock sound
          const loudAlarm = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
          loudAlarm.volume = 1.0; // Force maximum browser volume
          loudAlarm.play().catch(e => console.log("Audio blocked by browser:", e));

          // Trigger the toast and the full-screen flash
          setToast(parsedData.message);
          setIsFlashing(true);
          
          // Turn off the visual flash after 2 seconds
          setTimeout(() => {
            setIsFlashing(false);
          }, 2000);

          // Hide the toast after 5 seconds
          setTimeout(() => {
            setToast(null);
          }, 5000);
        }
      } catch (err) {
        console.error("Error decoding stream packet:", err);
      }
    };

    return () => eventSource.close();
  }, [isMonitoring]);

  if (!isMonitoring) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-400 mb-4">🖥️ Subscriber Dashboard</h1>
          <p className="text-slate-400 mb-8">Click below to connect to the SSE pipeline and enable audio alerts.</p>
          <button 
            onClick={() => setIsMonitoring(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors"
          >
            Start Monitoring Pipeline
          </button>
        </div>
      </div>
    );
  }

  return (
    // Added a transition to the background color that snaps to dark red when flashing
    <div className={`relative min-h-screen text-white p-8 font-sans overflow-hidden transition-colors duration-300 ${isFlashing ? 'bg-red-900' : 'bg-slate-900'}`}>
      
      <div 
        className={`absolute top-6 right-6 max-w-sm w-full bg-slate-800 border-l-4 border-emerald-500 p-4 rounded-lg shadow-2xl transition-all duration-500 z-50 ${
          toast ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔔</div>
          <div>
            <h4 className="font-bold text-emerald-400 text-md">Doorbell Ring Detected!</h4>
            <p className="text-slate-300 text-sm mt-1">{toast}</p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 mt-12">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-emerald-400">🖥️ Subscriber Dashboard</h1>
          <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE
          </span>
        </div>
        
        <p className="text-slate-400 text-sm mb-6">Monitoring channel: <code className="bg-slate-900 px-2 py-1 rounded text-amber-400">{TOPIC_NAME}</code></p>
        
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Live Event Logs</h3>
          {logs.length === 0 ? (
            <div className="text-slate-500 text-sm italic p-4 bg-slate-900 rounded-xl text-center">Awaiting incoming events from edge sensors...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-sm animate-fadeIn">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;