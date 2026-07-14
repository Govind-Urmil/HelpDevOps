export const site = {
  name: 'HelpDevOps',
  url: 'https://helpdevops.example',
  version: '0.13.0',
  ep: 'EP-013',
  description: 'A privacy-first DevOps problem-solving workspace with deterministic tools and reviewed diagnostic journeys.'
};

export const navigation = [
  { label: 'Troubleshoot', href: '/troubleshoot/' },
  { label: 'Interpret', href: '/interpret/' },
  { label: 'Tools', href: '/tools/' },
  { label: 'References', href: '/reference/' },
  { label: 'Workspace', href: '/workspace/' },
  { label: 'Incident Brief', href: '/incident-brief/' },
  { label: 'Preflight', href: '/preflight/', status: 'In development' }
];

export const isCurrentRoute = (pathname, href) => pathname === href || (href !== '/' && pathname.startsWith(href));
