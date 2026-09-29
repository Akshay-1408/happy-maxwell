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
  studentName: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(12).max(22).optional().nullable(),
  currentClass: z.string().default('10th'),
  board: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  percentageObtained: z.number().min(0).max(100).optional().nullable(),
  isPercentageExpected: z.boolean().default(false),
  mathMarks: z.number().min(0).max(100).optional().nullable(),
  scienceMarks: z.number().min(0).max(100).optional().nullable(),
  englishMarks: z.number().min(0).max(100).optional().nullable(),
  socialMarks: z.number().min(0).max(100).optional().nullable(),
  strongSubjects: z.array(z.string()).default([]),
  enjoyedSubjects: z.array(z.string()).default([]),
  dislikedSubjects: z.array(z.string()).default([]),
  hobbies: z.array(z.string()).default([]),
  learningStyle: z.string().optional().nullable(),
  workEnvironment: z.string().optional().nullable(),
  preferredStudyLocation: z.string().optional().nullable(),
  budgetPreference: z.string().optional().nullable(),
  govtPrivatePref: z.string().optional().nullable(),
  targetCity: z.string().optional().nullable(),
  wantsHigherEducation: z.boolean().default(true),
  careerInterests: z.array(z.string()).default([]),
})

export const AssessmentResponseSchema = z.object({
  assessmentId: z.string(),
  responses: z.array(
    z.object({
      questionId: z.string(),
      answerValue: z.string(),
    })
  ),
})

export const StudentGoalSchema = z.object({
  title: z.string().min(2, 'Goal title required'),
  timeframe: z.enum(['30_DAYS', '3_MONTHS', '6_MONTHS', '1_YEAR']).default('30_DAYS'),
  category: z.enum(['ACADEMIC', 'EXPLORATION', 'APPLICATION', 'SKILL']).default('ACADEMIC'),
  completed: z.boolean().default(false),
  dueDate: z.string().optional().nullable(),
})

export const SaveItemSchema = z.object({
  itemId: z.string().min(1, 'Item ID required'),
  type: z.enum(['career', 'college']),
  action: z.enum(['save', 'remove']).default('save'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type StudentProfileInput = z.infer<typeof StudentProfileSchema>
export type AssessmentResponseInput = z.infer<typeof AssessmentResponseSchema>
export type StudentGoalInput = z.infer<typeof StudentGoalSchema>
export type SaveItemInput = z.infer<typeof SaveItemSchema>
