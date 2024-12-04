import z from "zod";

const userCreden = z.object({
  firstName: z.string().min(1),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginCreden = z.object({
  email: z.string().email(),
  password: z.string(),
});

const urlDetail = z.object({
  url: z.string().url(),
  customised_url_name: z
    .string()
    .min(5, {
      message: "this should be deleted",
    })
    .max(50, {
      message: "customUID should have max 50 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, "Custom UID can only contain letters and numbers.")
    .or(z.literal(""))
    .optional(),
});

const updatePageDetail= z.object({
  password: z
  .string()
  .min(5, {
    message: "password should have min 5 characters",
  })
  .optional()
  .or(z.literal("")),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).optional(),
  pageUID: z.string()
})

const pageDetail = z.object({
  customUID: z
    .string()
    .min(1, {
      message: "customUID should have min 1 character",
    })
    .max(50, {
      message: "customUID should have max 50 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, "Custom UID can only contain letters and numbers.")
    .optional()
    .or(z.literal("")),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  password: z
    .string()
    .min(5, {
      message: "password should have min 5 characters",
    })
    .optional()
    .or(z.literal("")),
});

type userCredenType = z.infer<typeof userCreden>;
type loginCredenType = z.infer<typeof loginCreden>;
type urlDetailType = z.infer<typeof urlDetail>;
type pageDetailType = z.infer<typeof pageDetail>;
type updatePageDetailType= z.infer<typeof updatePageDetail>;

export {
  userCreden,
  loginCreden,
  urlDetail,
  pageDetail,
  updatePageDetail,
  userCredenType,
  loginCredenType,
  urlDetailType,
  pageDetailType,
  updatePageDetailType
};
