import * as Nimiq from '@nimiq/core'

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/block-number' && request.method === 'GET') {
      try {
        const config = new Nimiq.ClientConfiguration()
        config.syncMode('pico')
        const client = await Nimiq.Client.create(config.build())

        const headBlock = await client.getHeadBlock()
        const blockNumber = headBlock ? headBlock.height : 0

        return Response.json({
          blockNumber,
          success: true
        })
      } catch (error) {
        return Response.json({
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        }, { status: 500 })
      }
    }

    return new Response('Not Found', { status: 404 })
  },
} satisfies ExportedHandler<Env>

interface Env {}