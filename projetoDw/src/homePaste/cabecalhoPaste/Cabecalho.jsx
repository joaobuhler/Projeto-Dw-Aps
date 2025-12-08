import "./cabecalho.css";
import Navbar from "../navbarPaste/Navbar";

function Cabecalho({ navbarAberta, setNavbarAberta }) {

  function toggleNavbar() {
    setNavbarAberta(!navbarAberta);
  }

  return (
    <>
      <div className="cabecalhoContainer">
        <div className="esquerdaCabecalho">
          <button onClick={toggleNavbar}><i className="material-icons menu" >menu</i></button>
          <h1>Quizado</h1>
        </div>
        <div className="direitaCabecalho">
          <button className="botaoLogin">Entrar</button>
          <button className="botaoPerfil"><i className="material-icons person">person</i></button>
        </div>
      </div>

      <Navbar aberta={navbarAberta} />
    </>
  );
}

export default Cabecalho;