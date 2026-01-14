import z from "zod";
import { zodSafeEmail } from "../../../shared/validators/generic.validator";
import { zodPassword } from "../../../shared/validators/comon.validator";

export const signinDto = z.strictObject({
  email: zodSafeEmail(),
  password: zodPassword(),
});

export type SigninDto = z.infer<typeof signinDto>;
