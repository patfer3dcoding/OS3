import { handle } from '@hono/node-server/vercel'
// Actually for Netlify Functions, if using standard Hono
// we often use 'hono/netlify'. But let's check what's available.
// If not installed, we can fall back to standard node adapter if using 'netlify-lambda' or similar.
// But Netlify Functions are AWS Lambda under the hood.

// Using standard Hono Netlify adapter
import { handle } from 'hono/netlify'
import { app } from '../../build/server/index.js'

export default handle(app)
