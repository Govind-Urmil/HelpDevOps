import { describe, it, expect } from 'vitest';
import { numericToSymbolic, symbolicToNumeric, analyzePermissions } from '../src/tools/linux-permissions/analyzer.js';
describe('Linux permissions', () => {
  it.each([['0000','---------'],['0644','rw-r--r--'],['0755','rwxr-xr-x'],['0777','rwxrwxrwx'],['4755','rwsr-xr-x'],['4644','rwSr--r--'],['2750','rwxr-s---'],['1766','rwxrw-rwT'],['1777','rwxrwxrwt']])('%s -> %s',(numeric,symbolic)=>expect(numericToSymbolic(numeric).symbolic).toBe(symbolic));
  it.each([['rwxr-xr-x','0755'],['rw-r--r--','0644'],['rwsr-xr-x','4755'],['rwSr--r--','4644'],['rwxrwxrwt','1777'],['rwxrw-rwT','1766']])('%s -> %s',(symbolic,numeric)=>expect(symbolicToNumeric(symbolic).numeric).toBe(numeric));
  it.each(['888','12','rwx','rwxrwxrwq',''])('rejects %s',value=>expect(()=>/^\d+$/.test(value)?numericToSymbolic(value):symbolicToNumeric(value)).toThrow());
  it('normalizes three digits',()=>expect(numericToSymbolic('755').numeric).toBe('0755'));
  it('explains file context',()=>expect(analyzePermissions('644','file').summary).toMatch(/File read/));
  it('explains directory context',()=>expect(analyzePermissions('755','directory').summary).toMatch(/traverses/));
  it.each(['0666','0606','0622','0002','0777'])('warns when the other-write bit is set in %s',mode=>expect(analyzePermissions(mode).cautions.join(' ')).toMatch(/Other users have write permission/));
  it.each(['0644','0604','0620','0755'])('does not issue world-write caution for %s',mode=>expect(analyzePermissions(mode).cautions.join(' ')).not.toMatch(/Other users have write permission/));
  it('preserves special-bit caution and rendering',()=>{const result=analyzePermissions('4755');expect(result.symbolic).toBe('rwsr-xr-x');expect(result.cautions.join(' ')).toMatch(/Special permission bits/)});
  it('keeps warning language contextual',()=>expect(analyzePermissions('0666').cautions.join(' ')).toMatch(/depends on/));
});
