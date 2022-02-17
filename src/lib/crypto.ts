import AES from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';

const secret = process.env.CRYPTO_SECRET as string;

export function encryptString(str: string) {
  return AES.encrypt(str, secret).toString();
}

export function decryptString(str: string) {
  return AES.decrypt(str, secret).toString(utf8);
}
