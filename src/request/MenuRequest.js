import { z } from "zod";

export const MenuAddRequest = z.object({
  name: z.string().min(1)
});