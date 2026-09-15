import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const StudentProfileSchema = z.object({
  studentName: z.string().min(2, 'Name required'),
  age: z.number().min(13).max(20).optional(),
  currentClass: z.string().default('10th'),
  board: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  percentageObtained: z.number().min(0).max(100).optional(),
  isPercentageExpected: z.boolean().default(false),
  strongSubjects: z.array(z.string()).default([]),
  enjoyedSubjects: z.array(z.string()).default([]),
  dislikedSubjects: z.array(z.string()).default([]),
  preferredStudyLocation: z.enum(['HOME_STATE', 'ANY_INDIA', 'ABROAD', 'FLEXIBLE']).optional(),
  budgetPreference: z.enum(['GOVERNMENT_ONLY', 'BUDGET_FRIENDLY', 'MODERATE', 'NO_CONSTRAINT']).optional(),
  wantsHigherEducation: z.boolean().optional(),
  careerInterests: z.array(z.string()).default([]),
})

export const AssessmentResponseSchema = z.object({
  assessmentId: z.string(),
  responses: z.array(z.object({
    questionId: z.string(),
    answerValue: z.string(),
  })),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type StudentProfileInput = z.infer<typeof StudentProfileSchema>
export type AssessmentResponseInput = z.infer<typeof AssessmentResponseSchema>
