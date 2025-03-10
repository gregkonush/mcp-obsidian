import { API_BASE_URL, TOKEN } from './config'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export const openFile = async (args: { filename: string }, _extra: RequestHandlerExtra): Promise<CallToolResult> => {
  const { filename } = args
  const response = await fetch(`${API_BASE_URL}/open/${filename}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  if (!response.ok) {
    return {
      content: [{ type: 'text', text: 'Failed to open file' }],
    }
  }

  return {
    content: [{ type: 'text', text: 'File opened successfully' }],
  }
}
