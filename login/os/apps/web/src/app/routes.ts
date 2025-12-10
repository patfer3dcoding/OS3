// Checking duplicates
// The error was "same route path .../logout/page.jsx"
// It seems `import.meta.glob` might be registering things, OR `react-router` automatically scans `appDirectory`.
// If `routes.ts` exists, it usually overrides auto-routing if configured?
// Actually if `react-router.config.ts` has `appDirectory`, it scans it.
// If we provide `routes.ts`, we are manually defining.
// The issue might be that `buildRouteTree` is scanning `src/app` AND we are adding `src/app` again?
// `__dirname` is `src/app`.
// `tree` scans `src/app`.
// This seems correct for manual definition.

// Hypoyhesis: `logout/page.jsx` is found by `buildRouteTree` AND maybe `logout/route.js`?
// Let's ensure we prefer one.
import { readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	type RouteConfigEntry,
	index,
	route,
} from '@react-router/dev/routes';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

type Tree = {
	path: string;
	children: Tree[];
	hasPage: boolean;
	componentFile?: string;
	isParam: boolean;
	paramName: string;
	isCatchAll: boolean;
	fullPath: string;
};

function buildRouteTree(dir: string, basePath = ''): Tree {
	const files = readdirSync(dir);
	const node: Tree = {
		path: basePath,
		children: [],
		hasPage: false,
		isParam: false,
		isCatchAll: false,
		paramName: '',
		fullPath: dir,
	};

	// Check if the current directory name indicates a parameter
	const dirName = basePath.split('/').pop();
	if (dirName?.startsWith('[') && dirName.endsWith(']')) {
		node.isParam = true;
		const paramName = dirName.slice(1, -1);

		// Check if it's a catch-all parameter (e.g., [...ids])
		if (paramName.startsWith('...')) {
			node.isCatchAll = true;
			node.paramName = paramName.slice(3); // Remove the '...' prefix
		} else {
			node.paramName = paramName;
		}
	}

	for (const file of files) {
		const filePath = join(dir, file);
		const stat = statSync(filePath);

		if (stat.isDirectory()) {
			const childPath = basePath ? `${basePath}/${file}` : file;
			const childNode = buildRouteTree(filePath, childPath);
			node.children.push(childNode);
		} else if (file === 'page.jsx' || file === 'route.js' || file === 'route.ts') {
			node.hasPage = true;
			node.componentFile = file;
		}
	}

	return node;
}

function generateRoutes(node: Tree): RouteConfigEntry[] {
	const routes: RouteConfigEntry[] = [];

	if (node.hasPage && node.componentFile) {
		const fullFilePath = join(node.fullPath, node.componentFile);
		// Calculate relative path from src/app (__dirname) to the component file
		// Windows paths might use backslashes, replace them for import specifiers
		let relPath = relative(__dirname, fullFilePath).replaceAll('\\', '/');
		if (!relPath.startsWith('.')) {
			relPath = `./${relPath}`;
		}
		const componentPath = relPath;

		if (node.path === '') {
			routes.push(index(componentPath));
		} else {
			// Handle parameter routes
			let routePath = node.path;

			// Replace all parameter segments in the path
			const segments = routePath.split('/');
			const processedSegments = segments.map((segment) => {
				if (segment.startsWith('[') && segment.endsWith(']')) {
					const paramName = segment.slice(1, -1);

					// Handle catch-all parameters (e.g., [...ids] becomes *)
					if (paramName.startsWith('...')) {
						return '*'; // React Router's catch-all syntax
					}
					// Handle optional parameters (e.g., [[id]] becomes :id?)
					if (paramName.startsWith('[') && paramName.endsWith(']')) {
						return `:${paramName.slice(1, -1)}?`;
					}
					// Handle regular parameters (e.g., [id] becomes :id)
					return `:${paramName}`;
				}
				return segment;
			});

			routePath = processedSegments.join('/');
			routes.push(route(routePath, componentPath));
		}
	}

	for (const child of node.children) {
		routes.push(...generateRoutes(child));
	}

	// Filter duplicates: keep last one
	const uniqueRoutes = new Map();
	routes.forEach(r => {
		// Assume 'path' or 'index' is the key
		const key = r.path || (r.index ? 'index' : '');
		uniqueRoutes.set(key, r);
	});
	return Array.from(uniqueRoutes.values());
}
// Ensure these globs are included for the build to pick up dependencies if needed, 
// though manual import generation below should handle route registration.
// Vite's build process might need these to know about the existence of the files if they are dynamic imports.
import.meta.glob('./**/{page.jsx,route.js,route.ts}', { eager: true });
import.meta.glob('../api/**/{page.jsx,route.js,route.ts}', { eager: true });

if (import.meta.env.DEV) {
	if (import.meta.hot) {
		import.meta.hot.accept((newSelf) => {
			import.meta.hot?.invalidate();
		});
	}
}
const tree = buildRouteTree(__dirname);
const apiTree = buildRouteTree(resolve(__dirname, '../api'), 'api');

const notFound = route('*?', './__create/not-found.tsx');
const routes = [
	...generateRoutes(tree),
	...generateRoutes(apiTree),
	notFound
];

export default routes;
