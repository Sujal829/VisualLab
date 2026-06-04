import React, { useState, useEffect } from 'react';

const EdgePopupForm = ({ onSave }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [edgeData, setEdgeData] = useState({ id: '', label: '', color: '#94a3b8' });

    useEffect(() => {
        const handleOpen = (e) => {
            setEdgeData({
                id: e.detail.id,
                label: e.detail.label || '', // Current edge label if it exists
                source: e.detail.sourceLabel,
                target: e.detail.targetLabel
            });
            setIsOpen(true);
        };

        window.addEventListener('edge:open-form', handleOpen);
        return () => window.removeEventListener('edge:open-form', handleOpen);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl w-80 text-white">
                <h3 className="text-lg font-semibold mb-1 text-blue-400 font-mono">Edit Connection</h3>
                <p className="text-xs text-slate-400 mb-4 italic">
                    {edgeData.source} <span className="text-blue-500">→</span> {edgeData.target}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium mb-1 text-slate-300">Edge Label</label>
                        <input
                            type="text"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="e.g. sends data to"
                            value={edgeData.label}
                            onChange={(e) => setEdgeData({ ...edgeData, label: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-3 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSave(edgeData);
                            setIsOpen(false);
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EdgePopupForm;