import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/login";
import Register from "./pages/register";
import Index from "./pages/index";
import AllRecipes from './pages/all-recipe';

const App = () => {
  console.log('App rendering...');
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Index />} />
        <Route path="/all-recipe" element={<AllRecipes />} />
      </Routes>
    </Router>
  );
}

export default App;
