import { JwtTokenGuard } from './jwt-token.guard.js';

describe('JwtTokenGuard', () => {
  it('should be defined', () => {
    expect(new JwtTokenGuard()).toBeDefined();
  });
});
