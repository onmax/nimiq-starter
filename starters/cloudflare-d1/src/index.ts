import { Client } from '@nimiq/core/bundler/worker-wasm'

let clientPromise: Promise<Client> | null = null
let consensusEstablished = false

async function getClient() {
  if (!clientPromise) {
    clientPromise = Client.create({ syncMode: 'pico' })
  }

  const client = await clientPromise

  // Only wait for consensus once per Worker instance
  if (!consensusEstablished) {
    await client.waitForConsensusEstablished()
    consensusEstablished = true
  }

  return client
}

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/' && request.method === 'GET') {
      try {
        const client = await getClient()
        const blockNumber = await client.getHeadHeight()

        return Response.json({
          blockNumber,
          success: true,
        })
      }
      catch (error) {
        return Response.json({
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false,
        }, { status: 500 })
      }
    }

    return new Response('Not Found', { status: 404 })
  },
} satisfies ExportedHandler<Env>

interface Env {}
