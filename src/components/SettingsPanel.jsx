import React from 'react';
import { Settings, CreditCard, Box, Truck, Tag, Percent, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

export function SettingsPanel({ settings, onChange, darkMode = false }) {
    const handleChange = (key, value) => {
        onChange({ ...settings, [key]: value });
    };

    const InputGroup = ({ label, icon: Icon, children }) => (
        <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {Icon && <Icon size={14} />}
                {label}
            </label>
            {children}
        </div>
    );

    const Select = ({ value, onChange, options }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 hover:border-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'}`}
        >
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    );

    const TextInput = ({ value, onChange, placeholder }) => (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 hover:border-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'}`}
        />
    );

    const Toggle = ({ label, checked, onChange }) => (
        <label className="inline-flex items-center cursor-pointer group">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className={`ms-3 text-sm font-medium transition-colors ${darkMode ? 'text-slate-300 group-hover:text-slate-100' : 'text-slate-700 group-hover:text-slate-900'}`}>{label}</span>
        </label>
    );

    return (
        <div className={`rounded-xl shadow-sm border p-6 space-y-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`flex items-center gap-2 border-b pb-4 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <Settings className="text-blue-600" />
                <h2 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputGroup label="Marketplace" icon={Box}>
                    <Select
                        value={settings.marketplace}
                        onChange={(v) => handleChange('marketplace', v)}
                        options={["Website", "BenefitsMe", "Lowes", "Purchasing Power"]}
                    />
                </InputGroup>

                <InputGroup label="Event 1" icon={Truck}>
                    <Select
                        value={settings.event}
                        onChange={(v) => handleChange('event', v)}
                        options={[
                            "Order Shipped",
                            "Refunds",
                            "Replacements",
                            "Change Installer",
                            "Change Product"
                        ]}
                    />
                </InputGroup>

                <InputGroup label="Event 2 (Optional)" icon={Truck}>
                    <Select
                        value={settings.event2 || "(None)"}
                        onChange={(v) => handleChange('event2', v === "(None)" ? "" : v)}
                        options={[
                            "(None)",
                            "Order Shipped",
                            "Refunds",
                            "Replacements",
                            "Change Installer",
                            "Change Product"
                        ]}
                    />
                </InputGroup>

                <InputGroup label="Event 3 (Optional)" icon={Truck}>
                    <Select
                        value={settings.event3 || "(None)"}
                        onChange={(v) => handleChange('event3', v === "(None)" ? "" : v)}
                        options={[
                            "(None)",
                            "Order Shipped",
                            "Refunds",
                            "Replacements",
                            "Change Installer",
                            "Change Product"
                        ]}
                    />
                </InputGroup>

                <InputGroup label="Product" icon={Tag}>
                    <Select
                        value={settings.product}
                        onChange={(v) => handleChange('product', v)}
                        options={[
                            "PassengerTires",
                            "LightTruckTires",
                            "SpecialtyTires",
                            "Wheels"
                        ]}
                    />
                </InputGroup>

                <InputGroup label="Payment Type" icon={CreditCard}>
                    <Select
                        value={settings.paymentType}
                        onChange={(v) => handleChange('paymentType', v)}
                        options={["BAMS", "PayPal", "Amex", "Affirm", "PayTomorrow/Uown"]}
                    />
                </InputGroup>

                <InputGroup label="Order Type" icon={Box}>
                    <Select
                        value={settings.orderType}
                        onChange={(v) => handleChange('orderType', v)}
                        options={["STS", "Common"]}
                    />
                </InputGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                <Toggle
                    label="ATD Supplied"
                    checked={settings.atdSupplied}
                    onChange={(v) => handleChange('atdSupplied', v)}
                />
                <Toggle
                    label="VIP"
                    checked={settings.vip}
                    onChange={(v) => handleChange('vip', v)}
                />
                <Toggle
                    label="Platform Fee"
                    checked={settings.platformFee}
                    onChange={(v) => handleChange('platformFee', v)}
                />
                <Toggle
                    label="Discounts"
                    checked={settings.discounts}
                    onChange={(v) => handleChange('discounts', v)}
                />
            </div>
        </div>
    );
}
