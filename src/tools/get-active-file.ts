import { API_BASE_URL, TOKEN } from './config'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export const getActiveFile = async (extra: RequestHandlerExtra): Promise<CallToolResult> => {
  const response = await fetch(`${API_BASE_URL}/active`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.olrapi.note+json',
    },
  })

  if (!response.ok) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: `Failed to fetch active file: ${response.statusText}` }),
        },
      ],
    }
  }

  const text = await response.text()

  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
  }
}
