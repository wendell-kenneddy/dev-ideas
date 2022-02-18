import Image from 'next/image';

export default function ServerError() {
  return (
    <main
      className={`
        w-[90vw]
        max-w-[720px]
        mx-auto
        flex
        flex-col
        items-center
        justify-center
        gap-10
      `}
    >
      <h1 className="font-medium">
        Seems like something gone wrong on the server...
      </h1>

      <div className="w-[200px] h-[152px] relative">
        <Image
          src="/location-search.svg"
          alt="Location search illustration"
          layout="fill"
          priority
        />
      </div>
    </main>
  );
}
