import { cn } from "../../lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card"
import { TopKResults } from "../../app/interfaces/document"


type CardProps = React.ComponentProps<typeof Card>
interface AnswerCardProps {
    className?: string;
    answers: TopKResults[] | null;
  }

export function AnswerCard({ className, answers, ...props }: CardProps & AnswerCardProps) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Answers appear here</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {answers?.map((answer, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Similarity Score: {answer.score}
                </p>
                <p className="text-sm text-muted-foreground">
                  {answer.metadata.pageContent}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
