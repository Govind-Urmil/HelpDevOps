import {describe,it,expect} from 'vitest';
import {analyzeDockerfile} from '../src/tools/dockerfile/analyzer.js';
describe('Dockerfile analyzer',()=>{
 it('accepts a reviewed multi-stage image',()=>{const r=analyzeDockerfile('FROM node:22-bookworm AS build\nRUN npm ci\nFROM nginx:1.27-alpine\nUSER 101\nHEALTHCHECK CMD true');expect(r.status).toMatch(/valid/);expect(r.summary).toMatch(/2 stage/)});
 it('requires FROM',()=>expect(analyzeDockerfile('RUN echo hi').status).toBe('invalid'));
 it('warns on latest and root',()=>{const r=analyzeDockerfile('FROM ubuntu:latest\nUSER root');expect(r.findings.join(' ')).toMatch(/latest/);expect(r.findings.join(' ')).toMatch(/root/)});
 it('warns on secret-like ARG',()=>expect(analyzeDockerfile('FROM alpine:3.21\nARG API_TOKEN=demo').findings.join(' ')).toMatch(/secret-like/));
 it('warns on remote ADD',()=>expect(analyzeDockerfile('FROM alpine:3.21\nADD https://example.com/a /a').findings.join(' ')).toMatch(/remote URL ADD/));
 it('handles continuations',()=>expect(analyzeDockerfile('FROM alpine:3.21\nRUN echo one \\\n && echo two').status).not.toBe('invalid'));
 it('rejects unknown instructions',()=>expect(analyzeDockerfile('FROM alpine:3.21\nMAGIC yes').status).toBe('invalid'));
 it('limits large input',()=>expect(analyzeDockerfile('FROM x\n#'+ 'x'.repeat(300000)).status).toBe('unsupported'));
 it('rejects non-ARG instructions before FROM',()=>expect(analyzeDockerfile('RUN echo bad\nFROM alpine:3').status).toBe('invalid'));
});
