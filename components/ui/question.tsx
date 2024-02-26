"use client";
import React, { useState } from "react";
import { BackgroundGradient } from "./background-gradient";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { TopKResults } from "../../app/interfaces/document";
import { useToast } from "./use-toast";
import { string, object } from 'zod';

interface QuestionUiProps {
  onApiResponse: (responseInfo: TopKResults[]) => void;
}

export function QuestionUi({ onApiResponse }: QuestionUiProps) {
  const questionSchema = object({
    question: string().min(3, {
      message: "Question too short",
    }),
  });
  const { toast } = useToast();

  const [question, setQuestion] = useState('');

  const fetchAnswer = async () => {
    try {
      questionSchema.parse({ question });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        // @ts-ignore
        description: JSON.parse(error.message)[0].message,
      });
      return;
    }

    toast({
        title: "Hold tight!",
        description: "We're coming ringht back w/ answers",
    });
    const response = await fetch('/question/', {
      method: "POST",
      body: JSON.stringify({question}),
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }

    const data = await response.json();
    onApiResponse(data);

  }
  
  const handleQuestionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setQuestion(event.target.value);
  }
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          Here is your moment to ask questions
        </p>

        <Textarea onChange={handleQuestionChange} />
        <div className="text-center">
          <Button onClick={fetchAnswer} className="mx-auto my-4">Ask</Button>
        </div>

      </BackgroundGradient>
    </div>
  );
}
