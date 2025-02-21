import z from "zod";

const urlSchema = z.object({
  id: z.string(),
  uid: z.string(),
  pageId: z.string(),
  description: z.string().nullable(),
  userId: z.string().nullable(),
  url: z.string(),
  visitorCount: z.number(),
  lastVisit: z.coerce.date(),
});

const updatePasswordDetail = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
});

const excelUrlDetail = z.object({
  url: z.array(urlSchema),
  password: z.string().min(6),
  pageUID: z
    .string()
    .min(1, {
      message: "customUID should have min 1 character",
    })
    .max(50, {
      message: "customUID should have max 50 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, "Custom UID can only contain letters and numbers.")
    .optional(),
});

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
      message: "customUID should have min 5 characters",
    })
    .max(50, {
      message: "customUID should have max 50 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, "Custom UID can only contain letters and numbers.")
    .or(z.literal(""))
    .optional(),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .optional(),
  pageUID: z
    .string()
    .min(1, {
      message: "customUID should have min 1 character",
    })
    .max(50, {
      message: "customUID should have max 50 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, "Custom UID can only contain letters and numbers.")
    .optional(),
});

const updatePageDetail = z.object({
  password: z
    .string()
    .min(5, {
      message: "password should have min 5 characters",
    })
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .or(z.literal(""))
    .optional(),
  id: z.string(),
});

const updateUrlDetail = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  id: z.string(),
});

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
type updatePageDetailType = z.infer<typeof updatePageDetail>;
type updateUrlDetailType = z.infer<typeof updateUrlDetail>;
type excelUrlDetailType = z.infer<typeof excelUrlDetail>;
type updatePasswordDetailType = z.infer<typeof updatePasswordDetail>;

export {
  userCreden,
  loginCreden,
  urlDetail,
  pageDetail,
  updatePageDetail,
  updateUrlDetail,
  excelUrlDetail,
  updatePasswordDetail,
  updatePasswordDetailType,
  updateUrlDetailType,
  userCredenType,
  loginCredenType,
  urlDetailType,
  pageDetailType,
  updatePageDetailType,
  excelUrlDetailType,
};
