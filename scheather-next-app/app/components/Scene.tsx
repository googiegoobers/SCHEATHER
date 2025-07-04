"use client";
// import { Model } from "../Rubixcub/e";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useProgress,
  Html,
  ScrollControls,
} from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";

function Loader() {
  const { progress, active } = useProgress();

  return <Html center>{progress.toFixed(1)} % loaded</Html>;
}

export default function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas
      camera={{ fov: 30, position: [-10, 0, 10] }}
      style={{ width: 850, height: 850 }}
    >
      <ambientLight intensity={5} />
      <Model scrollProgress={scrollProgress} />
    </Canvas>
  );
}
// export default function Scene() {
//   return (
//     <Canvas gl={{ antialias: true }} dpr={[1, 1.5]} className="relative h-svh">
//       <directionalLight position={[-5, -5, -5]} intensity={0.5} />
//       <Suspense fallback={<Loader />}>
//         <ScrollControls damping={0.2} pages={3}>
//           <Model />
//         </ScrollControls>
//       </Suspense>
//     </Canvas>
//   );
// }
