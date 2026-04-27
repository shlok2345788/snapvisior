export function isDatabaseConnectionError(err: unknown) {
  if (!(err instanceof Error)) {
    return false;
  }

  return (
    err.name === 'PrismaClientInitializationError' ||
    err.message.includes("Can't reach database server")
  );
}