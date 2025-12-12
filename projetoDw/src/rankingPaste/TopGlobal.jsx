import "./topGlobal.css";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function TopGlobal() {
    const navigate = useNavigate();

    const [ranking, setRanking] = useState({
        Fácil: [],
        Médio: [],
        Difícil: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // =================================
    // 🌟 CARREGAR RANKING
    // =================================
    const fetchRanking = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // SELECT universal (funciona mesmo com várias FKs)
            const { data: results, error: resultsError } = await supabase
                .from("quiz_results")
                .select(`
                    score,
                    quizzes!inner (
                        dificuldade
                    ),
                    usuarios!inner (
                        email
                    )
                `)
                .gt("score", 0)
                .order("score", { ascending: false });

            if (resultsError) throw resultsError;

            if (!results || results.length === 0) {
                setRanking({ Fácil: [], Médio: [], Difícil: [] });
                setIsLoading(false);
                return;
            }

            // Remove registros inválidos
            const valid = results.filter(r =>
                r.score > 0 &&
                r.quizzes?.dificuldade &&
                r.usuarios?.email
            );

            // Estrutura inicial do ranking
            const aggregated = {
                Fácil: {},
                Médio: {},
                Difícil: {},
            };

            // Pega somente o MAIOR score de cada jogador
            valid.forEach(r => {
                const dif = r.quizzes.dificuldade;
                const email = r.usuarios.email;
                const score = r.score;

                if (!aggregated[dif]) return;

                const current = aggregated[dif][email] || 0;
                if (score > current) aggregated[dif][email] = score;
            });

            // Converter para arrays ordenadas
            const finalRanking = {};

            ["Fácil", "Médio", "Difícil"].forEach(dif => {
                const lista = Object.entries(aggregated[dif]).map(([email, score]) => ({
                    email,
                    score,
                }));

                lista.sort((a, b) => b.score - a.score);

                finalRanking[dif] = lista.slice(0, 10); // Top 10
            });

            setRanking(finalRanking);

        } catch (err) {
            console.error("ERRO no ranking:", err);
            setError("Não foi possível carregar o ranking. Verifique as FKs no Supabase.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRanking();
    }, []);

    // =================================
    // 🌟 LISTA DE RANKING
    // =================================
    const renderRankingList = (dif) => {
        const lista = ranking[dif];

        if (lista.length === 0) {
            return <li className="tg-item-vazio">Nenhum resultado encontrado.</li>;
        }

        return lista.map((item, index) => (
            <li key={item.email + index} className="tg-item-ranking">
                <span className="tg-posicao">{index + 1}º</span>
                <span className="tg-nome">{item.email}</span>
                <span className="tg-score">{item.score} pts</span>
            </li>
        ));
    };

    return (
        <div className="tg-container">
            <i className="material-icons tg-back-icon" onClick={() => navigate(-1)}>
                arrow_back
            </i>

            <h1>Top Global</h1>

            {isLoading && <p>Carregando ranking...</p>}
            {error && <p className="tg-error">{error}</p>}

            {!isLoading && !error && (
                <div className="tg-boxes">

                    {/* FÁCIL */}
                    <div className="tg-col">
                        <h2>Fácil</h2>
                        <ul className="tg-list">{renderRankingList("Fácil")}</ul>
                    </div>

                    {/* MÉDIO */}
                    <div className="tg-col">
                        <h2>Médio</h2>
                        <ul className="tg-list">{renderRankingList("Médio")}</ul>
                    </div>

                    {/* DIFÍCIL */}
                    <div className="tg-col">
                        <h2>Difícil</h2>
                        <ul className="tg-list">{renderRankingList("Difícil")}</ul>
                    </div>

                </div>
            )}
        </div>
    );
}

export default TopGlobal;
