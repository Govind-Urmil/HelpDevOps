export const createEvidence = ({ signal, source, excerpt }) => ({ signal, source, excerpt });

export const createDetection = ({ kind, evidence = [], limitations = [] }) => ({
  kind, evidence, limitations, deterministic: true
});

export const createDecision = ({ recommended, alternatives = [], reason, nextAction }) => ({
  recommended, alternatives, reason, nextAction
});

export const createResult = ({ summary, reasons = [], actions = [], checked = [], notChecked = [], related = [] }) => ({
  summary, reasons, actions, coverage: { checked, notChecked }, related
});

export const createSessionItem = ({ id, label, capability, createdAt, inputPolicy = 'memory-only' }) => ({
  id, label, capability, createdAt, inputPolicy
});

export const createSendToAction = ({ targetId, label, accepts, preservesInput = true }) => ({
  targetId, label, accepts, preservesInput
});
