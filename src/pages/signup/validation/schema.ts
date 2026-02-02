import { errorMessages } from "@/shared/lib/forms";
import * as yup from "yup";

export const schema = yup.object({
	fullname: yup.string().notRequired(),

	nickname: yup
		.string()
		.required(errorMessages.required)
		.min(3, errorMessages.minLength("Nickname", 3))
		.max(10, errorMessages.maxLength("Nickname", 10)),

	email: yup
		.string()
		.email(errorMessages.invalid("Email"))
		.required(errorMessages.required),

	password: yup
		.string()
		.required(errorMessages.required)
		.min(8, errorMessages.minLength("Password", 8))
		.max(64, errorMessages.maxLength("Password", 64)),

	repeatPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required(errorMessages.required),
});
