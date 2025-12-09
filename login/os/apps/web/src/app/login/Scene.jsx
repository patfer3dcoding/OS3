
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
const Earth = React.lazy(() => import("./Earth"));

export default function Scene() {
    return (
        <Canvas camera={{ position: [0, 0, 25], fov: 45 }}>
            <Suspense fallback={null}>
                <Earth />
            </Suspense>
        </Canvas>
    );
}
