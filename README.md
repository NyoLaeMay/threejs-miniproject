# 💖 Interactive Three.js Heart Scene

A romantic and interactive 3D scene built with Three.js featuring heart-shaped objects, animations, and dynamic controls.

![Three.js Heart Scene](assets/screenshot.png)

## 🚀 How to Run the Project

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Node.js (optional, for local development server)

### Quick Start

1. Clone this repository:

   ```bash
   git clone https://github.com/NyoLaeMay/threejs-miniproject.git
   cd threejs-miniproject
   ```

2. **Option A: Using a local server (Recommended)**

   ```bash
   # Using npx (no installation required)
   npx serve .

   # Or using Python
   python -m http.server 8000

   # Or using Node.js
   npm install -g http-server
   http-server
   ```

3. **Option B: Direct file opening**

   - Simply open `index.html` in your browser
   - Note: Some features may not work due to CORS restrictions

4. Open your browser and navigate to the provided local server URL (usually `http://localhost:3000` or similar)

## ✨ Features Implemented

### 🎨 3D Objects & Graphics

- **Heart-shaped Floating Objects**: 20 randomly colored 3D heart shapes with upside-down orientation
- **Geometric Shapes**: Interactive sphere and torus with metallic materials
- **Dynamic Text**: "Hello World!" text with 3D extrusion and beveling
- **Heart Rain Effect**: 100 animated falling heart particles
- **Realistic Lighting**: Ambient, directional, and point lights with soft shadows
- **Pastel Color Palette**: Romantic color scheme with soft pink background

### 🎮 Interactive Controls

- **Mouse Orbit Controls**: Rotate, zoom, and pan around the 3D scene
- **Animation Toggle**: Start/stop all object animations
- **Speed Control**: Cycle through different animation speeds (1x, 3x, 0.5x)
- **Text Color Changer**: Cycle through 6 different vibrant text colors
- **Scene Reset**: Return all objects to their initial positions and states
- **Heart Rain Toggle**: Turn the falling hearts effect on/off

### 🎭 Animation System

- **Smooth Transitions**: Coordinated object animations with time-based movement
- **Figure-8 Text Motion**: Complex text animation with rotation and scaling effects
- **Floating Hearts**: Gentle rotation and vertical bobbing animation
- **Rain Physics**: Realistic falling motion with rotation for heart particles
- **Dynamic Lighting**: Moving point light that follows the scene

### 🎯 Visual Effects

- **Real-time Shadows**: PCF soft shadow mapping for realistic lighting
- **Material Shininess**: Metallic and glossy surface properties
- **Anti-aliasing**: Smooth rendering with WebGL antialiasing
- **Responsive Design**: Automatic resizing for different screen sizes

## 🧠 Key Learnings

### 1. **Three.js Scene Architecture**

Understanding the fundamental components of a Three.js application: Scene, Camera, Renderer, and the animation loop. Learning how to properly structure a 3D application with modular functions for different objects and systems.

### 2. **Complex 3D Geometry Creation**

Mastering custom shape creation using THREE.Shape and Bézier curves to create heart shapes, then extruding them into 3D objects. This involved understanding coordinate systems and curve mathematics.

### 3. **Animation & Time Management**

Implementing smooth, coordinated animations using time-based calculations rather than frame-based increments. Learning to manage multiple animation states and create smooth transitions between different animation modes.

### 4. **Interactive Controls & User Experience**

Building an intuitive user interface with real-time controls that affect the 3D scene. Understanding how to manage state changes, button interactions, and provide immediate visual feedback.

### 5. **Lighting & Material Systems**

Implementing realistic lighting with multiple light sources, shadow mapping, and understanding how different materials (MeshPhongMaterial) respond to light. Learning the balance between performance and visual quality in real-time rendering.

## 🛠️ Technologies Used

- **Three.js**: 3D graphics library
- **WebGL**: Hardware-accelerated 3D rendering
- **JavaScript ES6+**: Modern JavaScript features and modules
- **HTML5 Canvas**: Rendering target
- **CSS3**: Styling and UI controls

## 📁 Project Structure

```
threejs-miniproject/
├── index.html          # Main HTML file with UI controls
├── main.js             # Core Three.js application logic
├── assets/             # Images and resources
├── vercel.json         # Deployment configuration
└── README.md           # This file
```

## 🎯 Core Functions

- `createFloatingHearts()` - Generates 20 heart-shaped 3D objects
- `createText()` - Creates 3D text with font loading
- `createRain()` - Implements falling heart particle system
- `setupLights()` - Configures ambient, directional, and point lighting
- `animate()` - Main animation loop with time-based calculations
- `setupButtons()` - Handles all user interface interactions

## 🌐 Live Demo

Visit the live demo: [Your Deployment URL Here]

## 📸 Screenshots

The scene features:

- Floating heart shapes in various colors
- Interactive 3D text that can change colors
- Falling heart rain effect
- Smooth orbit controls for camera movement
- Real-time shadows and lighting effects

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Three.js
