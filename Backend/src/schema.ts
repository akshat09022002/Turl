import z from 'zod';

const userCreden= z.object({
    firstName: z.string().min(1),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
})

const loginCreden= z.object({
    email: z.string().email(),
    password: z.string()
})

const urlDetail= z.object({
    url: z.string().url(),
})

const pageDetail= z.object({
    title: z.string(),
    description: z.string(),
    password: z.string().min(6).optional(),
})

type userCredenType= z.infer<typeof userCreden>;
type loginCredenType= z.infer<typeof loginCreden>;
type urlDetailType= z.infer<typeof urlDetail>;
type pageDetailType= z.infer<typeof pageDetail>;

export { userCreden, loginCreden, urlDetail, pageDetail, userCredenType, loginCredenType, urlDetailType, pageDetailType};