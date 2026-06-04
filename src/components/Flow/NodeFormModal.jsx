import React, { useState } from 'react';

const NodeFormModal = ({ isOpen, onClose, onSave, nodeData }) => {
    const [name, setName] = useState(nodeData?.data?.userName || '');
    const [extraRole, setExtraRole] = useState(nodeData?.data?.userRole || '');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Node Details</h3>
                <div className="space-y-onEdgesChange4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded-lg outline-blue-500 text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Custom Role/Title</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded-lg outline-blue-500 text-sm"
                            value={extraRole}
                            onChange={(e) => setExtraRole(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button onClick={onClose} className="flex-1 py-2 font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                        <button
                            onClick={() => onSave(nodeData.id, { userName: name, userRole: extraRole })}
                            className="flex-1 py-2 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeFormModal;