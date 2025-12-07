import "./global.css";
import "./theme.css";
import Home from "./homePaste/Home";
import Login from "./loginCadastroPaste/LoginCadastro";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CriarQuiz from "./criarQuizPaste/CriarQuiz";
import EntrarSala from "./entrarSalaPaste/EntrarSala";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/CriarQuiz" element={<CriarQuiz />} />
        <Route path="/EntrarSala" element={<EntrarSala />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
