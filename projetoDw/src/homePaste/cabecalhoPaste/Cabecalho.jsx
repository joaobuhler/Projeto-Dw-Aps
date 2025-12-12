// Cabecalho.jsx
import "./cabecalho.css";
import Navbar from "../navbarPaste/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase"; // <-- ajuste se seu arquivo se chama services/supabase.js ou outro caminho

function Cabecalho({ navbarAberta, setNavbarAberta }) {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [debugMsg, setDebugMsg] = useState("");

  function toggleNavbar() {
    setNavbarAberta(!navbarAberta);
  }

  useEffect(() => {
    async function carregarUsuario() {
      try {
        setDebugMsg("Iniciando carregamento do usuário...");

        // 1) tenta getUser (supabase v2)
        const { data: authData, error: authGetUserError } = await supabase.auth.getUser();
        if (authGetUserError) {
          console.error("auth.getUser error:", authGetUserError);
          setDebugMsg("Erro ao chamar supabase.auth.getUser()");
        }
        const userFromGetUser = authData?.user ?? null;
        console.log("auth.getUser ->", userFromGetUser);

        // 2) se não tiver, tenta getSession (em alguns contextos o getUser pode falhar)
        if (!userFromGetUser) {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.warn("auth.getSession error:", sessionError);
          }
          const userFromSession = sessionData?.session?.user ?? null;
          console.log("auth.getSession ->", userFromSession);
          if (userFromSession) {
            await buscarNomeNaTabela(userFromSession.id);
            return;
          }
        } else {
          await buscarNomeNaTabela(userFromGetUser.id);
          return;
        }

        // 3) última tentativa: pega usuário ativo via onAuthStateChange (não esperar forever, só subscribe rápido)
        let unsub = () => {};
        const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("onAuthStateChange", event, session);
          const u = session?.user ?? null;
          if (u) {
            buscarNomeNaTabela(u.id);
          }
        });
        if (sub?.subscription) {
          unsub = () => sub.subscription.unsubscribe();
        }
        // cleanup
        return () => unsub();
      } catch (err) {
        console.error("Erro em carregarUsuario:", err);
        setDebugMsg("Erro interno ao carregar usuário (ver console).");
      }
    }

    async function buscarNomeNaTabela(userId) {
      try {
        setDebugMsg(`Buscando nome para id: ${userId}`);
        // Ajuste o nome da tabela/coluna se for diferente
        const { data, error, status } = await supabase
          .from("usuarios")
          .select("nome, id")
          .eq("id", userId)
          .single();

        if (error && status !== 406) {
          console.error("Erro ao buscar na tabela usuarios:", error);
          setDebugMsg("Erro ao buscar nome na tabela usuarios (veja console).");
          setNomeUsuario("");
          return;
        }

        console.log("resultado usuarios.select:", { data, error, status });
        if (data?.nome) {
          setNomeUsuario(data.nome);
          setDebugMsg("Nome carregado com sucesso.");
        } else {
          // Se não encontrou na tabela usuarios, tenta user_metadata (caso tenha)
          const { data: authData2 } = await supabase.auth.getUser();
          const userMeta = authData2?.user?.user_metadata;
          console.log("user_metadata fallback ->", userMeta);
          if (userMeta?.nome) {
            setNomeUsuario(userMeta.nome);
            setDebugMsg("Nome carregado do user_metadata.");
          } else {
            setNomeUsuario("Usuário");
            setDebugMsg("Nome não encontrado em usuarios nem em user_metadata.");
          }
        }
      } catch (err) {
        console.error("Erro buscarNomeNaTabela:", err);
        setDebugMsg("Erro ao buscar nome (ver console).");
      }
    }

    carregarUsuario();
  }, []);

  return (
    <>
      <div className="cabecalhoContainer">
        <div className="esquerdaCabecalho">
          <button onClick={toggleNavbar}>
            <i className="material-icons menu">menu</i>
          </button>
          <h1>Quizado</h1>
        </div>

        <div className="direitaCabecalho">
          <button className="botaoPerfil">
            <i className="material-icons person">person</i>
          </button>

          <span className="nomeUsuario">{nomeUsuario}</span>
        </div>
      </div>

      <Navbar aberta={navbarAberta} />
      {/* elemento de debug visível só enquanto estiver desenvolvendo */}
      <div style={{ position: "fixed", bottom: 8, left: 8, color: "#eee", fontSize: 12 }}>
       
      </div>
    </>
  );
}

export default Cabecalho;
