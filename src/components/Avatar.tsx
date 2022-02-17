import Image from 'next/image';

import { FiUser } from 'react-icons/fi';

interface AvatarProps {
  src?: string;
}

export function Avatar({ src }: AvatarProps) {
  return src ? (
    <Image
      src={src}
      alt="Avatar image"
      layout="fill"
      className="rounded-full"
    />
  ) : (
    <FiUser color="#fff" fontSize="24" title="Avatar image" />
  );
}
