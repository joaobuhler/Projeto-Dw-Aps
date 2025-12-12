import "./navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar({ aberta }) {
  const navigate = useNavigate();
  return (
    <div className={`navbarContainer ${aberta ? "navbarAberta" : ""}`}>
            <div className="navbarContent">
              <div className='lista'>
                  <h2 id="goCriarLogin" className='subtitulo' onClick={() => navigate("/CriarQuiz")}>
                      <i className="material-icons">quiz</i>
                      Criar Quiz
                  </h2>
              </div>
              <div className='lista'>
                  <h2 className='subtitulo' onClick={() => navigate("/TopGlobal")}>
                      <i className="material-icons">public</i>
                      Ranking Global
                  </h2>
              </div>
            </div>
    </div>
  );
}

export default Navbar;
