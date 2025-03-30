# Projviz

Projviz is an advanced web-based 3D visualization tool designed to facilitate the seamless loading, viewing, and interaction with 3D models directly within a web browser. Built on the robust Three.js library, Projviz offers a sophisticated platform for 3D model manipulation and visualization.
![image](https://github.com/user-attachments/assets/32a78f22-9c99-4358-bb7d-6d2cef3052b1)

## Key Features

### Dynamic 3D Model Loading
- **GLTF/GLB Support**: Efficiently load and render 3D models in GLTF/GLB formats, leveraging Three.js's powerful loading capabilities.
- **Server Integration**: Fetch and display models from a server, enabling dynamic content updates and remote model management.

### Interactive Scene Management
- **Singleton Architecture**: Utilize `CanvasManager` and `SceneManager` singletons to ensure efficient resource management and consistent scene rendering.
- **Advanced Object Manipulation**: Implement `TransformGizmo` for intuitive object transformations, including translation, rotation, and scaling.

### Enhanced User Interaction
- **Object Selection and Highlighting**: Employ `ObjectSelector` and `Highlighter` to enable precise object selection and visual feedback, enhancing user interaction within the 3D environment.
- **Customizable Camera Controls**: Integrate `MainControl` for flexible camera navigation, providing users with an immersive experience.

### Intuitive User Interface
- **Modular UI Components**: Developed a responsive and modular UI (vanilla js) using custom components, facilitating easy integration and extension.
- **Comprehensive Object Information Panel**: Display detailed object properties and allow real-time updates, offering users complete control over model attributes.

## Getting Started

To deploy and run Projviz locally, follow these steps:

   ```bash
   git clone https://github.com/yourusername/projviz.git
   cd projviz
   npm i
   npm run dev
# Open your browser and navigate to http://localhost:3000 to explore the capabilities of Projviz.
```


