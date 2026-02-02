import {
	get,
	useFormContext,
	type FieldValues,
	type Path,
} from "react-hook-form";

export interface InputFieldProps<
	T extends FieldValues,
> extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	name: Path<T>;
}

export function InputField<T extends FieldValues>({
	label = "",
	name,
	...inputAttributes
}: InputFieldProps<T>) {
	const { register, formState } = useFormContext<T>();

	const error = get(formState.errors, name);
	const errorMessage =
		typeof error?.message === "string" ? error.message : null;

	return (
		<label>
			{label}
			<input {...register(name)} {...inputAttributes} />
			{!!errorMessage && <p>{errorMessage}</p>}
		</label>
	);
}
