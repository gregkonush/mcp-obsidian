import { API_BASE_URL, TOKEN } from './config'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

type InsertArgs = {
  Operation: 'append' | 'prepend' | 'replace'
  TargetType: 'heading' | 'block' | 'frontmatter'
  Target: string
  requestBody: string
  'Target-Delimiter'?: string
  'Trim-Target-Whitespace'?: 'true' | 'false'
  'Content-Type'?: 'text/plain' | 'application/json' | 'text/markdown'
  'Create-Target-If-Missing'?: 'true' | 'false'
}

export const insertActiveFile = async (args: InsertArgs, _extra: RequestHandlerExtra): Promise<CallToolResult> => {
  const {
    Operation,
    TargetType,
    Target,
    requestBody,
    'Target-Delimiter': targetDelimiter = '::',
    'Trim-Target-Whitespace': trimTargetWhitespace = 'false',
    'Content-Type': contentType = 'text/markdown',
    'Create-Target-If-Missing': createTargetIfMissing,
  } = args

  // Ensure requestBody is not undefined
  if (!requestBody) {
    return {
      content: [
        {
          type: 'text',
          text: 'Error: requestBody is required and cannot be empty',
        },
      ],
    }
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${TOKEN}`,
      Operation,
      'Target-Type': TargetType,
      Target,
      'Content-Type': contentType,
    }

    if (targetDelimiter !== '::') {
      headers['Target-Delimiter'] = targetDelimiter
    }

    if (trimTargetWhitespace !== 'false') {
      headers['Trim-Target-Whitespace'] = trimTargetWhitespace
    }

    if (createTargetIfMissing) {
      headers['Create-Target-If-Missing'] = createTargetIfMissing
    }

    const response = await fetch(`${API_BASE_URL}/active`, {
      method: 'PATCH',
      headers,
      body: requestBody,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update active file. Status: ${response.status}. ${errorText}`,
          },
        ],
      }
    }

    return {
      content: [{ type: 'text', text: 'Active file updated successfully' }],
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: [
        {
          type: 'text',
          text: `Error in insertActiveFile: ${errorMessage}`,
        },
      ],
    }
  }
}
