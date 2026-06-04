import React, { useState, useEffect, useRef } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useNodes } from '@xyflow/react';

const TooltipEdge = (props) => {
    const {
        id, source, target, sourceX, sourceY, targetX, targetY,
        sourcePosition, targetPosition, style, markerEnd,
        label
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef(null);
    const nodes = useNodes();

    const sourceNode = nodes.find((n) => n.id === source);
    const targetNode = nodes.find((n) => n.id === target);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
    });

    // Toggle tooltip on edge click
    const onEdgeClick = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    // Trigger the Form Modal
    const onOpenForm = (e) => {
        e.stopPropagation();
        setIsOpen(false); // Close tooltip when opening form
        window.dispatchEvent(new CustomEvent('edge:open-form', {
            detail: {
                id,
                label: label || '',
                sourceLabel: sourceNode?.data?.label,
                targetLabel: targetNode?.data?.label
            }
        }));
    };

    const onDelete = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('edge:delete', { detail: id }));
    };

    // Close tooltip if user clicks anywhere else on the canvas
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = () => setIsOpen(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: isOpen ? '#3b82f6' : '#94a3b8',
                    strokeWidth: isOpen ? 4 : 3,
                    transition: 'stroke 0.2s'
                }}
            />

            {/* The Clickable Area */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                onClick={onEdgeClick}
                className="cursor-pointer"
            />

            <EdgeLabelRenderer>
                {/* 1. PERSISTENT LABEL (The text on the line) */}
                {label && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'none',
                        }}
                        className="bg-white px-2 py-0.5 rounded border border-slate-300 text-[11px] font-bold text-slate-700 shadow-sm whitespace-nowrap"
                    >
                        {label}
                    </div>
                )}

                {/* 2. CLICK-TRIGGERED TOOLTIP */}
                {isOpen && (
                    <div
                        ref={tooltipRef}
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -100%) translate(${labelX}px,${labelY - 14}px)`,
                            pointerEvents: 'all',
                        }}
                        className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-blue-500/30 z-[9999] flex flex-col items-center gap-2"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside tooltip
                    >
                        <div className="flex items-center gap-2 text-xs font-medium border-b border-slate-700 pb-2 mb-1">
                            <span className="text-blue-400">{sourceNode?.data?.label}</span>
                            <span className="text-white text-xl leading-none">→</span>
                            <span className="text-emerald-400">{targetNode?.data?.label}</span>
                        </div>

                        <div className="flex gap-2">
                            {/* BUTTON TO OPEN FORM */}
                            <button
                                onClick={onOpenForm}
                                className="nopan nodrag bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-2 py-1.5 rounded font-bold transition-colors"
                            >
                                Edit Details
                            </button>

                            <button
                                onClick={onDelete}
                                className="nopan nodrag bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded transition-all"
                                title="Delete Edge"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                            </button>
                        </div>

                        {/* Tooltip Arrow */}
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-blue-500/30"></div>
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
};

export default TooltipEdge;