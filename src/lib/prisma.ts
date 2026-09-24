// Dummy stub for Prisma client to avoid build errors or database connections in demo mode
export const prisma = new Proxy({}, {
  get(_target, prop) {
    if (prop === "then") return undefined;
    return () => Promise.resolve(null);
  }
}) as any;

