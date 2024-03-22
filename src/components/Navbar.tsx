import { SiGithub, SiYoutube } from "react-icons/si"
import { useTheme } from "@/hooks/useTheme"
import { HiMiniMoon, HiMiniSun } from "react-icons/hi2"
import { GiSpellBook } from "react-icons/gi"

export const Navbar = () => {
	return (
		<header className="sticky top-0 z-10 w-full border-b bg-background">
			<div className="flex h-16 items-center px-10 sm:px-16 lg:px-44">
				<div className="mx-auto w-full max-w-3xl space-y-20">
					<div className="flex justify-between">
						<div className="flex flex-1 items-center justify-start">
							<a href="/" className="size-10 p-2 text-primary">
								<GiSpellBook className="size-full" />
							</a>
						</div>

						<div className="flex flex-1 items-center justify-end">
							<nav className="flex items-center space-x-1">
								<ThemeToggle />
								<a
									href="https://www.youtube.com/@1sh1sh"
									className="h-10 w-10 p-2 text-gray-800 hover:text-[#ff0000] dark:text-white dark:hover:text-[#ff0000]"
								>
									<SiYoutube className="h-full w-full" />
								</a>
								<a
									href="https://www.github.com/koreoxy"
									className="h-10 w-10 p-2 text-gray-800 hover:text-[#8400ff] dark:text-white dark:hover:text-[#8400ff]"
								>
									<SiGithub className="h-full w-full" />
								</a>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

const ThemeToggle = () => {
	const { isDarkMode, toogleDarkMode } = useTheme()
	return (
		<button
			onClick={() => toogleDarkMode()}
			className="h-10 w-10 p-2 text-gray-800 hover:text-amber-500 dark:text-white dark:hover:text-amber-400"
		>
			{isDarkMode ? (
				<HiMiniMoon className="h-full w-full" />
			) : (
				<HiMiniSun className="h-full w-full" />
			)}
		</button>
	)
}
