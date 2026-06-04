import React, { useCallback, useEffect, useState } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Panel, MarkerType } from '@xyflow/react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Flow/SideBar';
import NodeFormModal from '../components/Flow/NodeFormModal';
import { FourJointsNode } from '../components/Flow/CustomNodes';
import TooltipEdge from '../components/Flow/TooltipEdge';
import EdgePopupForm from '../components/Flow/EdgePopupForm';
import '@xyflow/react/dist/style.css';
import Vite from '../assets/vite.svg';
import Reactlogo from '../assets/react.svg';

const nodeTypes = {
    fourJoints: FourJointsNode
};

const edgeTypes = { tooltip: TooltipEdge };

export default function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Node Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);

    // Edge Modal States
    const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const updateImage = (e) => {
            const { id, url } = e.detail;
            setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, image: url } } : n)));
        };

        const handleDeleteEdge = (e) => setEdges((eds) => eds.filter((edge) => edge.id !== e.detail));

        const handleDeleteNode = (e) => {
            setNodes((nds) => nds.filter((node) => node.id !== e.detail));
            setEdges((eds) => eds.filter((edge) => edge.source !== e.detail && edge.target !== e.detail));
        };

        // NEW: Listener for Edge Form
        const handleOpenEdgeForm = (e) => {
            setSelectedEdge(e.detail);
            setIsEdgeModalOpen(true);
        };

        window.addEventListener('node:update-image', updateImage);
        window.addEventListener('edge:delete', handleDeleteEdge);
        window.addEventListener('node:delete', handleDeleteNode);
        window.addEventListener('edge:open-form', handleOpenEdgeForm);

        return () => {
            window.removeEventListener('node:update-image', updateImage);
            window.removeEventListener('edge:delete', handleDeleteEdge);
            window.removeEventListener('node:delete', handleDeleteNode);
            window.removeEventListener('edge:open-form', handleOpenEdgeForm);
        };
    }, [setNodes, setEdges]);

    const onConnect = useCallback((p) => setEdges((eds) => addEdge({
        ...p,
        type: "tooltip",
        animated: true,
        label: "",
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 18, color: '#94a3b8' }
    }, eds)), [setEdges]);

    const onAdd = useCallback((role) => {
        const newId = Math.random().toString(36).substring(2, 9);
        setNodes((nds) => {
            const roleCount = nds.filter((node) => node.data.role === role).length;
            return [...nds, {
                id: newId,
                type: 'fourJoints',
                data: {
                    label: `${role} ${roleCount + 1}`,
                    role: role,
                    image: (role === 'Admin' ? Vite : role === 'Agent' ? Reactlogo : "https://cdn-icons-png.flaticon.com/512/149/149071.png"),
                },
                position: { x: Math.random() * 300, y: Math.random() * 300 },
            }];
        });
    }, [setNodes]);

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
        setIsModalOpen(true);
    }, []);

    const handleSaveNodeDetails = (id, details) => {
        setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, ...details } } : n));
        setIsModalOpen(false);
    };

    const handleSaveEdgeDetails = (edgeData) => {
        setEdges((eds) =>
            eds.map((edge) => {
                if (edge.id === edgeData.id) {

                    return { ...edge, label: edgeData.label };
                }
                return edge;
            })
        );
    };

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
                fitViewOptions={{
                    padding: 10,
                    includeHiddenNodes: false
                }}
            >
                <Panel position="top-right">
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/')} className="bg-slate-600 text-white font-bold py-2 px-4 rounded shadow-lg">Back</button>
                        <button onClick={() => setIsSidebarOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg flex items-center gap-2">Open Tools</button>
                    </div>
                </Panel>
                <Controls />
                <Background variant="dots" color="#000" />
            </ReactFlow>

            {/* Node Management Modal */}
            <NodeFormModal
                key={selectedNode?.id || 'none'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNodeDetails}
                nodeData={selectedNode}
            />

            {/* NEW: Edge Management Modal */}
            <EdgePopupForm
                isOpen={isEdgeModalOpen}
                onClose={() => setIsEdgeModalOpen(false)}
                onSave={handleSaveEdgeDetails}
                edgeData={selectedEdge}
            />

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onAddNode={onAdd} />
        </div>
    );
}