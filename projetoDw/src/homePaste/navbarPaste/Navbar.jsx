import "./navbar.css";

function Navbar({ aberta }) {
  return (
    <div className={`navbarContainer ${aberta ? "navbarAberta" : ""}`}>
            <div className="navbarContent">
              <div className='lista'>
                  <h2 className='subtitulo'>
                      <i className="material-icons">quiz</i>
                      Criar Quiz
                  </h2>
              </div>
              <div className='lista'>
                  <h2 className='subtitulo'>
                      <i className="material-icons">play_arrow</i>
                      Jogar Quiz
                  </h2>
              </div>
              <div className='lista'>
                  <h2 className='subtitulo'>
                      <i className="material-icons">public</i>
                      Ranking Global
                  </h2>
              </div>
            </div>
    </div>
  );
}

export default Navbar;
