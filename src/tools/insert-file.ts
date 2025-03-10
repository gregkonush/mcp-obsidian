import { API_BASE_URL, TOKEN } from './config'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

type InsertFileArgs = {
  filename: string
  Operation: 'append' | 'prepend' | 'replace'
  TargetType: 'heading' | 'block' | 'frontmatter'
  Target: string
  requestBody: string
  'Target-Delimiter'?: string
  'Trim-Target-Whitespace'?: 'true' | 'false'
  'Content-Type'?: 'text/plain' | 'application/json' | 'text/markdown'
  'Create-Target-If-Missing'?: 'true' | 'false'
}

export const insertFile = async (args: InsertFileArgs, _extra: RequestHandlerExtra): Promise<CallToolResult> => {
  const {
    filename,
    Operation,
    TargetType,
    Target,
    requestBody,
    'Target-Delimiter': targetDelimiter = '::',
    'Trim-Target-Whitespace': trimTargetWhitespace = 'false',
    'Content-Type': contentType = 'text/plain',
    'Create-Target-If-Missing': createTargetIfMissing,
  } = args

  // URL encode the filename
  const encodedFilename = encodeURIComponent(filename)

  const headers: Record<string, string> = {
    Authorization: `Bearer ${TOKEN}`,
    Operation: Operation,
    'Target-Type': TargetType,
    Target: Target,
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

  const response = await fetch(`${API_BASE_URL}/vault/${encodedFilename}`, {
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
          text: `Failed to update file "${filename}". Status: ${response.status}. ${errorText || 'No additional error details available.'}`,
        },
      ],
    }
  }

  return {
    content: [{ type: 'text', text: `File "${filename}" updated successfully` }],
  }
}
