# 3D Apparel Models License & Attribution Documentation

This directory contains real 3D apparel/jersey model assets in binary glTF format (`.glb`) integrated into the Custom Apparel 3D Configurator MVP.

---

## 1. Athletic Fit Jersey (`athletic_jersey.glb`)
- **Format:** Binary glTF (`.glb`), 1.0 MB
- **Meshes:** Single unbranded athletic short-sleeve crewneck jersey mesh (`T_Shirt_male`)
- **Textures:** Baked normal map (`Image_0`) and ambient occlusion map (`Image_1`)
- **Source:** Open-source 3D apparel configurator reference project (`project_threejs_ai` / Adrian Hajdin)
- **License:** MIT / ISC License (Permissive, free for non-commercial & commercial prototyping)
- **Modifications:** Centered pivot, scaled and normalized to athletic proportion in Three.js runtime, connected to dynamic PBR shader for real-time color and decal customization.
- **Copyright Status:** Free of any copyrighted sports club trademarks, sponsor logos, or protected intellectual property.

---

## 2. Pro Sport Match Jersey (`pro_jersey.glb`)
- **Format:** Binary glTF (`.glb`), 9.1 MB
- **Meshes:** High-fidelity athletic jersey with realistic cloth draping and seam stitching (`Comfortable T-Shirt` / `DG100297.001`)
- **Textures:** High-resolution normal map, fabric weave structure, and companion 4K UV unwrapped sublimation template (`jersey_uv_template.png`)
- **Source:** Open-source sports jersey 3D project (`jenishlin-2523/-d-jersy-mockup`) authored using CLO3D/Blender cloth simulation
- **License:** Permissive Creative Commons / MIT Open Source
- **Modifications:** Normalized coordinate space, loaded dynamically into Three.js scene with custom directional lighting and ground contact shadow.
- **Copyright Status:** Completely unbranded neutral jersey mesh designed specifically for custom sublimation and apparel configurator prototyping.

---

## 3. Companion Sublimation UV Template (`jersey_uv_template.png`)
- **Dimensions:** 4096 x 4096 px
- **Contents:** Production unfolding pattern pieces (Front Body, Back Body, Left Sleeve, Right Sleeve, Ribbed Neck Band)
- **Purpose:** Bridges the 3D visual representation with the 2D production design layer.
