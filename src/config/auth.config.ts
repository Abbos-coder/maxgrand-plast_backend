export const authConfig = {
  // Static credentials stored in the codebase
  login: 'admin',
  password: '123maxgrand',
  // Secret used to sign generated tokens
  tokenSecret: 'khamidullaev_token_secret',
  // Token lifetime in milliseconds (24 hours)
  tokenTtlMs: 24 * 60 * 60 * 1000,
};
