import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { apagarQuiz } from "../../funcaosupa";

import "./corpo.css";

function Corpo() {
    const [modoEscuro, setModoEscuro] = useState(() => {
        try {
            const raw = localStorage.getItem("modoEscuro");
            return raw ? JSON.parse(raw) : false;
        } catch (e) {
            return false;
        }
    });

    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    // ---- CARREGAR QUIZZES ----
    useEffect(() => {
        async function fetchQuizzes() {
            const { data, error } = await supabase
                .from("quizzes")
                .select("*")
                .order("criado_em", { ascending: false });

            if (!error) setQuizzes(data);
            else console.error(error);
        }

        fetchQuizzes();
    }, []);

    // ---- FUNÇÃO APAGAR ----
    async function handleDelete(id) {
        const ok = window.confirm("Tem certeza que deseja apagar esse quiz?");
        if (!ok) return;

        const resultado = await apagarQuiz(id);

        if (resultado?.error) {
            alert("Erro ao apagar.");
            return;
        }

        setQuizzes((prev) => prev.filter((q) => q.id !== id));
        alert("Quiz apagado!");
    }

    // ---- MODO ESCURO ----
    useEffect(() => {
        const root = document.documentElement;

        if (modoEscuro) {
            root.style.setProperty("--cor-principal", "#024950");
            root.style.setProperty("--cor-fundo", "#161616");
            root.style.setProperty("--cor-detalhes", "#1c5966");
            root.style.setProperty("--cor-escura", "#172a3a");
            root.style.setProperty("--cor-navbar", "rgb(17, 17, 17)");
        } else {
            root.style.setProperty("--cor-principal", "#82c0cc");
            root.style.setProperty("--cor-fundo", "#edf2f4");
            root.style.setProperty("--cor-detalhes", "#489fb5");
            root.style.setProperty("--cor-escura", "#16697a");
            root.style.setProperty("--cor-navbar", "#489fb5");
        }

        try {
            localStorage.setItem("modoEscuro", JSON.stringify(modoEscuro));
        } catch (e) {}
    }, [modoEscuro]);


    return (
        <div className="corpoContainer">
            <div className="corpoConteudo">

                {quizzes.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="blocoQuiz quizCard"
                        onClick={() => setSelectedQuiz(quiz)}
                    >
                        <div className="topoCard">
                            <h2>{quiz.nome}</h2>

                            <button
                                className="btnApagar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(quiz.id);
                                }}
                            >
                                🗑️
                            </button>
                        </div>

                        <div className="sobreQuiz">
                            <p><strong>Categoria:</strong> {quiz.categoria}</p>
                            <p><strong>Dificuldade:</strong> {quiz.dificuldade}</p>
                            <p><strong>Tempo/questão:</strong> {quiz.tempo}</p>
                        </div>
                    </div>
                ))}

                {quizzes.length === 0 && (
                    <p style={{ textAlign: "center", width: "100%" }}>
                        Nenhum quiz criado ainda.
                    </p>
                )}
            </div>

            {/* BOTÃO TEMA */}
            <div
                id="botaoMode"
                onClick={() => setModoEscuro(!modoEscuro)}
                role="button"
                aria-pressed={modoEscuro}
            >
                <i className="material-icons">
                    {modoEscuro ? "dark_mode" : "light_mode"}
                </i>
            </div>

            {/* MODAL */}
            {selectedQuiz && (
                <div className="modalOverlay" onClick={() => setSelectedQuiz(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h1>{selectedQuiz.nome}</h1>
                        <p><strong>Categoria:</strong> {selectedQuiz.categoria}</p>
                        <p><strong>Dificuldade:</strong> {selectedQuiz.dificuldade}</p>
                        <p><strong>Tempo por questão:</strong> {selectedQuiz.tempo}</p>
                        <p><strong>Poderes:</strong> {selectedQuiz.permitir_poderes ? "Sim" : "Não"}</p>

                        <button
                            className="btnJogar"
                            onClick={() => window.location.href = `/jogarQuiz/${selectedQuiz.id}`}
                        >
                            Jogar
                        </button>

                        <button
                            className="btnFechar"
                            onClick={() => setSelectedQuiz(null)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Corpo;
