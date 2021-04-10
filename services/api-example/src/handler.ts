const handler = async function (event: any, context: any) {
  return {
    statusCode: 400,
    headers: {},
    body: JSON.stringify({
      message: "hello world",
      event,
      context,
    }),
  };
};

export { handler };
