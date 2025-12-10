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
	let files: string[] = [];
	try {
		files = readdirSync(dir);
	} catch {
		return {
			path: basePath,
			children: [],
			hasPage: false,
			isParam: false,
			isCatchAll: false,
			paramName: '',
			fullPath: dir,
		};
	}

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

	return routes;
}

// Ensure these globs are included for the build to pick up dependencies if needed
import.meta.glob('./**/{page.jsx,route.js,route.ts}', { eager: true });
import.meta.glob('../api/**/{page.jsx,route.js,route.ts}', { eager: true });

if (import.meta.env.DEV) {
	if (import.meta.hot) {
		import.meta.hot.accept((newSelf) => {
			import.meta.hot?.invalidate();
		});
	}
}

// Manually build both trees. Since routes.ts is present, auto-routing is disabled.
const tree = buildRouteTree(__dirname);
const apiTree = buildRouteTree(resolve(__dirname, '../api'), 'api');

const notFound = route('*?', './__create/not-found.tsx');

// Use a simplified merge strategy: concat, but warn/filter duplicates
const allRoutes = [
	...generateRoutes(tree),
	...generateRoutes(apiTree),
	notFound
];

// Deduplicate by path
const uniqueRoutes = new Map();
allRoutes.forEach(r => {
	// Basic key: r.path (undef for index)
	const key = r.path || (r.index ? 'INDEX' : 'UNKNOWN');
	uniqueRoutes.set(key, r);
});

export default Array.from(uniqueRoutes.values());
