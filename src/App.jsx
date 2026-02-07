import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:videoId" element={<Watch />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>
            Built with ❤️ using React + Google Drive API
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
