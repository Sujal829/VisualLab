import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, Text, Line } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

function Navbar({ activePage, setActivePage }) {
    const navigate = useNavigate();
    const navItems = ["Lamp", "P2", "P3"];

    return (
        <nav className="fixed top-0 left-0 w-full z-20 flex justify-between items-center px-10 py-5 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            {/* Brand Logo */}
            <div
                onClick={() => navigate('/')}
                className="text-white font-black text-xl tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
            >
                THREEJS<span className="text-orange-400">EG</span>
            </div>

            {/* Unified Segmented Control */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                {navItems.map((item, index) => (
                    <button
                        key={item}
                        onClick={() => setActivePage(index)}
                        className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activePage === index
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>


            <button className="bg-white text-slate-950 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5">
                ABOUT
            </button>
        </nav>
    );
}

export function Lamp() {
    return (
        <div className="h-screen bg-slate-900">
            <Canvas camera={{ position: [50, 10, 30] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <mesh position={[0, 15, 0]}>
                    <cylinderGeometry args={[2, 12, 10, 4]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
                <mesh position={[0, 5, 0]}>
                    <cylinderGeometry args={[1, 2, 10, 32]} />
                    <meshStandardMaterial color="grey" />
                </mesh>
                <mesh position={[0, 13, 0]}>
                    <sphereGeometry args={[5, 20, 20]} />
                    <meshStandardMaterial color="yellow" />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[2, 5, 5, 10]} />
                    <meshStandardMaterial color="grey" />
                </mesh>
                <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[6, 0.6, 20, 10]} />
                    <meshStandardMaterial color="silver" />
                </mesh>
                <OrbitControls />
            </Canvas>
        </div>
    );
}



export const Task3 = () => {
    const slantPoints = [[0, 5, 0], [8, -5, 0]];
    const basePoints = [[8, -5, 0], [0, -5, 8]];
    const [cameraPoints, setCameraPoints] = useState([50, 15, 25]);
    return (
        <div className="h-screen bg-slate-900 w-full">
            <Canvas camera={{ position: cameraPoints, fov: 50 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[-5, 5, 5]} intensity={1} />
                {/* Pyramid */}
                <Center top>
                    <mesh rotation={[0, Math.PI / 4, 0]}>
                        <coneGeometry args={[8, 10, 4]} />
                        <meshStandardMaterial
                            transparent
                            opacity={0.5}
                            metalness={0.5}
                        />
                    </mesh>

                    <Line points={slantPoints} color="orange" lineWidth={10} rotation={[0, Math.PI / 4, 0]} onClick={(e) => { e.stopPropagation(); console.log("A to E Line Clicked") }} /> {/* A to E */}
                    <Line points={slantPoints} color="hotpink" lineWidth={10} rotation={[0, (Math.PI * 3) / 4, 0]} onClick={(e) => { e.stopPropagation(); console.log("A to D Line Clicked") }} /> {/* A to D */}
                    <Line points={slantPoints} color="lime" lineWidth={10} rotation={[0, (Math.PI * 5) / 4, 0]} onClick={(e) => { e.stopPropagation(); console.log("A to C Line Clicked") }} /> {/* A to C */}
                    <Line points={slantPoints} color="cyan" lineWidth={10} rotation={[0, (Math.PI * 7) / 4, 0]} onClick={(e) => { e.stopPropagation(); console.log("A to B Line Clicked") }} /> {/* A to B */}

                    <Line points={basePoints} color="red" lineWidth={10} rotation={[0, Math.PI / 4, 0]} onClick={(e) => { e.stopPropagation(); console.log("B to E Line Clicked") }} /> {/* B to E */}
                    <Line points={basePoints} color="Yellow" lineWidth={10} rotation={[0, (Math.PI * 3) / 4, 0]} onClick={(e) => { e.stopPropagation(); console.log("D to E Line Clicked") }} /> {/* D to E */}
                    <Line points={basePoints} color="green" lineWidth={10} rotation={[0, (Math.PI * 5) / 4, 0]} onClick={(e) => { e.stopPropagation(); console.log("D to C Line Clicked") }} /> {/* D to C */}
                    <Line points={basePoints} color="white" lineWidth={10} rotation={[0, (Math.PI * 7) / 4, 0]} onClick={(e) => { e.stopPropagation(); console.log("C to B Line Clicked") }} /> {/* C to B */}



                    <group position={[0, 6.5, 0]}>
                        {/* The Sphere */}
                        <mesh onClick={(e) => { e.stopPropagation(); console.log("A Node Clicked"); setCameraPoints([-3, 11, 56]) }}>
                            <sphereGeometry args={[1, 32, 32]} />
                            <meshStandardMaterial color="yellow" />
                        </mesh>

                        {/* The Label - Positioned slightly forward on the Z axis */}
                        <Text
                            position={[0, 0, 1]}
                            fontSize={1.5}
                            color="black"
                            anchorX="center"
                            anchorY="middle"
                        >
                            A
                        </Text>
                    </group>
                    <group>
                        <mesh position={[6, -6, 6]} onClick={(e) => { e.stopPropagation(); console.log("B Node Clicked"); }}>
                            <sphereGeometry args={[1, 32, 32]} />
                            <meshStandardMaterial color="orange" />
                        </mesh>
                        <Text
                            position={[6, -6, 7]} // Position the label slightly in front of the sphere
                            fontSize={1.5}
                            color="black"
                            anchorX="center"
                            anchorY="middle"
                        >
                            B
                        </Text>
                    </group>
                    <mesh position={[-6, -6, 6]} onClick={(e) => { e.stopPropagation(); console.log("C Node Clicked"); }}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color="hotpink" />
                    </mesh>
                    <Text
                        position={[-6, -6, 7]}
                        fontSize={1.5}
                        color="black"
                        anchorX="center"
                        anchorY="middle"
                    >
                        C
                    </Text>
                    <mesh position={[-6, -6, -6]} onClick={(e) => { e.stopPropagation(); console.log("D Node Clicked"); }}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color="lime" />
                    </mesh>
                    <Text
                        position={[-6, -6, -5]}
                        fontSize={1.5}
                        color="black"
                        anchorX="center"
                        anchorY="middle"
                    >
                        D
                    </Text>
                    <mesh position={[6, -6, -6]} onClick={(e) => { e.stopPropagation(); console.log("E Node Clicked"); }}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color="cyan" />
                    </mesh>
                    <Text
                        position={[6, -6, -5]}
                        fontSize={1.5}
                        color="black"
                        anchorX="center"
                        anchorY="middle"
                    >
                        E
                    </Text>
                </Center>
                <OrbitControls makeDefault autoRotate={false} enableZoom={false} enableDamping={true} />
            </Canvas>
        </div >
    );
};


function Planet() {
    return (
        <div className="h-screen bg-slate-900">

            <Canvas camera={{ position: [0, 10, 30] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <mesh>
                    <sphereGeometry args={[3, 32, 32]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[6, 0.1, 20, 100]} />
                    <meshStandardMaterial color="silver" />
                </mesh>
                <mesh position={[6, 0, 0]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="yellow" />
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[10, 0.1, 20, 100]} />
                    <meshStandardMaterial color="silver" />
                </mesh>
                <mesh position={[6, 0, 8]}>
                    <sphereGeometry args={[1.2, 32, 32]} />
                    <meshStandardMaterial color="green" />
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[15, 0.1, 20, 100]} />
                    <meshStandardMaterial color="silver" />
                </mesh>
                <mesh position={[6, 0, 14]}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
                <OrbitControls autoRotate={true} />
            </Canvas>
        </div>
    );
}

export default function ScenePage() {
    const [activePage, setActivePage] = useState(0);

    return (
        <>
            <Navbar setActivePage={setActivePage} />
            {console.log("render")}
            {activePage === 0 && <Lamp />}
            {activePage === 1 && <Planet />}
            {activePage === 2 && <Task3 />}
        </>
    );
}