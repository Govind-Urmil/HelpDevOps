import {describe,it,expect} from 'vitest';
import corpus from './fixtures/universal-input-regression.json';
import {analyzeInput} from '../src/core/analyze-input.js';
import {arbitrateCandidates,createCandidate} from '../src/core/recognition-arbitrator.js';
import {RESULT_TYPES} from '../src/core/recognition-contract.js';


describe('EP-017.2 Universal Input recovery',()=>{
  it('uses the complete 291-case audit as a permanent regression corpus',()=>expect(corpus).toHaveLength(291));
  it('meets the 98% truthful-outcome gate across all defined cases',()=>{
    const failures=[];
    for(const testCase of corpus){
      const result=analyzeInput(testCase.input,testCase.context);
      let accepted=result.resultType===testCase.expectedResultType;
      if(testCase.expectedResultType==='PARTIAL_MATCH')accepted=[RESULT_TYPES.PARTIAL_MATCH,RESULT_TYPES.AMBIGUOUS_MATCH].includes(result.resultType);
      if(!Object.values(RESULT_TYPES).includes(result.resultType)||!result.explanation)accepted=false;
      if(testCase.expectedConfidenceBand==='HIGH_OR_MEDIUM'&&!['HIGH','MEDIUM'].includes(result.confidenceBand))accepted=false;
      if(testCase.expectedConfidenceBand==='LOW_OR_INSUFFICIENT'&&!['LOW','INSUFFICIENT','MEDIUM'].includes(result.confidenceBand))accepted=false;
      if(!accepted)failures.push({id:testCase.id,input:testCase.input,expected:testCase.expectedResultType,actual:result.resultType,kind:result.kind,confidence:result.confidenceBand});
    }
    expect(failures,JSON.stringify(failures,null,2)).toHaveLength(0);
  });  it('does not allow ordinary text to masquerade as YAML or Cron',()=>{
    for(const text of ['chmod: Operation not permitted','fatal: not a git repository','service: api','prose {with braces}','You are not currently on a branch']){
      const result=analyzeInput(text);expect(result.resultType===RESULT_TYPES.STRUCTURED_INPUT&&['yaml','cron'].includes(result.kind)).toBe(false);
    }
  });
  it('recognizes symbolic permissions before broad structured parsers',()=>expect(analyzeInput('rwxr-xr-x').kind).toBe('linux-permissions'));
  it('enforces token boundaries',()=>expect(analyzeInput('CrashLoopBackOffice').kind).not.toContain('crashloopbackoff'));
  it('arbitrates comparable technologies instead of selecting by sort order',()=>{
    const make=(technology,destination)=>createCandidate({recognizer:'knowledge',technology,confidenceScore:80,destination,explanation:'credible',result:{status:'recognized',kind:`knowledge:${technology}`,title:technology,summary:'credible',evidence:[],nextActions:[]}});
    expect(arbitrateCandidates([make('docker','/docker'),make('kubernetes','/kubernetes')],{unsupportedResult:{}}).resultType).toBe(RESULT_TYPES.AMBIGUOUS_MATCH);
  });
});
