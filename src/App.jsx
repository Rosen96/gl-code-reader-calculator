import React, { useState, useMemo } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { InputSection } from './components/InputSection';
import { ResultsTable } from './components/ResultsTable';
import { filterGLCodes, calculateAmounts } from './lib/logic';
import { LayoutDashboard, Moon, Sun } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    marketplace: "Website",
    event: "Order Shipped",
    event2: "",
    event3: "",
    product: "PassengerTires",
    paymentType: "BAMS",
    atdSupplied: true,
    vip: true,
    platformFee: false,
    orderType: "STS",
    discounts: true
  });

  const [inputData1, setInputData1] = useState([]);
  const [inputData2, setInputData2] = useState([]);
  const [inputData3, setInputData3] = useState([]);

  // Calculate results for each event
  const results1 = useMemo(() => {
    const filtered = filterGLCodes({ ...settings, event: settings.event });
    return calculateAmounts(filtered, inputData1);
  }, [settings, inputData1]);

  const results2 = useMemo(() => {
    if (!settings.event2) return [];
    const filtered = filterGLCodes({ ...settings, event: settings.event2 });
    return calculateAmounts(filtered, inputData2);
  }, [settings, inputData2]);

  const results3 = useMemo(() => {
    if (!settings.event3) return [];
    const filtered = filterGLCodes({ ...settings, event: settings.event3 });
    return calculateAmounts(filtered, inputData3);
  }, [settings, inputData3]);

  const activeEvents = [
    { label: settings.event, inputData: inputData1, setInputData: setInputData1, results: results1 },
    settings.event2 && { label: settings.event2, inputData: inputData2, setInputData: setInputData2, results: results2 },
    settings.event3 && { label: settings.event3, inputData: inputData3, setInputData: setInputData3, results: results3 }
  ].filter(Boolean);

  return (
    <div className={`min-h-screen pb-12 font-sans transition-colors ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/20">
              <LayoutDashboard size={20} />
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600'}`}>
              GL Code Assistant
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              v1.0.0
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Settings Panel */}
        <SettingsPanel settings={settings} onChange={setSettings} darkMode={darkMode} />

        {/* Dynamic Event Sections */}
        {activeEvents.map((eventData, idx) => {
          // Get the mapped event name for validation
          const EVENT_MAPPING = {
            "Order Shipped": "FIRST_ITEM_SHIPPED",
            "Refunds": "REFUNDS",
            "Replacements": "REPLACEMENTS",
            "Change Installer": "INSTALLER_CHANGE",
            "Change Product": "PRODUCT_CHANGE"
          };
          const selectedEvent = EVENT_MAPPING[eventData.label] || "";

          return (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <InputSection
                  onDataChange={eventData.setInputData}
                  eventLabel={eventData.label}
                  selectedEvent={selectedEvent}
                  selectedMarketplace={settings.marketplace}
                  darkMode={darkMode}
                />
              </div>

              <div className="lg:col-span-5">
                <ResultsTable
                  data={eventData.results}
                  eventLabel={eventData.label}
                  darkMode={darkMode}
                />
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;
