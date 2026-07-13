import resources from './resources.json' with { type: 'json' };
const u = (n) => n >>> 0;
export function parseIPv4(text) {
  const parts = text.split('.');
  if (parts.length !== 4) throw new Error('IPv4 requires exactly four octets.');
  if (parts.some((part) => !/^\d+$/.test(part) || (part.length > 1 && part[0] === '0'))) throw new Error('Octets must be unambiguous decimal numbers without leading zeroes.');
  const nums = parts.map(Number);
  if (nums.some((part) => part < 0 || part > 255)) throw new Error('IPv4 octets must be between 0 and 255.');
  return u(nums.reduce((number, part) => number * 256 + part, 0));
}
export const formatIPv4 = (number) => [24, 16, 8, 0].map((shift) => (u(number) >>> shift) & 255).join('.');
export function maskToPrefix(mask) {
  const number = parseIPv4(mask); let seenZero = false, prefix = 0;
  for (let index = 31; index >= 0; index--) { const bit = (number >>> index) & 1; if (!bit) seenZero = true; else { if (seenZero) throw new Error('Subnet mask is not contiguous.'); prefix++; } }
  return prefix;
}
export const specialRanges = resources.ranges.map(({ prefix, name }) => [prefix, name]);
export function calculateIPv4({ cidr, address, prefix, mask }) {
  try {
    let ip, parsedPrefix;
    if (cidr) { const parts = cidr.split('/'); if (parts.length !== 2) throw new Error('CIDR input requires address/prefix.'); ip = parseIPv4(parts[0]); parsedPrefix = Number(parts[1]); }
    else { ip = parseIPv4(address); parsedPrefix = mask ? maskToPrefix(mask) : Number(prefix); }
    if (!Number.isInteger(parsedPrefix) || parsedPrefix < 0 || parsedPrefix > 32) throw new Error('Prefix must be an integer from 0 to 32.');
    const subnetMask = parsedPrefix === 0 ? 0 : u(0xffffffff << (32 - parsedPrefix));
    const network = u(ip & subnetMask), broadcast = u(network | u(~subnetMask)), total = 2 ** (32 - parsedPrefix);
    const classifications = specialRanges.map(([range, name]) => { const [rangeAddress, length] = range.split('/'); const rangeMask = +length === 0 ? 0 : u(0xffffffff << (32 - +length)); return u(ip & rangeMask) === u(parseIPv4(rangeAddress) & rangeMask) ? { prefix: range, name, length: +length } : null; }).filter(Boolean).sort((a, b) => b.length - a.length);
    return { status: 'valid', kind: 'ipv4-cidr', address: formatIPv4(ip), prefix: parsedPrefix, mask: formatIPv4(subnetMask), wildcard: formatIPv4(u(~subnetMask)), network: formatIPv4(network), broadcast: formatIPv4(broadcast), first: parsedPrefix >= 31 ? formatIPv4(network) : formatIPv4(network + 1), last: parsedPrefix >= 31 ? formatIPv4(broadcast) : formatIPv4(broadcast - 1), total, usable: parsedPrefix === 31 ? 'context-dependent (two point-to-point addresses)' : parsedPrefix === 32 ? 'single host route' : Math.max(0, total - 2), binary: [24, 16, 8, 0].map((shift) => ((ip >>> shift) & 255).toString(2).padStart(8, '0')).join('.'), classifications, checked: ['IPv4 syntax', 'Prefix or contiguous mask', 'Unsigned 32-bit subnet arithmetic'], notChecked: ['Reachability, ownership, DNS, geolocation, ports, and cloud rules'] };
  } catch (error) { return { status: 'invalid', kind: 'ipv4-cidr', title: 'IPv4 input is invalid', summary: error.message }; }
}
