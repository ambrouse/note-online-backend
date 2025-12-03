import{z} from 'zod'

export const LoginRequest = z.object({
    name: z.string().min(1),
    pass: z.string().min(1)
})