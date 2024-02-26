'use client';

import { Scrapper } from "../components/ui/scrapper";
import { QuestionUi } from "../components/ui/question";
import { useState } from "react";
import { TopKResults } from "./interfaces/document";
import { AnswerCard } from "../components/ui/answer-card";

export default function Home() {
  const [answer, setAnswer] = useState<TopKResults[] | null>(null);
  const handleQuestionAnswer = (data: TopKResults[]) => {
    setAnswer(data);
  }

  return (
    <main className="flex min-h-screen flex-col md:flex-row items-center md:justify-between md:p-24 p-2">
      <div className="flex flex-col justify-between w-full items-center space-y-4">
        <Scrapper />
        <QuestionUi onApiResponse={handleQuestionAnswer} />
      </div>
      <div className="flex flex-col md:justify-between w-full md:items-center space-y-4 md:m-auto mt-5 z-20">
      <AnswerCard className="overflow-auto max-h-96" answers={answer} />

      </div>
    </main>
  );
}
