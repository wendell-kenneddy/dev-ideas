import { ProfileCard } from './ProfileCard';

export interface Profile {
  completed: number;
  ongoing: number;
  lastCompletedDate: string;
}

interface ProfileProps {
  profile?: Profile;
  isLoading: boolean;
}

export function Profile({ profile, isLoading }: ProfileProps) {
  return (
    <div
      className={`
        transition-shadow
        ease-in-out
        shadow-sm
        shadow-green-600/50
        hover:shadow-green-600/100
        bg-neutral-900
        w-full
        flex
        fold:flex-col
        items-center
        ${isLoading ? 'justify-center' : 'justify-between'}
        p-4 rounded
        select-none
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
            w-[44px] h-[44px]
            border-4
            rounded-full
          `}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          <ProfileCard status="Completed" value={profile?.completed ?? '-'} />
          <ProfileCard
            status="Last completed date"
            value={profile?.lastCompletedDate ?? '- - -'}
          />
          <ProfileCard status="Ongoing" value={profile?.ongoing ?? '-'} />
        </>
      )}
    </div>
  );
}
