import { describe, it, expect } from 'vitest';
import { tools, availableTools } from '../src/config/tools.js';
describe('tool registry', () => {
  it('has unique IDs', () => expect(new Set(tools.map((tool) => tool.id)).size).toBe(tools.length));
  it('exposes only implemented tools as available', () => expect(availableTools.map((tool) => tool.id)).toEqual(['cron','structured-data','encoding-hash','ipv4-cidr','linux-permissions','git-reference','dockerfile','docker-compose','kubernetes-manifest']));
  it('has local routes for available tools', () => availableTools.forEach((tool) => expect(tool.path).toMatch(/^\/tools\//)));
});
