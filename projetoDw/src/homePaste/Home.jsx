import { useState } from "react";
import "./home.css";
import Cabecalho from "./cabecalhoPaste/Cabecalho";
import Corpo from "./corpoPaste/Corpo";

function Home() {
  const [navbarAberta, setNavbarAberta] = useState(false);

  return (
    <div>
      <div className="homeContainer">
        <Cabecalho navbarAberta={navbarAberta} setNavbarAberta={setNavbarAberta} />
        {/* overlay que escurece o conteúdo quando a navbar está aberta */}
        <div
          className={`overlay ${navbarAberta ? "active" : ""}`}
          onClick={() => setNavbarAberta(false)}
          aria-hidden={!navbarAberta}
        />
        <div className="homeBaixoCabecalho">
          <Corpo />
        </div>
      </div>
    </div>
  );
}

export default Home;