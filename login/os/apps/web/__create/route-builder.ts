import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

// Helper function to transform file path to Hono route path
function getHonoPath(filePath: string): { name: string; pattern: string }[] {
  // expected filePath format: "../src/api/folder/route.js"
  const prefix = '../src/api';
  let relativePath = filePath;
  if (filePath.startsWith(prefix)) {
    relativePath = filePath.substring(prefix.length);
  } else if (filePath.startsWith('/src/api')) {
    relativePath = filePath.substring('/src/api'.length);
  }

  const parts = relativePath.split('/').filter(Boolean);
  const routeParts = parts.slice(0, -1); // Remove 'route.js'

  if (routeParts.length === 0) {
    return [{ name: 'root', pattern: '' }];
  }

  const transformedParts = routeParts.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (match) {
      const [_, dots, param] = match;
      return dots === '...'
        ? { name: param, pattern: `:${param}{.+}` }
        : { name: param, pattern: `:${param}` };
    }
    return { name: segment, pattern: segment };
  });
  return transformedParts;
}

async function registerRoutes() {
  // Use Vite's glob import to find routes. This works in both dev and production build.
  // We look for route.js files inside src/api
  const modules = import.meta.glob('../src/api/**/route.js', { eager: true });

  const routes = Object.keys(modules).sort((a, b) => {
    // Sort by length DESC
    return b.length - a.length;
  });

  api.routes = [];

  for (const routePath of routes) {
    try {
      const routeModule: any = modules[routePath];

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      for (const method of methods) {
        if (routeModule[method]) {
          const parts = getHonoPath(routePath);
          const honoPath = `/${parts.map(({ pattern }) => pattern).join('/')}`;

          const handler: Handler = async (c) => {
            const params = c.req.param();
            return await routeModule[method](c.req.raw, { params });
          };

          const methodLowercase = method.toLowerCase();
          // @ts-ignore
          if (typeof api[methodLowercase] === 'function') {
            // @ts-ignore
            api[methodLowercase](honoPath, handler);
          }
        }
      }
    } catch (error) {
      console.error(`Error registering route ${routePath}:`, error);
    }
  }
}

// Initial route registration
registerRoutes();

// Hot reload routes in development
if (import.meta.env.DEV) {
  if (import.meta.hot) {
    import.meta.hot.accept((newSelf) => {
      registerRoutes();
    });
  }
}

export { api, API_BASENAME };

