declare namespace Express {
  interface Request {
    userId: string;
    roleId: string;
    rawBody: string;
  }
}
