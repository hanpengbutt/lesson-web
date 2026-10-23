"use client";

import { useState } from "react";

export function PredictionNotebook({ title, questions }: { title: string; questions: string[] }) {
  const [answers, setAnswers] = useState(() => questions.map(() => ""));

  return (
    <fieldset className="prediction-notebook">
      <legend>{title}</legend>
      <p className="prediction-notebook-note">실행 전에 내 생각을 적어 보세요. 답변은 저장되거나 전송되지 않아요.</p>
      <div className="prediction-notebook-fields">
        {questions.map((question, index) => (
          <label className="prediction-question" key={`${index}-${question}`}>
            <span><strong>{index + 1}.</strong> {question}</span>
            <textarea
              rows={2}
              value={answers[index]}
              onChange={(event) => setAnswers((current) => current.map((answer, answerIndex) =>
                answerIndex === index ? event.target.value : answer,
              ))}
              placeholder="내 예상과 그렇게 생각한 이유를 적어 보세요."
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
