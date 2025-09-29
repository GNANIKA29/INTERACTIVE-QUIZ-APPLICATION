// ✅ questions.js – Fetching diverse questions from Open Trivia DB API with category support

async function generateQuestionPool(level, category = "any") {
  const amount = Math.min(5 + level, 10);
  const difficulty = level === 1 ? "easy" : level <= 4 ? "medium" : "hard";


  const categoryParam = category !== "any" ? `&category=${category}` : "";
  const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&encode=url3986&difficulty=${difficulty}${categoryParam}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || !data.results.length) throw new Error("No questions returned");

    return data.results.map(q => {
      const allOptions = [...q.incorrect_answers.map(decodeURIComponent), decodeURIComponent(q.correct_answer)];
      return {
        question: decodeURIComponent(q.question),
        answer: decodeURIComponent(q.correct_answer),
        options: shuffleArray(allOptions)
      };
    });
  } catch (err) {
    console.error("Failed to load questions:", err);
    showToast("⚠️ Couldn't load questions. Please check your connection.", "error");
    return [
      {
        question: "Failed to load. Try again.",
        answer: "",
        options: ["-", "-", "-", "-"]
      }
    ];
  }
}

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}
