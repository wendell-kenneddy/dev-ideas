interface ProfileCardProps {
  status: string | number;
  value: string | number;
}

export function ProfileCard({ status, value }: ProfileCardProps) {
  return (
    <div
      className={`
        flex
        flex-col
        fold:flex-row
        fold:w-full
        items-center
        justify-between
        gap-2        
    `}
    >
      <span className="font-medium text-xs text-white/75">{status}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
