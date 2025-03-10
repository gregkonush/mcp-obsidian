import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { API_BASE_URL, TOKEN } from './config'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'

export const searchSimple = async (
  args: { query: string; contextLength: number },
  _extra: RequestHandlerExtra,
): Promise<CallToolResult> => {
  const { query, contextLength } = args

  // Build URL with query parameters
  const url = new URL(`${API_BASE_URL}/search/simple`)
  url.searchParams.append('query', query)
  if (contextLength !== undefined) {
    url.searchParams.append('contextLength', contextLength.toString())
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  if (!response.ok) {
    const errorStatus = response.status
    let errorMessage = `Search failed with status: ${errorStatus}`
    try {
      const errorData = await response.text()
      if (errorData) {
        errorMessage += ` - ${errorData}`
      }
    } catch (e) {
      // Unable to parse error response
    }

    return {
      content: [{ type: 'text', text: errorMessage }],
    }
  }

  try {
    const data = await response.json()

    // Validate the response has the expected structure
    if (!Array.isArray(data)) {
      return {
        content: [{ type: 'text', text: 'Unexpected response format: not an array' }],
      }
    }

    // Return the JSON response
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    }
  } catch (error) {
    return {
      content: [
        { type: 'text', text: `Error parsing response: ${error instanceof Error ? error.message : String(error)}` },
      ],
    }
  }
}
