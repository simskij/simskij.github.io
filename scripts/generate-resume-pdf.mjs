import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('public');
const outputPath = join(root, 'resume.pdf');

if (!existsSync(join(root, 'resume', 'index.html'))) {
  throw new Error('public/resume/index.html was not found. Run Hugo before generating the resume PDF.');
}

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const pathname = decodeURIComponent(url.pathname);
    const relativePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const filePath = normalize(join(root, relativePath));

    if (!filePath.startsWith(`${root}${sep}`)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes.get(extname(filePath)) ?? 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

await new Promise((resolveListen) => {
  server.listen(0, '127.0.0.1', resolveListen);
});

const { port } = server.address();
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/resume/`, { waitUntil: 'networkidle' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    preferCSSPageSize: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    },
  });
} finally {
  await browser.close();
  server.close();
}

console.log(`Generated ${outputPath}`);
