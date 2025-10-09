# React 3D SVG Glass Shape

This project demonstrates how to load an SVG file, extrude it into a 3D shape, and apply a dynamic, refractive glass material using React, Vite, and the React Three Fiber ecosystem. The result is a stunning, interactive 3D object with a "wobbly" glass distortion effect that refracts elements behind it in real-time.

![Preview of the 3D SVG Glass Shape](https://i.imgur.com/nJbUf7K.gif)

## ✨ Features

*   **SVG to 3D Conversion:** Loads any SVG file and programmatically converts its paths into extruded 3D geometry.
*   **Advanced Glass Material:** Utilizes `MeshTransmissionMaterial` from `@react-three/drei` to create a realistic, refractive glass effect.
*   **Real-Time Customization:** Integrates the `leva` control panel to allow for real-time adjustments of geometry (scale, depth, edge roundness) and material properties (roughness, distortion, IOR, etc.).
*   **High-Quality Rendering:** Includes a "High Res" toggle to increase the polygon count for smoother, more detailed beveled edges.
*   **Dynamic Lighting & Reflections:** Uses an HDR environment map from `@react-three/drei` to produce high-quality, realistic lighting and reflections on the glass surface.

## 📚 Core Libraries

This project is built upon a modern stack for creating 3D web experiences:

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A next-generation frontend tooling that provides a fast and lean development experience.
*   **Three.js:** The underlying 3D library used to create and display animated 3D computer graphics in a web browser.
*   **@react-three/fiber:** A React renderer for Three.js, which makes it easy to build 3D scenes declaratively with React components.
    *   **GitHub Repo:** [https://github.com/pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber)
    *   **Documentation:** [https://docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
*   **@react-three/drei:** A collection of useful helpers and abstractions for `@react-three/fiber`. This project uses it for the `MeshTransmissionMaterial`, `Environment`, and more.
    *   **GitHub Repo:** [https://github.com/pmndrs/drei](https://github.com/pmndrs/drei)
    *   **Documentation:** [https://docs.pmnd.rs/drei/introduction](https://docs.pmnd.rs/drei/introduction)
*   **leva:** A GUI panel for React that allows you to easily add controls to your project, used here to tweak the 3D parameters in real-time.
    *   **GitHub Repo:** [https://github.com/pmndrs/leva](https://github.com/pmndrs/leva)

## 🚀 How to Use

To get this project running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/React-3D-SVG-Glass-Shape.git
    cd React-3D-SVG-Glass-Shape
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 🔧 How to Modify

### Changing the SVG Shape

The 3D model is generated from an SVG file. To use your own SVG:

1.  Place your SVG file in the `public/` directory. For example, `public/my-logo.svg`.
2.  Update the path in `src/GlassTorus.jsx` to load your new file:

    ```javascript
    // src/GlassTorus.jsx
    
    // Change this line to your SVG's filename
    const svgData = useLoader(SVGLoader, "/my-logo.svg"); 
    ```
    **Note:** For best results, use an SVG with closed paths and without complex fills or strokes.

### Customizing the Effect

A control panel will appear in the top-right corner of the screen when you run the application. You can use it to experiment with different looks in real-time. The controls are defined in `src/GlassTorus.jsx` and include:

*   **Geometry:** Adjust the `scale`, extrusion `depth`, and `Edge Roundness` of the 3D shape.
*   **Glass Material:** Modify properties like `thickness`, `roughness`, `transmission`, `ior` (Index of Refraction), `distortion`, and `temporalDistortion` to create unique glass effects.
*   **Quality:** Toggle the `High Res` option to switch between a low-poly and high-poly model.

## 📜 License & Copyright

This project is completely open source and available to the public. You are free to use, modify, distribute, and fork this software for any purpose. No attribution is required, but it is appreciated.

---

## © About the Developer

This application was developed and is maintained by **Roham Andarzgou**.

I'm a passionate professional from Iran specializing in Graphic Design, Web Development, and cross-platform app development with Dart & Flutter. I thrive on turning innovative ideas into reality, whether it's a stunning visual, a responsive website, or a polished desktop app like this one. I also develop immersive games using Unreal Engine.

*   **Website:** [rovoid.ir](https://rovoid.ir)
*   **GitHub:** [IMROVOID](https://github.com/IMROVOID)
*   **LinkedIn:** [Roham Andarzgou](https://www.linkedin.com/in/roham-andarzgouu)

### 🙏 Support This Project

If you find this application useful, please consider a donation. As I am based in Iran, cryptocurrency is the only way I can receive support. Thank you!

| Cryptocurrency | Address |
| :--- | :--- |
| **Bitcoin** (BTC) | `bc1qd35yqx3xt28dy6fd87xzd62cj7ch35p68ep3p8` |
| **Ethereum** (ETH) | `0xA39Dfd80309e881cF1464dDb00cF0a17bF0322e3` |
| **USDT** (TRC20) | `THMe6FdXkA2Pw45yKaXBHRnkX3fjyKCzfy` |
| **Solana** (SOL) | `9QZHMTN4Pu6BCxiN2yABEcR3P4sXtBjkog9GXNxWbav1` |
| **TON** | `UQCp0OawnofpZTNZk-69wlqIx_wQpzKBgDpxY2JK5iynh3mC` |