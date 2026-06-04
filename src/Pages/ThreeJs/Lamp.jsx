import { Canvas } from '@react-three/fiber';
import { Box, Sphere, OrbitControls, Stage, RoundedBox, Tetrahedron, Ring } from '@react-three/drei';
import { Circle, Cylinder, Plane, Torus } from 'lucide-react';

export default function Lamp() {
    return (
        <div className="h-screen bg-slate-700">
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <mesh position={[0, 15, 0]}>
                    <cylinderGeometry args={[2, 12, 10, 4]} />
                    <meshStandardMaterial color={"orange"} />
                </mesh>
                <mesh position={[0, 5, 0]}>
                    <boxGeometry args={[3, 15, 3]} />
                    <meshStandardMaterial color={"blue"} />
                </mesh>
                <mesh position={[0, 13, 0]}>
                    <sphereGeometry args={[5, 20, 20]} />
                    <meshStandardMaterial color={"yellow"} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[2, 5, 5, 10]} />
                    <meshStandardMaterial color={"black"} />
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[6, 0.5, 20, 10]} />
                    <meshStandardMaterial color={"red"} />
                </mesh>
                <OrbitControls autoRotate={false} />
            </Canvas>
        </div>
    );
}

function Planet() {
    return (
        <div className="h-screen bg-slate-700">

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
                <OrbitControls />
            </Canvas>
        </div>
    );
}
