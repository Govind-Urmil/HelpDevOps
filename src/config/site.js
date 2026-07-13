export const site = {
  name: 'HelpDevOps',
  url: 'https://helpdevops.example',
  version: '0.5.0',
  ep: 'EP-005',
  description: 'A privacy-first DevOps task workspace for tools, guidance, references, and transparent engineering workflows.'
};

export const navigation = [
  { label: 'Tools', href: '/tools/' },
  { label: 'Workspace', href: '/workspace/' },
  { label: 'Preflight', href: '/preflight/', status: 'In development' },
  { label: 'Guides', href: '/guides/' },
  { label: 'References', href: '/references/' }
];

export const isCurrentRoute = (pathname, href) => pathname === href || (href !== '/' && pathname.startsWith(href));
