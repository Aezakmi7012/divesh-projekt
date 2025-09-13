import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import CADTool from './pages/CADTool';
import './styles/globals.css';

// Main App component that sets up routing and layout
// Converted from multiple HTML files into a single-page React application
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* CAD Tool route - special case without header/footer for full-screen experience */}
          <Route path="/cad" element={<CADTool />} />
          
          {/* Regular pages with header and footer */}
          <Route path="/*" element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;