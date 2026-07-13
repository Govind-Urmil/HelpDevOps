export const createEvidence = ({ signal, source, excerpt, location }) => ({ signal, source, excerpt, ...(location ? {location} : {}) });

export const createDetection = ({ kind, status='recognized', evidence = [], limitations = [] }) => ({
  kind, status, evidence, limitations, deterministic: true
});

export const createDecision = ({ recommended, alternatives = [], reason, nextAction }) => ({
  recommended, alternatives, reason, nextAction
});

export const createResult = ({
  status='recognized',kind='unknown',title='Analysis result',summary='',evidence=[],findings=[],
  actions=[],alternatives=[],checked=[],notChecked=[],nextActions=[],related=[]
}) => ({status,kind,title,summary,evidence,findings,actions,alternatives,coverage:{checked,notChecked},nextActions,related});

export const createSessionItem = ({ id, label, capability, createdAt, inputPolicy = 'memory-only' }) => ({
  id, label, capability, createdAt, inputPolicy
});

export const createSendToAction = ({ targetId, label, accepts, preservesInput = true }) => ({
  targetId, label, accepts, preservesInput
});
