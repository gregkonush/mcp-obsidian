import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import { API_BASE_URL, TOKEN } from './config'

export const listFiles = async (args: { directory: string }, _extra: RequestHandlerExtra): Promise<CallToolResult> => {
  const response = await fetch(`${API_BASE_URL}/vault/${args.directory}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  if (!response.ok) {
    const status = response.status
    const statusText = response.statusText
    let errorDetails: string

    try {
      errorDetails = await response.text()
    } catch (e) {
      errorDetails = 'Could not retrieve error details'
    }

    return {
      content: [
        {
          type: 'text',
          text: `Failed to list files: Status ${status} ${statusText}\nRequest Path: /vault/${args.directory}\nDetails: ${errorDetails}`,
        },
      ],
    }
  }

  const text = await response.text()
  return {
    content: [{ type: 'text', text }],
  }
}
