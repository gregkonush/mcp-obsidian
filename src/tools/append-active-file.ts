import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import { API_BASE_URL, TOKEN } from './config'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export const appendActiveFile = async (
  args: { content: string },
  _extra: RequestHandlerExtra,
): Promise<CallToolResult> => {
  const { content } = args
  const response = await fetch(`${API_BASE_URL}/active`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'text/markdown',
    },
    method: 'POST',
    body: content,
  })

  if (!response.ok) {
    return {
      content: [{ type: 'text', text: 'Failed to append to active file' }],
    }
  }

  return {
    content: [{ type: 'text', text: 'Active file updated successfully' }],
  }
}
