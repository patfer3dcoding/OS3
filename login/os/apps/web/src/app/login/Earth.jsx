
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function Earth() {
    const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    ]);

    const earthRef = useRef();
    const cloudsRef = useRef();

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (earthRef.current) {
            earthRef.current.rotation.y = elapsedTime / 6;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y = elapsedTime / 5;
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />

            {/* Earth Sphere */}
            <mesh ref={earthRef} scale={[12.5, 12.5, 12.5]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    map={colorMap}
                    specularMap={specularMap}
                    normalMap={normalMap}
                    shininess={5}
                />
            </mesh>

            {/* Clouds Sphere */}
            <mesh ref={cloudsRef} scale={[12.65, 12.65, 12.65]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={cloudsMap}
                    transparent={true}
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} autoRotate={false} />
        </>
    );
}
