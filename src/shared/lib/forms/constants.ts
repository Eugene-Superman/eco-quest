export const errorMessages = {
	required: "This field is required",
	minLength: (fieldName: string, min: number) =>
		`${fieldName} must be at least ${min} characters`,
	maxLength: (fieldName: string, max: number) =>
		`${fieldName} must be at most ${max} characters`,
	invalid: (fieldName: string) => `${fieldName} is not valid`,
};
