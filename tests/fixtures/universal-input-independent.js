const cases=[];
const add=(category,expected,inputs,context='auto')=>inputs.forEach(input=>cases.push({id:`IV-${String(cases.length+1).padStart(3,'0')}`,category,expectedResultType:expected,input,context}));
const wrap=(value,index)=>[
  `[worker-${index}] ${value}`,
  `2026-07-21T10:${String(index).padStart(2,'0')}:00Z | ${value}`,
  `runtime report\n${value}\ntrace collection complete`,
  `  ${value.toUpperCase()}  `
];
[
 'CrashLoopBackOff','Back-off restarting failed container','kubectl pod reports ImagePullBackOff','pod from kubectl reports ErrImagePull','kubectl pod terminated OOMKilled','0/7 nodes are available','Cannot connect to the Docker daemon','docker daemon socket permission denied','docker bind port is already allocated','fatal: not a git repository','CONFLICT (content): Merge conflict in deploy.yaml','repository is in detached HEAD state','fatal: refusing to merge unrelated histories','You are not currently on a branch','chmod: Operation not permitted','connection refused','command not found','no space left on device','temporary failure in name resolution'
].forEach((value,index)=>add('recognized','EXACT_MATCH',wrap(value,index)));
[
 'permission denied','read-only file system','host is unreachable','operation timed out','certificate signed by unknown authority','upstream returned 503'
].forEach((value,index)=>add('partial','PARTIAL_MATCH',[
 value,`service log says ${value}`,`host-${index}: ${value}`,`failure observed\n${value}`
]));
add('structured','STRUCTURED_INPUT',[
 '{"service":"edge","replicas":3}','{"enabled":true,"targets":["api","db"]}','[1,2,3,5,8]','true','null','42',
 '---\nservice: edge\nreplicas: 3','name: edge\nsettings:\n  retries: 4','items:\n  - api\n  - worker','labels:\n  team: platform\n  tier: backend',
 'pipeline:\n  stages:\n    - build\n    - verify','database:\n  host: db.internal\n  port: 5432','features:\n  audit: true\n  cache: false','servers:\n  - name: one\n  - name: two','limits:\n  cpu: 500m\n  memory: 256Mi',
 'metadata:\n  owner: sre\n  environment: staging','routing:\n  prefix: /api\n  timeout: 30','alerts:\n  threshold: 90\n  window: 5m','logging:\n  level: info\n  format: json','release:\n  version: 17.2\n  channel: preview'
]);
add('malformed','MALFORMED_STRUCTURED_INPUT',[
 '{"service":','{"a":1,}','[1,2,','{"nested":{"value":}}','{"unterminated":"value}',
 '---\nname: edge\n  broken: [','items:\n  - one\n  - [','settings:\n  retries: [1,','metadata:\n  labels:\n    app: [','services:\n  api:\n    image: {'
]);
add('sensitive','SENSITIVE_CONTENT',[
 'AWS_SECRET_ACCESS_KEY=abcdEFGH1234567890','client_secret: super-secret-value-123','Authorization: Bearer abcdefghijklmnopqrstuvwxyz','Bearer eyJhbGciOiJIUzI1NiJ9.payload.signature',
 '-----BEGIN PRIVATE KEY-----\nredacted-material\n-----END PRIVATE KEY-----','github_pat_11AA22BB33CC44DD55EE66','token=ghp_abcdefghijklmnopqrstuvwxyz123456','api_key: sk_live_1234567890abcdef','password=PlatformSecret123!','kind: Secret\napiVersion: v1\ndata:\n  password: YWJj'
]);
add('unsupported','UNSUPPORTED',[
 'Please explain deployment strategy','CrashLoopBackOffice appeared in a report','The word permission is in this sentence','service: api','meeting notes from platform planning','hello world','what is a container','Should we use Kubernetes?','docker is popular','git workflow discussion','terraform module naming ideas','network architecture overview','the operation was successful','nothing failed today','release checklist complete','prose {with braces}','email: admin@example.com','https://example.com/status','version 17.2 is ready','two words','sudo: command not found','chmod documentation','a branch of a tree','the host is friendly','certificate renewal plan','503 is a number','timeout policy proposal','read only documentation','space left in schedule','merge conflict training','ordinary release announcement','incident review agenda','database capacity planning','service ownership spreadsheet','team retrospective notes','the container metaphor','branch office schedule','permission model overview','connection pooling design','filesystem documentation','availability target proposal','error budget policy','observability roadmap','runbook authoring guide','security training material','platform migration plan','deployment window notice','weekly operations summary','network diagram description','log retention proposal','backup policy discussion','certificate inventory','resource quota proposal','access review complete'
]);
add('ambiguous','AMBIGUOUS_MATCH',[
 'CrashLoopBackOff; Cannot connect to the Docker daemon','fatal: not a git repository; CrashLoopBackOff','kubectl pod ImagePullBackOff; docker daemon socket permission denied','OOMKilled; CONFLICT (content): Merge conflict','Cannot connect to the Docker daemon; detached HEAD','Back-off restarting failed container; fatal: not a git repository','kubectl pod ErrImagePull; docker bind port is already allocated','CreateContainerError; Cannot connect to the Docker daemon','0/5 nodes are available; CONFLICT (content): Merge conflict','CrashLoopBackOff; You are not currently on a branch'
]);
for(const item of cases){if(item.category==='recognized'&&/(?:fatal: not a git repository|refusing to merge unrelated histories|not currently on a branch|not currently on any branch|chmod: operation not permitted)/i.test(item.input)){item.category='partial';item.expectedResultType='PARTIAL_MATCH';}}
export default Object.freeze(cases);