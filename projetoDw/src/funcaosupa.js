import { supabase } from "./supabase";

export async function apagarQuiz(idQuiz) {
  try {
    const { error } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", idQuiz);

    if (error) {
      console.error("Erro ao apagar no Supabase:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Erro inesperado:", err);
    return false;
  }
}
