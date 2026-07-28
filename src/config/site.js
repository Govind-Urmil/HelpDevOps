const configuredUrl = import.meta.env.PUBLIC_SITE_URL || 'https://helpdevops.example';

export const site = {
  name: 'HelpDevOps',
  url: configuredUrl.replace(/\/$/, ''),
  version: '0.22.0',
  ep: 'EP-022',
  description: 'A privacy-first DevOps problem-solving workspace with deterministic tools and reviewed diagnostic journeys.'
};

export const navigation = [
  { label: 'Troubleshoot', href: '/troubleshoot/' },
  { label: 'Tools', href: '/tools/' },
  { label: 'Interpret', href: '/interpret/' },
  { label: 'Workspace', href: '/workspace/' }
];

export const isCurrentRoute = (pathname, href) => pathname === href || (href !== '/' && pathname.startsWith(href));

