import Link from 'next/link';

import { FiArrowRight } from 'react-icons/fi';
import { Idea } from './Ideas';

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const { goal, title, notionUrl, figmaUrl, id } = idea;

  return (
    <div
      className={`
        w-full
        bg-neutral-900
        p-4
        rounded
        shadow-md
        transition-all
        ease-in-out
        hover:-translate-y-1
        border-[1px]
        border-transparent
        hover:border-green-600
        flex
        flex-col
        items-start
        justify-between
        gap-2
      `}
    >
      <Link href={`/ideas/${id}`}>
        <a
          className={`
             flex w-full
             items-center
             justify-between
             gap-2
             hover:text-green-600
             group
          `}
        >
          <h3
            className={`
            text-md
            line-clamp-1
            font-medium
            transition-colors
          `}
          >
            {title}
          </h3>

          <FiArrowRight
            fontSize={16}
            className={`
              -translate-x-1
              group-hover:translate-x-1
              transition-transform
            `}
            title="Arrow icon"
          />
        </a>
      </Link>

      <p className="text-xs text-white/75 line-clamp-2">{goal}</p>

      <div className="flex items-center gap-4">
        {notionUrl ? (
          <a
            className="text-green-600 font-medium text-sm"
            href={notionUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Notion
          </a>
        ) : (
          <p className="text-green-600/50 font-medium text-sm select-none">
            Notion
          </p>
        )}
        {figmaUrl ? (
          <a
            className="text-green-600 font-medium text-sm"
            href={figmaUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Figma
          </a>
        ) : (
          <p className="text-green-600/50 font-medium text-sm select-none">
            Figma
          </p>
        )}
      </div>
    </div>
  );
}
