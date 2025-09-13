# Mavick Watches - React Version

This is the React conversion of your original HTML/CSS/JavaScript watch designing website. The project maintains all the original functionality while organizing the code into reusable React components.

## 🚀 Project Structure

```
react-mavick-watches/
├── public/
│   └── (static assets will go here)
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header component
│   │   ├── Header.css          # Header styles
│   │   ├── Footer.jsx          # Footer component
│   │   ├── Footer.css          # Footer styles
│   │   ├── Hero.jsx            # Hero section for home page
│   │   ├── Hero.css            # Hero section styles
│   │   ├── Features.jsx        # Features section component
│   │   └── Testimonials.jsx    # Testimonials section component
│   ├── pages/
│   │   ├── Home.jsx            # Home page (combines Hero, Features, Testimonials)
│   │   ├── About.jsx           # About page
│   │   ├── CADTool.jsx         # 3D CAD application
│   │   └── CADTool.css         # CAD tool styles
│   ├── styles/
│   │   └── globals.css         # Global styles (converted from style.css)
│   ├── App.jsx                 # Main app component with routing
│   └── main.jsx                # Entry point
├── index.html                  # Main HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🛠 How to Run the Project

1. **Install Dependencies:**
   ```bash
   cd react-mavick-watches
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   This will start the Vite development server, typically on `http://localhost:3000`

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 📝 Key Features Preserved

- ✅ **Navigation**: React Router handles page navigation (Home, About, CAD)
- ✅ **Responsive Design**: All original CSS and responsive features maintained
- ✅ **3D CAD Tool**: Full Three.js integration with React lifecycle management
- ✅ **STL Export**: Complete CAD functionality including file export
- ✅ **Styling**: All original styles converted to work with React
- ✅ **Component Structure**: Code organized into reusable components

## 🧩 Component Breakdown

### Layout Components
- **Header**: Navigation bar with active state management
- **Footer**: Simple footer with brand messaging

### Home Page Components
- **Hero**: Main landing section with call-to-action buttons
- **Features**: "Why Mavick?" section with feature cards
- **Testimonials**: Customer testimonials section

### Pages
- **Home**: Combines Hero, Features, and Testimonials
- **About**: Company information and process explanation
- **CADTool**: Full 3D design application

## 🔧 Technical Notes

### Three.js Integration
The CAD tool uses React hooks (`useRef`, `useEffect`, `useState`) to properly integrate Three.js with React's component lifecycle. The 3D scene is initialized when the component mounts and cleaned up when it unmounts.

### Routing
React Router is configured to:
- Show Header/Footer on Home and About pages
- Display CAD tool full-screen without Header/Footer
- Handle active navigation states

### State Management
The application uses React's built-in state management:
- Component-level state for UI interactions
- Refs for Three.js object management
- Context could be added later if needed

## 🎨 Styling Approach
- Global styles in `src/styles/globals.css`
- Component-specific styles in individual CSS files
- CSS custom properties (variables) maintained from original
- All original visual design preserved

## 🚧 Future Enhancements
- Add TypeScript for better type safety
- Implement proper error boundaries
- Add loading states for 3D models
- Create a component library for reusable UI elements
- Add unit tests with Jest and React Testing Library