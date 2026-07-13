export const site = {
  name: 'HelpDevOps',
  url: 'https://helpdevops.example',
  version: '0.6.0',
  ep: 'EP-006',
  description: 'A privacy-first DevOps problem-solving workspace with deterministic container and Kubernetes engineering tools.'
};

export const navigation = [
  { label: 'Tools', href: '/tools/' },
  { label: 'Workspace', href: '/workspace/' },
  { label: 'Preflight', href: '/preflight/', status: 'In development' },
  { label: 'Guides', href: '/guides/' },
  { label: 'References', href: '/references/' }
];

export const isCurrentRoute = (pathname, href) => pathname === href || (href !== '/' && pathname.startsWith(href));
