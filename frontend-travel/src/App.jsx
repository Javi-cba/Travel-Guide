import { PageHome } from './pages/PageHome';
import CmpHeader from './components/navbar/CmpHeader';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PageRegister from './pages/login/PageRegister';

function App() {
  return (
    <div className="App">
      <Router>
        <CmpHeader /> {/* Siempre se muestra */}
        <Routes>
          <Route path="/" element={<PageHome />} />

          {/* Ruta protegida */}
          <Route path="/register" element={<PageRegister />} />

          {/* <Route
            path="/tareas"
            element={
              <PrivateRoute>
                <PageTask />
              </PrivateRoute>
            }
          /> */}
          {/* Ruta de unauthorized */}
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
          {/* Ruta 404 */}
          {/* <Route path="/*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
