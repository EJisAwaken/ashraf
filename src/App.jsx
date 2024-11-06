import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Fournisseurs from './pages/Fournisseurs';
import Carburants from './pages/Carburants';
import Categories from './pages/Categories';
import Produits from './pages/Produits';
import MouvementsStock from './pages/MouvementsStock';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Toaster position="top-right" />
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          
          <main className="lg:pl-64 p-4">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/fournisseurs" element={<Fournisseurs />} />
                <Route path="/carburants" element={<Carburants />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/produits" element={<Produits />} />
                <Route path="/mouvements" element={<MouvementsStock />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;