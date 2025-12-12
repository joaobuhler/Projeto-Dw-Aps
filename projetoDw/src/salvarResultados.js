// Arquivo: src/services/salvarResultado.js
import { supabase } from './supabase';

/**
 * Salva o resultado do quiz, usando o EMAIL do jogador como FK.
 *
 * @param {string} authUuid - O ID UUID do usuário logado (vindo do Supabase Auth).
 * @param {string} quizId - O ID UUID do quiz.
 * @param {number} score - A pontuação final obtida.
 * @returns {object} - O dado inserido ou lança um erro.
 */
export async function salvarResultado(authUuid, quizId, score) {
    if (!authUuid || !quizId || typeof score !== 'number') {
        throw new Error("Dados de resultado inválidos.");
    }

    const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('auth_uuid', authUuid) // Se você tiver uma coluna 'auth_uuid' do tipo UUID
        .single();

    if (userError || !userData || !userData.email) {
        console.error("Erro ao buscar email do usuário para o UUID:", authUuid, userError);
        throw new Error("Email do usuário não encontrado. Certifique-se de que o usuário existe e que a tabela 'usuarios' tem o 'auth_uuid' e o 'email' preenchidos.");
    }
    
    // O Email do jogador que será salvo em quiz_results (a FK)
    const jogadorEmail = userData.email;

    // PASSO 2: Salvar o resultado na tabela quiz_results
    // O 'user_id' (ou a coluna que armazena a FK) deve ser do tipo TEXT e conter o email.
    const { data, error } = await supabase
        .from('quiz_results')
        .insert([
            {
                // ** IMPORTANTE: Se o nome da coluna for diferente de 'user_id', ajuste aqui. **
                user_id: jogadorEmail, 
                quiz_id: quizId,
                score: score,
                played_at: new Date().toISOString(),
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Erro ao salvar resultado do quiz:", error);
        throw new Error(`Falha ao salvar o resultado no banco de dados: ${error.message}`);
    }

    return data;
}