import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { schema } from "../validation/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField, type InputFieldProps } from "@/shared/lib/forms";

interface IFormInput {
	fullname?: string | null;
	nickname: string;
	email: string;
	password: string;
	repeatPassword: string;
}

const fieldsList: InputFieldProps<IFormInput>[] = [
	{
		label: "Email",
		name: "email",
		type: "email",
		autoComplete: "email",
	},
	{ label: "Nickname", name: "nickname" },
	{ label: "Full Name", name: "fullname" },
	{
		label: "Password",
		name: "password",
		type: "password",
		autoComplete: "new-password",
	},
	{
		label: "Repeat Password",
		name: "repeatPassword",
		type: "password",
	},
];

export default function SignupPage() {
	const methods = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			fullname: "",
			nickname: "",
			email: "",
			password: "",
			repeatPassword: "",
		},
	});
	const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

	return (
		<div>
			<FormProvider {...methods}>
				<h2>Sing Up</h2>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					{fieldsList.map((field) => (
						<InputField key={field.name} {...field} />
					))}
					<button type="submit">Submit</button>
				</form>
			</FormProvider>
		</div>
	);
}
