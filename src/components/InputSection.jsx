import React, { useState, useEffect } from 'react';
import { ClipboardPaste, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import Papa from 'papaparse';
import glCodes from '../data/gl_codes.json';

export function InputSection({ onDataChange, eventLabel = "Event 1", selectedEvent = "", selectedMarketplace = "Website", darkMode = false }) {
    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ count: 0, valid: 0, invalid: 0 });
    const [validationResults, setValidationResults] = useState([]);

    useEffect(() => {
        if (!text.trim()) {
            onDataChange([]);
            setStats({ count: 0, valid: 0, invalid: 0 });
            setValidationResults([]);
            setError(null);
            return;
        }

        // Parse CSV/TSV
        const result = Papa.parse(text, {
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
        });

        if (result.errors.length > 0) {
            setError("Failed to parse data. Please ensure it's valid CSV or TSV.");
            return;
        }

        // Map columns: Amount, Event, GL Code (new order)

        const data = result.data.map((row, idx) => {
            let amount, event, glCode;

            if (row.length >= 3) {
                amount = row[0];
                event = row[1];
                glCode = row[2];
            } else {
                return null; // Invalid row
            }

            return { glCode, amount, event, rowIndex: idx };
        }).filter(Boolean);

        // Validate GL codes against database using SELECTED marketplace and event from dropdown
        const RETURNS_EVENTS = ['INSTALLER_CHANGE', 'PRODUCT_CHANGE', 'REPLACEMENTS'];

        const validation = data.map(item => {
            const glCodeStr = String(item.glCode).trim();

            // IMPORTANT: Validate against the SELECTED marketplace AND event from dropdown
            // The event in the input data is only used for calculation matching, not validation
            const exists = glCodes.some(code =>
                String(code["GL Code"]).trim() === glCodeStr &&
                code.Event === selectedEvent &&
                code.Marketplace === selectedMarketplace
            );

            return {
                ...item,
                isValid: exists
            };
        });

        const validCount = validation.filter(v => v.isValid).length;
        const invalidCount = validation.filter(v => !v.isValid).length;

        setStats({ count: data.length, valid: validCount, invalid: invalidCount });
        setValidationResults(validation);
        setError(null);
        onDataChange(data);

    }, [text, onDataChange, selectedEvent, selectedMarketplace]);

    return (
        <div className={`rounded-xl shadow-sm border p-6 space-y-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ClipboardPaste className="text-blue-600" />
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Input Data - {eventLabel}</h2>
                </div>
                <div className={`text-sm flex items-center gap-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stats.count > 0 ? (
                        <>
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                <CheckCircle2 size={14} /> {stats.valid} valid
                            </span>
                            {stats.invalid > 0 && (
                                <span className="flex items-center gap-1 text-amber-600 font-medium">
                                    <AlertTriangle size={14} /> {stats.invalid} missing
                                </span>
                            )}
                        </>
                    ) : (
                        <span>Paste data (Amount | Event | GL Code)</span>
                    )}
                </div>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Paste your data here\nFormat: Amount | Event | GL Code`}
                className={`w-full h-32 border text-sm font-mono rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-4 transition-colors resize-y ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 hover:border-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'}`}
            />

            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Validation warnings */}
            {stats.invalid > 0 && (
                <div className={`border rounded-lg p-4 space-y-2 ${darkMode ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
                    <div className={`flex items-center gap-2 font-medium text-sm ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>
                        <AlertTriangle size={16} />
                        Missing GL Codes in Database
                    </div>
                    <div className={`text-xs space-y-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                        {validationResults
                            .filter(v => !v.isValid)
                            .slice(0, 5)
                            .map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="font-mono bg-amber-100 px-2 py-0.5 rounded">
                                        {item.glCode}
                                    </span>
                                    <span className="text-amber-600">
                                        - Not found for event: {eventLabel}
                                    </span>
                                </div>
                            ))}
                        {validationResults.filter(v => !v.isValid).length > 5 && (
                            <div className="text-amber-600 italic">
                                ... and {validationResults.filter(v => !v.isValid).length - 5} more
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-amber-700 mt-2">
                        💡 Add these GL codes to <code className="bg-amber-100 px-1 rounded">src/data/gl_codes.json</code> to enable calculations
                    </div>
                </div>
            )}
        </div>
    );
}
