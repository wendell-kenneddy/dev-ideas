import Image from 'next/image';

import { IdeaCard } from './IdeaCard';

export interface Idea {
  id: number;
  title: string;
  notionUrl?: string;
  figmaUrl?: string;
  goal: string;
}

interface IdeasProps {
  ideas: Idea[];
  isLoading: boolean;
}

export function Ideas({ ideas, isLoading }: IdeasProps) {
  return (
    <div
      className={`
        bg-black/25
        rounded
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        gap-4
        p-4
      `}
    >
      {isLoading ? (
        <div
          className={`
            spinner-border
            border-green-600
            border-b-transparent
            animate-spin
            inline-block
            w-16 h-16
            border-4
            rounded-full
            col-span-full
            align-self-center
            justify-self-center
          `}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ) : ideas.length ? (
        ideas.map((idea) => <IdeaCard idea={idea} key={idea.id} />)
      ) : (
        <div className="flex flex-col items-center gap-4 col-span-full">
          <p className="text-sm text-white/50 font-medium">Wow, so empty...</p>

          <div className="w-[152px] h-[128px] relative">
            <Image src="/cat.svg" alt="Cat image" layout="fill" priority />
          </div>
        </div>
      )}
    </div>
  );
}
