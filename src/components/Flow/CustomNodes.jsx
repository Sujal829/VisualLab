import React from 'react';
import { Handle, Position } from '@xyflow/react';

const Joint = ({ pos, id }) => (
    <>
        <Handle type="source" position={pos} id={`${id}-source`} className="bg-blue-500! w-3! h-3! border-2 border-white hover:scale-125 transition-transform" />
        <Handle type="target" position={pos} id={`${id}-target`} className="bg-blue-500! w-3! h-3! border-2 border-white opacity-0" />
    </>
);

export const FourJointsNode = ({ id, data }) => {
    const onDelete = () => window.dispatchEvent(new CustomEvent('node:delete', { detail: id }));

    const handleImageClick = (e) => {
        e.stopPropagation();
        document.getElementById(`file-input-${id}`).click();
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            window.dispatchEvent(new CustomEvent('node:update-image', { detail: { id, url } }));
        }
    };

    return (
        <div className="relative group">
            <div className="px-6 py-4 shadow-xl rounded-lg bg-white border-2 border-slate-300 min-w-100px text-center relative hover:border-blue-400 transition-colors">
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
                >
                    ✕
                </button>

                <div className="flex justify-center mb-2">
                    <div className="relative cursor-pointer" onClick={handleImageClick}>
                        <img
                            src={data.image || "/vite.svg"}
                            alt="node-img"
                            className="w-16 h-16 object-cover rounded-full border-2 border-slate-100 p-1 hover:ring-2 ring-blue-400 transition-all"
                        />
                        <input type="file" id={`file-input-${id}`} className="hidden" accept="image/*" onChange={handleUpload} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-[8px] text-white font-bold">CHANGE</span>
                        </div>
                    </div>
                </div>

                <Joint pos={Position.Top} id="t" />
                <Joint pos={Position.Bottom} id="b" />
                <Joint pos={Position.Left} id="l" />
                <Joint pos={Position.Right} id="r" />
                <div className="font-bold text-slate-800 uppercase tracking-tighter text-[16px]">{data.label}</div>
                <div className="text-[10px] text-blue-500 font-bold opacity-70 italic">{data.role}</div>
            </div>

            {(data.userName || data.userRole) && (
                <div className="flex flex-col items-center justify-center text-center mt-2 w-full animate-in fade-in slide-in-from-top-1">
                    {data.userName && <p className="text-[16px] text-slate-700 font-bold truncate w-full">Name: {data.userName}</p>}
                    {data.userRole && <p className="text-[10px] text-slate-500 truncate font-medium w-full">Role: {data.userRole}</p>}
                </div>
            )}
        </div>
    );
};