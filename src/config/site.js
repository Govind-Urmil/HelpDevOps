export const site = {
  name: 'HelpDevOps',
  url: 'https://helpdevops.example',
  version: '0.9.0',
  ep: 'EP-009',
  description: 'A privacy-first DevOps problem-solving workspace with deterministic tools and reviewed diagnostic journeys.'
};

export const navigation = [
  { label: 'Tools', href: '/tools/' },
  { label: 'Troubleshoot', href: '/troubleshoot/' },
  { label: 'Interpret', href: '/interpret/' },
  { label: 'Workspace', href: '/workspace/' },
  { label: 'Preflight', href: '/preflight/', status: 'In development' },
  { label: 'Guides', href: '/guides/' },
  { label: 'References', href: '/references/' }
];

export const isCurrentRoute = (pathname, href) => pathname === href || (href !== '/' && pathname.startsWith(href));
