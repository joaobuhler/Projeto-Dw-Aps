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

    const fetchRanking = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. BUSCA DE TODOS OS RESULTADOS COM RELACIONAMENTOS
            // Busca o SCORE, a DIFICULDADE e o EMAIL do jogador através da FK
            let { data: results, error: resultsError } = await supabase
                .from('quiz_results')
                .select(`
                    score,
                    quizzes (dificuldade),
                    usuarios (email) // <<-- MUDANÇA: Buscando o email para o ranking
                `)
                .not('quizzes.dificuldade', 'is', null)
                .gt('score', 0) // Garante que só resultados válidos (score > 0) sejam puxados
                .order('score', { ascending: false }); 

            if (resultsError) throw resultsError;

            // Filtra os resultados que vieram com o JOIN vazio (sem email ou score)
            const validResults = results.filter(r => 
                r.score && r.score > 0 && 
                r.quizzes?.dificuldade && 
                r.usuarios?.email 
            );
            
            // 2. AGREGAÇÃO: Encontra a pontuação MÁXIMA por Jogador (identificado pelo Email) e por Dificuldade
            const aggregatedRanking = {
                Fácil: {},
                Médio: {},
                Difícil: {},
            };

            validResults.forEach(result => {
                const dificuldade = result.quizzes.dificuldade;
                const emailJogador = result.usuarios.email; 
                const score = result.score;
                
                if (dificuldade in aggregatedRanking) {
                    const currentMaxScore = aggregatedRanking[dificuldade][emailJogador] || 0;
                    
                    // Salva a pontuação máxima
                    if (score > currentMaxScore) {
                        aggregatedRanking[dificuldade][emailJogador] = score;
                    }
                }
            });

            // 3. CONVERSÃO PARA ARRAYS ORDENADOS (TOP 10)
            const finalRanking = {};
            
            ['Fácil', 'Médio', 'Difícil'].forEach(dificuldade => {
                // Converte o objeto {email: score} para uma lista de objetos [{email, score}]
                const list = Object.entries(aggregatedRanking[dificuldade]).map(([email, score]) => ({
                    email, // Identificador agora é o email
                    score,
                }));

                list.sort((a, b) => b.score - a.score);
                
                finalRanking[dificuldade] = list.slice(0, 10);
            });

            setRanking(finalRanking);

        } catch (err) {
            console.error("Erro ao buscar ranking:", err.message);
            // Esta mensagem é exibida se houver falha na busca (geralmente Foreign Key ou RLS)
            setError("Não foi possível carregar o ranking. Verifique as configurações de JOIN (relacionamento email).");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Busca o ranking na montagem do componente
        fetchRanking();
    }, []);

    // ================================================
    // 🎨 Renderização da Lista
    // ================================================
    const renderRankingList = (difficulty) => {
        const list = ranking[difficulty];
        
        if (list.length === 0) {
            return <li className="tg-item-vazio">Nenhum resultado encontrado.</li>;
        }

        return list.map((item, index) => (
            // A chave precisa ser única, usamos o email + index
            <li key={item.email + index} className="tg-item-ranking">
                <span className="tg-posicao">{index + 1}º</span> 
                {/* Exibe o email do jogador */}
                <span className="tg-nome">{item.email}</span> 
                {/* Exibe o score do jogador */}
                <span className="tg-score">({item.score} pts)</span> 
            </li>
        ));
    };


    return (
        <div className="tg-container">
            <i 
                className="material-icons tg-back-icon" 
                onClick={() => navigate(-1)}
            >
                arrow_back
            </i>
            <h1>Top Global</h1>

            {isLoading && <p>Carregando ranking...</p>}
            {error && <p className="tg-error">{error}</p>}

            {!isLoading && !error && (
                <div className="tg-boxes">

                    {/* Coluna FÁCIL */}
                    <div className="tg-col">
                        <h2>Fácil</h2>
                        <ul className="tg-list">
                            {renderRankingList('Fácil')}
                        </ul>
                    </div>
                    
                    {/* Coluna MÉDIO */}
                    <div className="tg-col">
                        <h2>Médio</h2>
                        <ul className="tg-list">
                            {renderRankingList('Médio')}
                        </ul>
                    </div>

                    {/* Coluna DIFÍCIL */}
                    <div className="tg-col">
                        <h2>Difícil</h2>
                        <ul className="tg-list">
                            {renderRankingList('Difícil')}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TopGlobal;