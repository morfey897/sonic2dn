export const json = (data: object, status: 200 | 404 | 500 = 200) => new Response(
  JSON.stringify(data),
  {
    status,
    headers: {
      'content-type': 'application/json',
    },
  }
);