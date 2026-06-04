import React from 'react';

const Sidebar = ({ isOpen, setIsOpen, onAddNode }) => {
    const nodeOptions = [
        { role: 'Admin', color: 'bg-red-600', icon: '🛡️' },
        { role: 'Agent', color: 'bg-green-600', icon: '🎧' },
        { role: 'User', color: 'bg-blue-600', icon: '👤' },
    ];

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}
            <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-8">Toolbox</h2>
                    <div className="space-y-3">
                        {nodeOptions.map((opt) => (
                            <button
                                key={opt.role}
                                onClick={() => onAddNode(opt.role)}
                                className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all active:scale-95"
                            >
                                <div className={`${opt.color} text-white w-10 h-10 flex items-center justify-center rounded-lg text-xl`}>{opt.icon}</div>
                                <span className="font-bold text-slate-700">Add {opt.role}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;