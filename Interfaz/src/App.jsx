import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './componentes/Nav';
import Inicio from './componentes/Inicio';
import Simulador from './componentes/Simulador';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Nav /> 
        
        <div className="w-full grow flex flex-col">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/simulador" element={<Simulador />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;