import type { NextRequest } from 'next/server';
import { json } from '@/edge/response';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  // return json({ success: true });
  try {
    const data = await req.formData();
    const files = data.get('files');
    const filesValue = files?.toString();
    const amount = parseInt(filesValue || "0");
    if (!amount || isNaN(amount)) throw new Error(`Files isn't found`, { cause: `Files: ${filesValue}` });
    const uploades = [];
    for (let i = 0; i < amount; i++) {
      let file = data.get(`file[${i}]`);
      if (!file) continue;
      const outcome = new FormData();
      outcome.append('file', file);
      outcome.append('requireSignedURLs', "true");
      uploades.push(fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/images/v1`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.API_TOKEN}`
        },
        body: outcome,
      }));
    }

    const promisses = (await Promise.allSettled(uploades));
    const images = [];
    for (let i = 0; i < promisses.length; i++) {
      let { status } = promisses[i];
      if (status === 'fulfilled') {
        let promise = promisses[i] as PromiseFulfilledResult<Response>;
        const { result } = await promise.value.json();
        images[i] = { success: true, result };
      } else if (status === 'rejected') {
        let promise = promisses[i] as PromiseRejectedResult;
        images[i] = { success: false, error: promise.reason };
      }
    }
    // .map(({ status, value }) => status === "fulfilled" ? value.json());

    return json({ success: true, images });
  } catch (error) {
    console.log('ERROR', error);
  }
  return json({ test: 'DATA_TEST' });
}