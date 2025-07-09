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
      camera={{ fov: 30, position: [0, 10, 0] }} // Camera above, looking down
      style={{
        width: "100%",
        maxWidth: 800,
        height: "60vw",
        maxHeight: 800,
        minHeight: 200,
      }}
    >
      <ambientLight intensity={0.5} />
      <Model />
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
