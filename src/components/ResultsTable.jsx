import React from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

export function ResultsTable({ data, eventLabel = "Event 1", darkMode = false }) {
    // Calculate totals using the determined recordedValue
    const totalDebit = data
        .filter(r => (r.recordedValue || r["Recorded Value"])?.includes("Debit"))
        .reduce((sum, r) => sum + (r.calculatedAmount || 0), 0);

    const totalCredit = data
        .filter(r => (r.recordedValue || r["Recorded Value"])?.includes("Credit"))
        .reduce((sum, r) => sum + (r.calculatedAmount || 0), 0);

    return (
        <div className={`rounded-xl shadow-sm border overflow-hidden flex flex-col h-96 resize-y ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2">
                    <Calculator className="text-blue-600" />
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Calculated GL Codes - {eventLabel}</h2>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className={`px-3 py-1 rounded-full font-medium border ${darkMode ? 'bg-green-900/30 text-green-400 border-green-700' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        Debit: {totalDebit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                    <div className={`px-3 py-1 rounded-full font-medium border ${darkMode ? 'bg-red-900/30 text-red-400 border-red-700' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        Credit: {totalCredit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                </div>
            </div>

            <div className="overflow-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className={`text-xs uppercase sticky top-0 z-10 ${darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                        <tr>
                            <th className="px-6 py-3 font-semibold">GL Code</th>
                            <th className="px-6 py-3 font-semibold">Description</th>
                            <th className="px-6 py-3 font-semibold">Type</th>
                            <th className="px-6 py-3 font-semibold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={`px-6 py-12 text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    No matching GL codes found for current settings.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => {
                                // Use determined recordedValue if available, otherwise fall back to original
                                const displayValue = row.recordedValue || row["Recorded Value"];

                                return (
                                    <tr key={idx} className={`transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                                        <td className={`px-6 py-4 font-mono font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{row["GL Code"]}</td>
                                        <td className={`px-6 py-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{row["Description"]}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${displayValue?.includes("Debit")
                                                    ? (darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800')
                                                    : (darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')}
                        `}>
                                                {displayValue}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-mono font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                            {row.calculatedAmount ? row.calculatedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
