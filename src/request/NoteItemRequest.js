import {z} from 'zod'

export const NoteItemRequest = z.object({
    nameMenu : z.string().min(1),
    title : z.string().min(1),
    contents : z.array(z.any()),
    tag : z.string().min(1),
})