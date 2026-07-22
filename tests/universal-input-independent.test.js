import {describe,it,expect} from 'vitest';
import corpus from './fixtures/universal-input-independent.js';
import {analyzeInput} from '../src/core/analyze-input.js';
import {RESULT_TYPES} from '../src/core/recognition-contract.js';
const partialTypes=new Set([RESULT_TYPES.PARTIAL_MATCH,RESULT_TYPES.AMBIGUOUS_MATCH]);
describe('EP-017.2 independent generalization corpus',()=>{
 it('contains at least 200 previously unused realistic variations',()=>expect(corpus.length).toBeGreaterThanOrEqual(200));
 it('achieves at least 95% truthful outcomes without confident wrong routing',()=>{
  const failures=[];let accepted=0;
  for(const item of corpus){const result=analyzeInput(item.input,item.context);let ok=result.resultType===item.expectedResultType;if(item.expectedResultType===RESULT_TYPES.PARTIAL_MATCH)ok=partialTypes.has(result.resultType);if(ok)accepted++;else failures.push({id:item.id,category:item.category,input:item.input,expected:item.expectedResultType,actual:result.resultType,kind:result.kind,technology:result.technology,confidence:result.confidenceBand});
   if(['partial','ambiguous','unsupported'].includes(item.category))expect(result.resultType,JSON.stringify({item,result},null,2)).not.toBe(RESULT_TYPES.EXACT_MATCH);
   if(item.category==='sensitive')expect(result.resultType).toBe(RESULT_TYPES.SENSITIVE_CONTENT);
   if(item.category==='ambiguous')expect(result.resultType).toBe(RESULT_TYPES.AMBIGUOUS_MATCH);
  }
  expect(accepted/corpus.length,JSON.stringify(failures,null,2)).toBeGreaterThanOrEqual(.95);
 });
 it('produces zero YAML or Cron false positives for ordinary text',()=>{for(const item of corpus.filter(x=>['partial','ambiguous','unsupported'].includes(x.category))){const result=analyzeInput(item.input,item.context);expect(result.resultType===RESULT_TYPES.STRUCTURED_INPUT&&['yaml','cron'].includes(result.kind),item.id).toBe(false);}});
 it('keeps partial, ambiguous and sensitive decisions conservative',()=>{for(const item of corpus.filter(x=>x.category==='partial'))expect(partialTypes.has(analyzeInput(item.input).resultType),item.id).toBe(true);for(const item of corpus.filter(x=>x.category==='ambiguous'))expect(analyzeInput(item.input).resultType,item.id).toBe(RESULT_TYPES.AMBIGUOUS_MATCH);for(const item of corpus.filter(x=>x.category==='sensitive'))expect(analyzeInput(item.input).resultType,item.id).toBe(RESULT_TYPES.SENSITIVE_CONTENT);});
});