export function unsupported(summary='The input does not match the selected supported evidence format.', details={}) {
  return buildEvidenceResult({ status:'unsupported', title:'Evidence format not recognized', summary, recognition:{status:'unsupported',...details}, unknowns:['The source and meaning of this text were not established.'], nextChecks:['Choose the known source or paste output from a recommended evidence command.'] });
}
export function invalid(summary) {
  return buildEvidenceResult({ status:'invalid', title:'Evidence input could not be interpreted', summary, recognition:{status:'malformed'}, unknowns:['No technical conclusion was drawn from this input.'], nextChecks:['Paste a smaller focused section from one supported command.'] });
}
export function buildEvidenceResult({status='recognized',parserId=null,title='Evidence recognized',summary='',recognition={},observations=[],interpretations=[],unknowns=[],nextChecks=[],relatedJourneyId=null,formatted='',actions=[]}) {
  const normalizedInterpretations = interpretations.map(item => typeof item === 'string' ? {message:item} : item);
  const observationEvidence = observations.map(item => ({signal:item.label || 'observation',source:'parsed evidence',excerpt:String(item.value ?? '')}));
  return {
    status,
    kind: parserId ? `evidence:${parserId}` : 'evidence',
    parserId,
    title,
    summary,
    recognition:{status:recognition.status || status, ...recognition},
    observations,
    interpretations:normalizedInterpretations,
    unknowns,
    nextChecks,
    relatedJourneyId,
    formatted,
    evidence:observationEvidence,
    findings:normalizedInterpretations.map(item=>item.message),
    actions,
    checked:observations.map(item=>item.label),
    notChecked:unknowns,
    nextActions:nextChecks
  };
}
