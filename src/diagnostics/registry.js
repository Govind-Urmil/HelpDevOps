import linuxJourney from './journeys/linux-disk-full/journey.json' with { type: 'json' };
import linuxNodes from './journeys/linux-disk-full/nodes.json' with { type: 'json' };
import linuxExamples from './journeys/linux-disk-full/examples.json' with { type: 'json' };
import linuxReferences from './journeys/linux-disk-full/references.json' with { type: 'json' };
import dockerJourney from './journeys/docker-container-exits/journey.json' with { type: 'json' };
import dockerNodes from './journeys/docker-container-exits/nodes.json' with { type: 'json' };
import dockerExamples from './journeys/docker-container-exits/examples.json' with { type: 'json' };
import dockerReferences from './journeys/docker-container-exits/references.json' with { type: 'json' };
import kubernetesJourney from './journeys/kubernetes-pod-pending/journey.json' with { type: 'json' };
import kubernetesNodes from './journeys/kubernetes-pod-pending/nodes.json' with { type: 'json' };
import kubernetesExamples from './journeys/kubernetes-pod-pending/examples.json' with { type: 'json' };
import kubernetesReferences from './journeys/kubernetes-pod-pending/references.json' with { type: 'json' };

export const diagnosticJourneys = [
  {...linuxJourney,nodes:linuxNodes,examples:linuxExamples,references:linuxReferences,path:`/troubleshoot/${linuxJourney.domain}/${linuxJourney.slug}/`},
  {...dockerJourney,nodes:dockerNodes,examples:dockerExamples,references:dockerReferences,path:`/troubleshoot/${dockerJourney.domain}/${dockerJourney.slug}/`},
  {...kubernetesJourney,nodes:kubernetesNodes,examples:kubernetesExamples,references:kubernetesReferences,path:`/troubleshoot/${kubernetesJourney.domain}/${kubernetesJourney.slug}/`}
];
export const publishedJourneys = diagnosticJourneys.filter(item=>['reviewed','technical-review'].includes(item.status));
export const journeyByPath = path => diagnosticJourneys.find(item=>item.path===path);
export const diagnosticDomains = [...new Set(publishedJourneys.map(item=>item.domain))];
