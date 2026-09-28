import * as z from 'zod/mini';

// The Network Information API is Chromium-only and untyped: parsed, not trusted.
const dataSaverSchema = z.object({ connection: z.object({ saveData: z.boolean() }) });

// Whether the visitor asked their browser to save data: the WebGL scenes then stay off.
export function isDataSaved(): boolean {
  const result = dataSaverSchema.safeParse(navigator);
  return result.success && result.data.connection.saveData;
}
