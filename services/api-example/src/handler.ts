export async function handler(event: any, context: any) {
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({
      message: "hello world",
      event,
      context,
    }),
  };
}
