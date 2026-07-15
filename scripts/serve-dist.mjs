import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { gzip } from 'node:zlib';

const root = path.resolve('dist');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const compressible = new Set([
  '.html',
  '.css',
  '.js',
  '.json',
  '.svg',
  '.txt',
  '.xml'
]);

function sendFile(req, res, file, statusCode) {
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal server error');
      return;
    }

    const ext = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Vary': 'Accept-Encoding'
    };

    const acceptsGzip = /\bgzip\b/i.test(req.headers['accept-encoding'] || '');

    if (compressible.has(ext) && acceptsGzip) {
      gzip(data, (gzipError, compressed) => {
        if (gzipError) {
          res.writeHead(statusCode, headers);
          res.end(data);
          return;
        }

        res.writeHead(statusCode, {
          ...headers,
          'Content-Encoding': 'gzip',
          'Content-Length': compressed.length
        });
        res.end(compressed);
      });
      return;
    }

    res.writeHead(statusCode, {
      ...headers,
      'Content-Length': data.length
    });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname
    );

    let file = path.join(root, pathname);

    if (pathname.endsWith('/')) {
      file = path.join(file, 'index.html');
    }

    if (!path.extname(file)) {
      file = path.join(file, 'index.html');
    }

    if (!file.startsWith(root)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    fs.stat(file, (error, stat) => {
      if (!error && stat.isFile()) {
        sendFile(req, res, file, 200);
        return;
      }

      sendFile(req, res, path.join(root, '404.html'), 404);
    });
  })
  .listen(4321, '127.0.0.1', () => {
    console.log('Preview: http://127.0.0.1:4321');
  });
