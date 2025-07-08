import { useRef, useEffect, ComponentProps } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";

export default function Model({
  object,
  ...props
}: Partial<ComponentProps<"primitive">>) {
  const group = useRef<Group>(null);
  // Load the model and animations
  const { scene, animations } = useGLTF("/herologowsun.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animations.length > 0) {
      animations.forEach((clip) => {
        actions[clip.name]?.reset().play();
      });
    }
  }, [actions, animations]);

  return <primitive ref={group} object={scene} {...props} />;
}
