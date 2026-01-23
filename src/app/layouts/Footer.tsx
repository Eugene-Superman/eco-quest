import logo from "@/shared/assets/react.svg";

export function Footer() {
	return (
		<footer>
			<img src={logo} alt="Logo" /> {new Date().getFullYear()} Eco Quest
		</footer>
	);
}
