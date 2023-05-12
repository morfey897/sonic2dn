import type { NextRequest } from 'next/server';
import { json } from '@/edge/response';

export const config = {
  runtime: 'edge',
};

//@ts-ignore
const bufferToHex = (buffer: ArrayBufferLike) => [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');

async function generateSignedUrl(link: string) {
  const url = new URL(link);
  // `url` is a full imagedelivery.net URL
  // e.g. https://imagedelivery.net/cheeW4oKsx5ljh8e8BoL2A/bc27a117-9509-446b-8c69-c81bfeac0a01/mobile

  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(process.env.IMAGES_KEY);
  const key = await crypto.subtle.importKey(
    'raw',
    secretKeyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Attach the expiration value to the `url`
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  url.searchParams.set('exp', expiry.toString());
  // `url` now looks like
  // https://imagedelivery.net/cheeW4oKsx5ljh8e8BoL2A/bc27a117-9509-446b-8c69-c81bfeac0a01/mobile?exp=1631289275

  const stringToSign = url.pathname + '?' + url.searchParams.toString();
  // for example, /cheeW4oKsx5ljh8e8BoL2A/bc27a117-9509-446b-8c69-c81bfeac0a01/mobile?exp=1631289275

  // Generate the signature
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign));
  const sig = bufferToHex(new Uint8Array(mac).buffer);

  // And attach it to the `url`
  url.searchParams.set('sig', sig);

  return url;
}

export default async function handler(req: NextRequest) {
  const imageId = req.nextUrl.searchParams.get('imageId');
  const url = await generateSignedUrl(`https://imagedelivery.net/${process.env.IMAGES_HASH}/${imageId}/public`);
  return fetch(url);
}