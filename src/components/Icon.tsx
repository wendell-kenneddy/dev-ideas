import Image from 'next/image';
import Link from 'next/link';

export function Icon() {
  return (
    <h1>
      <Link href="/">
        <a>
          <Image src="/icon.svg" alt="Logo" width={48} height={48} priority />
        </a>
      </Link>
    </h1>
  );
}
