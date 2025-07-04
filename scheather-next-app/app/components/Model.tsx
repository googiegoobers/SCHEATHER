import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

useGLTF.preload("/simple_stylized_cartoon_style_calendar.glb");

export default function Model({
  scrollProgress = 0,
}: {
  scrollProgress: number;
}) {
  const group = useRef<Group>(null);
  const { animations, scene } = useGLTF(
    "/simple_stylized_cartoon_style_calendar.glb"
  );
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions["Experiment"]) {
      actions["Experiment"].play();
      actions["Experiment"].paused = true;
    }
  }, [actions]);

  useFrame(() => {
    // Animate the animation time (optional)
    if (actions["Experiment"]) {
      actions["Experiment"].time =
        (actions["Experiment"].getClip().duration * scrollProgress) / 3;
    }
    // 3D rotation based on scrollProgress
    if (group.current) {
      group.current.rotation.y = scrollProgress * Math.PI * -2; // 0 to 360deg
      group.current.rotation.x = scrollProgress * Math.PI; // 0 to 180deg
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
