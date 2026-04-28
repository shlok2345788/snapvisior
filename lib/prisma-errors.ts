export function isDatabaseConnectionError(err: unknown) {
  if (!(err instanceof Error)) {
    return false;
  }

  const maybePrismaCode = (err as Error & { code?: string }).code;

  return (
    err.name === 'PrismaClientInitializationError' ||
    err.message.includes("Can't reach database server") ||
    err.message.includes('P1001') ||
    err.message.includes('P1002') ||
    err.message.includes('ECONNREFUSED') ||
    maybePrismaCode === 'P1001' ||
    maybePrismaCode === 'P1002'
  );
}