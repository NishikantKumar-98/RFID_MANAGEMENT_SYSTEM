import { z } from 'zod';

export const createToolSchema = z.object({
  toolId: z.string().min(1, 'Tool ID is required'),
  name: z.string().min(1, 'Tool name is required'),
  category: z.enum(['Power Tools', 'Hand Tools', 'Measuring Tools', 'Safety Equipment', 'Electrical Tools']),
});

export const issueToolSchema = z.object({
  toolId: z.string().min(1, 'Tool ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const returnToolSchema = z.object({
  toolId: z.string().min(1, 'Tool ID is required'),
});

export const scanSchema = z.object({
  scannedIds: z.array(z.string()).min(1, 'At least one tool ID is required'),
});

export type CreateToolInput = z.infer<typeof createToolSchema>;
export type IssueToolInput = z.infer<typeof issueToolSchema>;
export type ReturnToolInput = z.infer<typeof returnToolSchema>;
export type ScanInput = z.infer<typeof scanSchema>;
