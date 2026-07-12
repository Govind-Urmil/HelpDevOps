import {describe,it,expect} from 'vitest';import {analyzeCron} from '../src/tools/cron/analyzer.js';
describe('cron analyzer',()=>{
  it.each(['* * * * *','*/5 * * * *','30 9 * * 1-5','0 0 1,15 * *','1-20/2 4 * * *'])('accepts supported expression %s',input=>expect(analyzeCron(input).status).toBe('valid-with-notes'));
  it.each(['@hourly','@daily','@reboot'])('recognizes macro %s',input=>expect(analyzeCron(input).status).toBe('recognized'));
  it('preserves a command',()=>expect(analyzeCron('0 2 * * * /bin/backup').findings.join(' ')).toContain('/bin/backup'));
  it.each(['0 0 12 * * ?','0 0 * * * 2027','0 0 12 * * *','0 0 12 * * * 2027'])('flags unsupported extra-field dialect %s',input=>{const result=analyzeCron(input);expect(result.status).toBe('unsupported');expect(result.evidence.map(item=>item.signal)).toContain('unsupported-cron-dialect');expect(result.notChecked.join(' ')).toContain('not supported')});
  it('preserves a legitimate five-field expression with a command',()=>{const result=analyzeCron('0 2 * * * /usr/local/bin/backup --quiet');expect(result.status).toBe('valid-with-notes');expect(result.findings.join(' ')).toContain('/usr/local/bin/backup --quiet')});
  it('continues to reject Jenkins H and timezone directives',()=>{expect(analyzeCron('H * * * *').status).toBe('invalid');expect(analyzeCron('TZ=UTC\n0 * * * *').status).toBe('invalid')});
  it.each(['60 * * * *','* 24 * * *','* * 0 * *','* * * 13 *','* * * * 7','*/0 * * * *'])('rejects invalid expression %s',input=>expect(analyzeCron(input).status).toBe('invalid'));
  it('treats comments truthfully',()=>expect(analyzeCron('# comment').status).toBe('unsupported'));
});
