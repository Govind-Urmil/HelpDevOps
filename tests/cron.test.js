import {describe,it,expect} from 'vitest';import {analyzeCron} from '../src/tools/cron/analyzer.js';
describe('cron analyzer',()=>{
  it.each(['* * * * *','*/5 * * * *','30 9 * * 1-5','0 0 1,15 * *','1-20/2 4 * * *'])('accepts supported expression %s',input=>expect(analyzeCron(input).status).toBe('valid-with-notes'));
  it.each(['@hourly','@daily','@reboot'])('recognizes macro %s',input=>expect(analyzeCron(input).status).toBe('recognized'));
  it('preserves a command',()=>expect(analyzeCron('0 2 * * * /bin/backup').findings.join(' ')).toContain('/bin/backup'));
  it.each(['60 * * * *','* 24 * * *','* * 0 * *','* * * 13 *','* * * * 7','*/0 * * * *'])('rejects invalid expression %s',input=>expect(analyzeCron(input).status).toBe('invalid'));
  it('treats comments truthfully',()=>expect(analyzeCron('# comment').status).toBe('unsupported'));
});
