import { API_BASE_URL, TOKEN } from './config'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export const deleteActiveFile = async (extra: RequestHandlerExtra): Promise<CallToolResult> => {
  const response = await fetch(`${API_BASE_URL}/active`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  if (!response.ok) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: `Failed to delete active file: ${response.statusText}` }),
        },
      ],
    }
  }

  return {
    content: [{ type: 'text', text: 'Active file deleted successfully' }],
  }
}
