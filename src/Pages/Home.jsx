import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Share2, Box, ChevronRight, Sparkles, Orbit, BarChart3, GitBranch } from 'lucide-react';
import SmokeyCursor from '../components/lightswind/smokey-cursor';
// import { MagicCard } from '../components/lightswind/magic-card'
import Photoicon from '../assets/photos.png'
import Cube from '../assets/cube.png'
import Barchart from '../assets/bar-graph.png'
import Flow from '../assets/Flow.png'
import FallBeamBackground from "../components/lightswind/fall-beam-background";
import InteractiveGridBackground from "../components/lightswind/interactive-grid-background";
import { GoogleLogin } from '@react-oauth/google';
/**
 * 1. CONFIGURATION OVER HARDCODING
 * Extracting data allows for easy updates and cleaner JSX.
 * In a real-world app, this might even come from a CMS or JSON file.
 */
const WORKSPACES = [
    {
        id: 'three-js',
        icon: Box,
        title: 'Three.js',
        subtitle: 'Spatial 3D Mesh',
        desc: 'Render high-fidelity 3D environments and complex geometries with WebGL.',
        path: '/scene',
        imageUrl: Cube,
        gradient: 'from-blue-500 to-indigo-600',
        glow: 'group-hover:shadow-blue-500/20',
    },
    {
        id: 'chart-js',
        icon: BarChart3,
        title: 'Chart.js',
        subtitle: 'Telemetry Streams',
        desc: 'Flexible, designer-oriented charts for real-time performance tracking.',
        path: '/metrics',
        imageUrl: Barchart,
        gradient: 'from-rose-500 to-orange-500',
        glow: 'group-hover:shadow-rose-500/20',
    },
    {
        id: 'react-flow',
        icon: GitBranch,
        title: 'React Flow',
        subtitle: 'Logic Mapping',
        desc: 'Build node-based editors and interactive dependency diagrams.',
        path: '/flow',
        imageUrl: Flow,
        gradient: 'from-emerald-400 to-teal-600',
        glow: 'group-hover:shadow-emerald-500/20',
    },
];
const WorkspaceCard = ({ workspace }) => {
    const { icon: Icon, title, subtitle, desc, path, gradient, imageUrl } = workspace;

    return (
        <Link
            to={path}
            className="group relative flex items-center justify-center rounded-[2rem] bg-white/[0.03] border border-white/10 
            backdrop-blur-md transition-all duration-500 hover:-translate-y-4 hover:bg-white/[0.08] 
            hover:border-white/20 overflow-hidden h-full"
            aria-label={`Initialize ${title} module`}
        >


            <div className="relative w-full h-52 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full flex items-center justify-center object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000]/90 via-[#000]/20 to-transparent" />

                <div className="absolute bottom-4 left-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon size={24} />
                    </div>
                </div>
            </div>

            <div className="p-8 pt-2 flex flex-col items-start w-full">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400 mb-2">
                    {subtitle}
                </span>

                <h3 className="text-3xl font-black text-white mt-1 tracking-tighter mb-4">
                    {title}
                </h3>

                <p className="text-slate-400 text-left text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-slate-200 transition-colors duration-300">
                    {desc}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    Launch Workspace <ChevronRight size={14} className="text-indigo-400" />
                </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-3px w-0 group-hover:w-full bg-gradient-to-r ${gradient} transition-all duration-700`} />


            {/* <MagicCard
                title={title}
                imageUrl={imageUrl}
            /> */}
        </Link>
    );
};
const Home = () => {
    // 3. PERFORMANCE OPTIMIZATION
    // Memoizing the list in case the parent re-renders frequently
    const renderedWorkspaces = useMemo(() =>
        WORKSPACES.map(ws => <WorkspaceCard key={ws.id} workspace={ws} />),
        []);

    return (
        <div className="min-h-screen text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            <SmokeyCursor /> 
            {/* <MagicCard
                title="Vite"
                imageUrl={vite}
            />
            <MagicCard
                title="Google Photos"
                imageUrl={Photoicon}
            /> */}

            <FallBeamBackground lineCount={20} beamColorClass="cyan -800">
                <h2 className="relative z-20 text-white text-3xl font-bold">
                    Data Stream Active
                </h2>
            </FallBeamBackground>
            {/* 
            <InteractiveGridBackground >
                <h2 className="relative z-20 text-white text-3xl font-bold">
                    Data Stream Active
                </h2>
            </InteractiveGridBackground> */}


            {/* BACKGROUND LAYER - Simplified for performance */}
            <header className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-[-10%] left-[-5%] w-500px h-500px bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[0%] right-[-5%] w-600px h-600px bg-pink-600/15 blur-[120px] rounded-full animate-bounce [animation-duration:10s]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
            </header>

            <nav className="relative z-50 flex items-center justify-between max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative p-2 bg-black rounded-xl border border-white/10">
                        <Orbit size={24} className="text-indigo-400 animate-spin-slow" />
                    </div>
                    <span className="text-white font-black tracking-tighter text-2xl">VISUAL<span className="text-indigo-500">.</span>LAB</span>
                </div>
            </nav>

            <main trailLength={6} className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 text-center">
                <section>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] text-indigo-300 uppercase mb-8 backdrop-blur-md">
                        <Sparkles size={14} /> Modular Visual Engine
                    </div>

                    <h1 className="text-6xl md:text-[8rem] font-black tracking-[-0.06em] leading-[0.85] mb-10 text-white">
                        Pick your <br />
                        <pre className="bg-clip-text text-transparent bg-linear-to-r from-blue-900 via-purple-400 to-emerald-400">
                            Workspace
                        </pre>
                    </h1>

                    <p className="max-w-xl mx-auto text-slate-400 text-lg md:text-xl font-light mb-16">
                        Select a specialized engine to begin visualizing your data structure, performance, or spatial coordinates.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {renderedWorkspaces}
                </section>
            </main>
        </div>
    );
};

export default Home;