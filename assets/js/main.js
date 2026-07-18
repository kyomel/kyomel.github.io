/**
 * Interactive Terminal Portfolio
 * Michael Stevan Lapandio
 * Mobile-first shell · classic phosphor UX
 */
(() => {
	const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	let reduceMotion = motionQuery.matches;

	const USER = "guest";
	const HOST = "kyomel";
	const isCoarse =
		window.matchMedia("(pointer: coarse)").matches ||
		window.matchMedia("(max-width: 720px)").matches;

	/* ---------- DOM ---------- */
	const root = document.documentElement;
	const app = document.getElementById("terminal-app");
	const outputEl = document.getElementById("terminal-output");
	const form = document.getElementById("shell-form");
	const input = document.getElementById("shell-input");
	const themeToggle = document.getElementById("theme-toggle");
	const themeLabel = document.querySelector("[data-theme-label]");
	const scanlineToggle = document.getElementById("scanline-toggle");
	const clearBtn = document.getElementById("clear-btn");
	const bootScreen = document.getElementById("boot-screen");
	const bootLog = document.getElementById("boot-log");
	const bootSkip = document.getElementById("boot-skip");
	const histPrev = document.getElementById("hist-prev");
	const histNext = document.getElementById("hist-next");
	const mobClear = document.getElementById("mob-clear");

	/* ---------- State ---------- */
	const history = [];
	let historyIndex = -1;
	let draft = "";
	let busy = false;
	let bootAbort = null;
	let typeAbort = null;

	/* ---------- Data ---------- */
	const BANNER = [
		" _                                    _",
		"| | ___   _  ___  _ __ ___   ___| |",
		"| |/ / | | |/ _ \\| '_ ` _ \\ / _ \\ |",
		"|   <| |_| | (_) | | | | | |  __/ |",
		"|_|\\_\\\\__, |\\___/|_| |_| |_|\\___|_|",
		"      |___/  software engineer",
	];

	const BANNER_MOBILE = [
		" _                                _",
		"| | ___   _  ___  _ __ ___   ___| |",
		"| |/ / | | |/ _ \\| '_ ` _ \\ / _ \\ |",
		"|   <| |_| | (_) | | | | | |  __/ |",
		"|_|\\_\\\\__, |\\___/|_| |_| |_|\\___|_|",
		"      |___/  software engineer",
	];

	const PROFILE = {
		name: "Michael Stevan Lapandio",
		role: "Software Engineer",
		born: "13 May 1994",
		email: "michaellapandio04@gmail.com",
		location: "Yogyakarta, Indonesia",
		status: "available for opportunities",
		github: "https://github.com/kyomel",
		linkedin: "https://www.linkedin.com/in/michael-stevan-lapandio/",
		devto: "https://dev.to/kyomel",
		medium: "https://medium.com/@kyomel",
		summary: [
			"Seasoned Software Engineer with 3+ years in ICT.",
			"Front-end & back-end: ReactJS, NodeJS, Golang.",
			"At Xapiens: digital approval process (−70% manual work).",
			"B.Eng. Informatics — Atma Jaya Yogyakarta University.",
			"Stack: Go, Python, Rust · K8s, Docker, SQL.",
			"Outside work: basketball + mentoring.",
		],
	};

	const SKILLS = [
		"JavaScript",
		"HTML/CSS",
		"Go",
		"Node.js",
		"Python",
		"Git",
		"Docker",
		"Kubernetes",
		"SQL",
		"Rust",
		"React",
		"Web3",
	];

	const EXPERIENCE = [
		{
			company: "Xapiens Teknologi Indonesia",
			role: "Software Engineer",
			period: "Jan 2022 — Present",
			loc: "Jakarta, Indonesia",
		},
		{
			company: "Glints Academy",
			role: "Part-Time Product Owner",
			period: "Nov 2020 — Mar 2022",
			loc: "Remote",
		},
		{
			company: "Build App Today Heroes",
			role: "Intern System Analyst",
			period: "Feb 2016 — Jul 2017",
			loc: "Yogyakarta, Indonesia",
		},
	];

	const EDUCATION = [
		{
			school: "Atma Jaya Yogyakarta University",
			role: "B.Eng. Informatics Engineering",
			period: "2016 — 2020",
			loc: "Yogyakarta, Indonesia",
		},
		{
			school: "Glints Academy",
			role: "Full-Stack Web Development Bootcamp",
			period: "2020 — 2021",
			loc: "Remote",
		},
		{
			school: "Professional Certifications",
			role: "Go & Identity Access Engineering",
			period: "Certifications",
			loc: "Online",
		},
	];

	const PROJECTS = [
		{
			name: "sayembara-app",
			type: "backend",
			desc: "Contest management API with auth, submissions, admin dashboard.",
			stack: "Node.js · Express · PostgreSQL · JWT",
			demo: "https://sayembara-ga6.herokuapp.com/",
			code: "https://github.com/kyomel",
		},
		{
			name: "more-projects",
			type: "web",
			desc: "New projects in the pipeline. Follow GitHub for updates.",
			stack: "React · Go · Web3",
			demo: null,
			code: "https://github.com/kyomel",
		},
		{
			name: "ai-web3-wip",
			type: "wip",
			desc: "Exploring AI × Web3. Currently in development.",
			stack: "AI · Web3 · Rust",
			demo: null,
			code: null,
		},
	];

	const COMMANDS = {
		help: "List available commands",
		about: "Who I am",
		whoami: "Short identity line",
		skills: "Tech stack",
		experience: "Work history",
		education: "Education & certs",
		projects: "Featured projects",
		contact: "How to reach me",
		neofetch: "System-style profile card",
		banner: "Show ASCII banner",
		ls: "List pseudo files",
		cat: "Read a file (cat about.txt)",
		theme: "theme [name|list|next] — color themes",
		crt: "crt [on|off|toggle]",
		history: "Command history",
		clear: "Clear the screen",
		date: "Current date/time",
		echo: "Echo arguments",
		pwd: "Print working directory",
		sudo: "Nice try",
		exit: "You can check out any time you like…",
	};

	/* ---------- Theme ---------- */
	const THEMES = {
		dark: { label: "phosphor green", meta: "#020402" },
		light: { label: "paper console", meta: "#f4f1e8" },
		amber: { label: "amber phosphor (VT220)", meta: "#0b0700" },
		dracula: { label: "dracula", meta: "#1e1f29" },
		gruvbox: { label: "gruvbox retro", meta: "#1d2021" },
		nord: { label: "nord arctic", meta: "#242933" },
		solarized: { label: "solarized dark", meta: "#001e26" },
		tokyo: { label: "tokyo night", meta: "#16161e" },
		synthwave: { label: "synthwave '84", meta: "#1d1829" },
	};
	const THEME_ORDER = Object.keys(THEMES);

	function getStored(key) {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	}

	function setStored(key, value) {
		try {
			localStorage.setItem(key, value);
		} catch {
			/* ignore */
		}
	}

	function updateThemeColor(theme) {
		const metas = document.querySelectorAll('meta[name="theme-color"]');
		const color = (THEMES[theme] || THEMES.dark).meta;
		metas.forEach((m) => m.setAttribute("content", color));
	}

	function applyTheme(theme, flash) {
		if (!THEMES[theme]) theme = "dark";
		root.setAttribute("data-theme", theme);
		if (themeLabel) themeLabel.textContent = theme;
		if (themeToggle) {
			themeToggle.setAttribute(
				"aria-label",
				`Theme: ${THEMES[theme].label}. Click for next theme.`,
			);
		}
		updateThemeColor(theme);
		if (flash && app && !reduceMotion) {
			app.classList.remove("theme-flash");
			void app.offsetWidth;
			app.classList.add("theme-flash");
		}
	}

	function initTheme() {
		const stored = getStored("portfolio-theme");
		if (stored && THEMES[stored]) {
			applyTheme(stored, false);
			return;
		}
		const prefersLight = window.matchMedia(
			"(prefers-color-scheme: light)",
		).matches;
		applyTheme(prefersLight ? "light" : "dark", false);
	}

	function setTheme(theme) {
		applyTheme(theme, true);
		setStored("portfolio-theme", theme);
	}

	function toggleTheme() {
		const current = root.getAttribute("data-theme") || "dark";
		const next =
			THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
		setTheme(next);
		return next;
	}

	/* ---------- CRT ---------- */
	function setCrt(on) {
		if (!app) return;
		app.classList.toggle("crt-off", !on);
		if (scanlineToggle) {
			scanlineToggle.setAttribute("aria-pressed", on ? "true" : "false");
		}
		setStored("portfolio-crt", on ? "on" : "off");
	}

	function initCrt() {
		setCrt(getStored("portfolio-crt") !== "off");
	}

	function toggleCrt() {
		const on = app && !app.classList.contains("crt-off");
		setCrt(!on);
		return !on;
	}

	/* ---------- Visual viewport (keyboard) ---------- */
	function updateViewportHeight() {
		const h = window.visualViewport
			? window.visualViewport.height
			: window.innerHeight;
		root.style.setProperty("--vvh", `${h}px`);
	}

	function initViewport() {
		updateViewportHeight();
		if (window.visualViewport) {
			window.visualViewport.addEventListener("resize", updateViewportHeight);
			window.visualViewport.addEventListener("scroll", updateViewportHeight);
		}
		window.addEventListener("resize", updateViewportHeight);
	}

	/* ---------- Output helpers ---------- */
	function scrollToBottom() {
		if (!outputEl) return;
		outputEl.scrollTop = outputEl.scrollHeight;
	}

	function el(tag, className, html) {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (html != null) node.innerHTML = html;
		return node;
	}

	function animateIn(node) {
		if (!node || reduceMotion) return node;
		node.classList.add("is-enter");
		return node;
	}

	function printLine(text = "", className = "line") {
		const line = el("div", className);
		line.textContent = text;
		animateIn(line);
		outputEl.appendChild(line);
		scrollToBottom();
		return line;
	}

	function printHTML(html, className = "line html") {
		const line = el("div", className, html);
		animateIn(line);
		outputEl.appendChild(line);
		scrollToBottom();
		return line;
	}

	function printBlank() {
		outputEl.appendChild(el("div", "line blank"));
		scrollToBottom();
	}

	function printEcho(cmd) {
		const row = el("div", "echo-line");
		row.innerHTML =
			`<span class="prompt-user">${USER}</span>` +
			`<span class="prompt-at">@</span>` +
			`<span class="prompt-host">${HOST}</span>` +
			`<span class="prompt-path">:~</span>` +
			`<span class="prompt-dollar">$</span>` +
			`<span class="echo-cmd"></span>`;
		row.querySelector(".echo-cmd").textContent = cmd;
		animateIn(row);
		outputEl.appendChild(row);
		scrollToBottom();
	}

	function printBanner() {
		const pre = el("pre", "ascii-art");
		const lines = window.innerWidth < 480 ? BANNER_MOBILE : BANNER;
		pre.textContent = lines.join("\n");
		animateIn(pre);
		outputEl.appendChild(pre);
		scrollToBottom();
	}

	function printKV(rows) {
		rows.forEach(([k, v]) => {
			const row = el("div", "kv");
			row.innerHTML = `<span class="k">${k}</span><span class="v"></span>`;
			row.querySelector(".v").textContent = v;
			animateIn(row);
			outputEl.appendChild(row);
		});
		scrollToBottom();
	}

	function clearScreen() {
		if (typeAbort) typeAbort.abort();
		outputEl.innerHTML = "";
	}

	function sleep(ms, signal) {
		return new Promise((resolve, reject) => {
			const t = setTimeout(resolve, ms);
			if (!signal) return;
			if (signal.aborted) {
				clearTimeout(t);
				reject(new DOMException("Aborted", "AbortError"));
				return;
			}
			signal.addEventListener(
				"abort",
				() => {
					clearTimeout(t);
					reject(new DOMException("Aborted", "AbortError"));
				},
				{ once: true },
			);
		});
	}

	async function typeLine(text, className = "line", speed = 12) {
		if (reduceMotion) {
			printLine(text, className);
			return;
		}

		if (typeAbort) typeAbort.abort();
		typeAbort = new AbortController();
		const { signal } = typeAbort;

		const line = el("div", className);
		const caret = el("span", "typing-caret");
		outputEl.appendChild(line);
		line.appendChild(caret);

		try {
			for (const ch of text) {
				if (signal.aborted) return;
				line.insertBefore(document.createTextNode(ch), caret);
				scrollToBottom();
				await sleep(ch === " " ? speed * 0.6 : speed, signal);
			}
			caret.remove();
		} catch (err) {
			if (err.name !== "AbortError") throw err;
			line.textContent = text;
		}
	}

	/* ---------- Scramble / decode reveal ---------- */
	const SCRAMBLE_GLYPHS = "!<>-_\\/[]{}=+*^?#";

	function printScramble(text, className = "line bright") {
		if (reduceMotion) return printLine(text, className);

		const line = el("div", className);
		outputEl.appendChild(line);
		scrollToBottom();

		const chars = [...text];
		const settle = chars.map(
			(_, i) => 6 + i * 1.6 + Math.random() * 6,
		);
		let frame = 0;

		function tick() {
			if (!line.isConnected) return;
			frame++;
			let out = "";
			let done = true;
			for (let i = 0; i < chars.length; i++) {
				const ch = chars[i];
				if (ch === " " || frame >= settle[i]) {
					out += ch;
					continue;
				}
				done = false;
				out += SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
			}
			line.textContent = out;
			if (!done) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
		return line;
	}

	/* ---------- Commands ---------- */
	function cmdHelp() {
		printLine("Available commands:", "line bright");
		printBlank();
		const grid = el("div", "help-grid");
		Object.entries(COMMANDS).forEach(([name, desc]) => {
			grid.appendChild(el("div", "cmd-name", name));
			grid.appendChild(el("div", "cmd-desc", desc));
		});
		animateIn(grid);
		outputEl.appendChild(grid);
		printBlank();
		printLine(
			isCoarse
				? "Tip: tap command chips above, or use ↑↓ buttons."
				: "Tip: click chips · Tab autocomplete · ↑↓ history · Ctrl+L clear",
			"line muted",
		);
	}

	function cmdAbout() {
		printScramble("// ABOUT");
		printBlank();
		printKV([
			["name", PROFILE.name],
			["role", PROFILE.role],
			["born", PROFILE.born],
			["email", PROFILE.email],
			["loc", PROFILE.location],
			["status", PROFILE.status],
		]);
		printBlank();
		PROFILE.summary.forEach((s) => printLine(s));
	}

	function cmdWhoami() {
		printLine(`${PROFILE.name} — ${PROFILE.role}`);
	}

	function cmdSkills() {
		printScramble("// TECH STACK");
		printBlank();
		const row = el("div", "tag-row");
		SKILLS.forEach((s, i) => {
			const t = el("span", "tag");
			t.textContent = s;
			if (!reduceMotion) {
				t.style.animationDelay = `${i * 30}ms`;
			}
			animateIn(t);
			row.appendChild(t);
		});
		outputEl.appendChild(row);
		scrollToBottom();
	}

	function cmdExperience() {
		printScramble("// EXPERIENCE");
		printBlank();
		EXPERIENCE.forEach((job, i) => {
			const box = el("div", "project-item");
			const prefix = i === EXPERIENCE.length - 1 ? "└──" : "├──";
			box.innerHTML =
				`<div class="name">${prefix} ${job.company}</div>` +
				`<div class="meta">${job.period}</div>` +
				`<div>${job.role}</div>` +
				`<div class="meta">${job.loc}</div>`;
			animateIn(box);
			outputEl.appendChild(box);
		});
		scrollToBottom();
	}

	function cmdEducation() {
		printScramble("// EDUCATION");
		printBlank();
		EDUCATION.forEach((ed, i) => {
			const box = el("div", "project-item");
			const prefix = i === EDUCATION.length - 1 ? "└──" : "├──";
			box.innerHTML =
				`<div class="name">${prefix} ${ed.school}</div>` +
				`<div class="meta">${ed.period}</div>` +
				`<div>${ed.role}</div>` +
				`<div class="meta">${ed.loc}</div>`;
			animateIn(box);
			outputEl.appendChild(box);
		});
		scrollToBottom();
	}

	function cmdProjects() {
		printScramble("// PROJECTS");
		printBlank();
		printLine("total " + PROJECTS.length, "line muted");
		printBlank();
		PROJECTS.forEach((p) => {
			const box = el("div", "project-item");
			const links = [];
			if (p.demo) {
				links.push(
					`<a href="${p.demo}" target="_blank" rel="noopener">[demo]</a>`,
				);
			}
			if (p.code) {
				links.push(
					`<a href="${p.code}" target="_blank" rel="noopener">[github]</a>`,
				);
			}
			box.innerHTML =
				`<div class="name">-rwxr-xr-x  ${p.name}</div>` +
				`<div class="meta">type: ${p.type} · ${p.stack}</div>` +
				`<div>${p.desc}</div>` +
				(links.length
					? `<div class="html">${links.join("  ")}</div>`
					: `<div class="meta">[coming soon]</div>`);
			animateIn(box);
			outputEl.appendChild(box);
		});
		scrollToBottom();
	}

	function cmdContact() {
		printScramble("// CONTACT");
		printBlank();
		printLine("Let's build something together.");
		printBlank();
		printHTML(
			`email     <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>`,
		);
		printLine(`location  ${PROFILE.location}`);
		printHTML(
			`linkedin  <a href="${PROFILE.linkedin}" target="_blank" rel="noopener">${PROFILE.linkedin.replace(
				"https://www.linkedin.com",
				"",
			)}</a>`,
		);
		printHTML(
			`github    <a href="${PROFILE.github}" target="_blank" rel="noopener">github.com/kyomel</a>`,
		);
		printHTML(
			`dev.to    <a href="${PROFILE.devto}" target="_blank" rel="noopener">dev.to/kyomel</a>`,
		);
		printHTML(
			`medium    <a href="${PROFILE.medium}" target="_blank" rel="noopener">medium.com/@kyomel</a>`,
		);
		printBlank();
		printLine("Or run: email", "line muted");
	}

	function cmdNeofetch() {
		const theme = root.getAttribute("data-theme") || "dark";
		const art = [
			"      .--.      ",
			"     |o_o |     ",
			"     |:_/ |     ",
			"    //   \\ \\    ",
			"   (|     | )   ",
			"  /'\\_   _/`\\   ",
			"  \\___)=(___/   ",
		];
		const info = [
			`${USER}@${HOST}`,
			"-----------",
			`Name:     ${PROFILE.name}`,
			`Role:     ${PROFILE.role}`,
			`OS:       PortfolioOS 2.6`,
			`Shell:    portfolio.sh`,
			`Theme:    ${theme}`,
			`CRT:      ${app && !app.classList.contains("crt-off") ? "on" : "off"}`,
			`Loc:      ${PROFILE.location}`,
			`Status:   ${PROFILE.status}`,
			`Uptime:   ${Math.floor(performance.now() / 1000)}s`,
			`Packages: ${Object.keys(COMMANDS).length} cmds`,
		];

		if (window.innerWidth < 420) {
			art.forEach((l) => printLine(l, "line dim"));
			printBlank();
			info.forEach((l) => printLine(l));
			return;
		}

		const rows = Math.max(art.length, info.length);
		for (let i = 0; i < rows; i++) {
			const left = (art[i] || "").padEnd(16, " ");
			const right = info[i] || "";
			printLine(left + right);
		}
	}

	function cmdLs() {
		printLine("drwxr-xr-x  about.txt");
		printLine("drwxr-xr-x  skills.txt");
		printLine("drwxr-xr-x  experience.txt");
		printLine("drwxr-xr-x  education.txt");
		printLine("drwxr-xr-x  projects/");
		printLine("drwxr-xr-x  contact.txt");
		printLine("-rw-r--r--  banner.txt");
		printLine("-rw-r--r--  README.md");
	}

	function cmdCat(args) {
		const file = (args[0] || "").toLowerCase();
		const map = {
			"about.txt": cmdAbout,
			"skills.txt": cmdSkills,
			"experience.txt": cmdExperience,
			"education.txt": cmdEducation,
			"contact.txt": cmdContact,
			"banner.txt": () => printBanner(),
			"readme.md": () => {
				printLine("# kyomel portfolio", "line bright");
				printBlank();
				printLine("Interactive terminal portfolio.");
				printLine("Type `help` to list commands.");
				printLine("Theme: classic phosphor (dark) / paper (light).");
			},
		};
		if (!file) {
			printLine("usage: cat <file>", "line err");
			printLine("try: cat about.txt", "line muted");
			return;
		}
		if (map[file]) {
			map[file]();
			return;
		}
		if (file === "projects" || file === "projects/") {
			cmdProjects();
			return;
		}
		printLine(`cat: ${file}: No such file or directory`, "line err");
	}

	function cmdTheme(args) {
		const arg = (args[0] || "list").toLowerCase();
		const current = root.getAttribute("data-theme") || "dark";
		if (arg === "list" || arg === "") {
			printScramble("// COLOR THEMES");
			printBlank();
			THEME_ORDER.forEach((name) => {
				const marker = name === current ? "●" : "○";
				printLine(`${marker} ${name.padEnd(10)} ${THEMES[name].label}`,
					name === current ? "line ok" : "line",
				);
			});
			printBlank();
			printLine("usage: theme <name> · theme next", "line muted");
			return;
		}
		if (arg === "next" || arg === "toggle") {
			const next = toggleTheme();
			printLine(`theme set to ${next} — ${THEMES[next].label}`, "line ok");
			return;
		}
		if (THEMES[arg]) {
			setTheme(arg);
			printLine(`theme set to ${arg} — ${THEMES[arg].label}`, "line ok");
			return;
		}
		printLine(`unknown theme: ${arg}`, "line err");
		printLine(`available: ${THEME_ORDER.join(", ")}`, "line muted");
	}

	function cmdCrt(args) {
		const arg = (args[0] || "toggle").toLowerCase();
		if (arg === "on") {
			setCrt(true);
			printLine("crt effects: on", "line ok");
			return;
		}
		if (arg === "off") {
			setCrt(false);
			printLine("crt effects: off", "line ok");
			return;
		}
		if (arg === "toggle" || arg === "") {
			const on = toggleCrt();
			printLine(`crt effects: ${on ? "on" : "off"}`, "line ok");
			return;
		}
		printLine("usage: crt [on|off|toggle]", "line err");
	}

	function cmdHistory() {
		if (!history.length) {
			printLine("history is empty", "line muted");
			return;
		}
		history.forEach((h, i) => {
			printLine(`${String(i + 1).padStart(4, " ")}  ${h}`);
		});
	}

	function cmdDate() {
		printLine(new Date().toString());
	}

	function cmdEcho(args) {
		printLine(args.join(" "));
	}

	function cmdPwd() {
		printLine(`/home/${USER}`);
	}

	function cmdSudo(args) {
		if (args.join(" ") === "rm -rf /") {
			printLine(
				"nice try. this is a portfolio, not a production box.",
				"line warn",
			);
			printLine(
				"permission denied: guest is not in the sudoers file.",
				"line err",
			);
			return;
		}
		printLine(
			"guest is not in the sudoers file. This incident will be reported.",
			"line err",
		);
	}

	function cmdExit() {
		printLine("There is no exit. Only Ctrl+L or `clear`.", "line muted");
		printLine("Or close the tab. The shell will wait.", "line muted");
	}

	function cmdEmail() {
		printLine(`opening mailto:${PROFILE.email} ...`, "line ok");
		window.location.href = `mailto:${PROFILE.email}`;
	}

	function suggest(cmd) {
		const keys = Object.keys(COMMANDS);
		let best = null;
		let bestScore = Infinity;
		for (const k of keys) {
			const score = levenshtein(cmd, k);
			if (score < bestScore) {
				bestScore = score;
				best = k;
			}
		}
		if (best && bestScore <= 2) return best;
		return null;
	}

	function levenshtein(a, b) {
		const m = a.length;
		const n = b.length;
		const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
		for (let i = 0; i <= m; i++) dp[i][0] = i;
		for (let j = 0; j <= n; j++) dp[0][j] = j;
		for (let i = 1; i <= m; i++) {
			for (let j = 1; j <= n; j++) {
				const cost = a[i - 1] === b[j - 1] ? 0 : 1;
				dp[i][j] = Math.min(
					dp[i - 1][j] + 1,
					dp[i][j - 1] + 1,
					dp[i - 1][j - 1] + cost,
				);
			}
		}
		return dp[m][n];
	}

	function runCommand(raw) {
		const trimmed = raw.trim();
		if (!trimmed) return;

		printEcho(trimmed);
		history.push(trimmed);
		if (history.length > 80) history.shift();
		historyIndex = history.length;

		const parts = trimmed.split(/\s+/);
		const cmd = parts[0].toLowerCase();
		const args = parts.slice(1);

		switch (cmd) {
			case "help":
			case "?":
			case "man":
				cmdHelp();
				break;
			case "about":
				cmdAbout();
				break;
			case "whoami":
				cmdWhoami();
				break;
			case "skills":
			case "stack":
				cmdSkills();
				break;
			case "experience":
			case "exp":
			case "work":
				cmdExperience();
				break;
			case "education":
			case "edu":
				cmdEducation();
				break;
			case "projects":
			case "project":
			case "portfolio":
				cmdProjects();
				break;
			case "contact":
				cmdContact();
				break;
			case "email":
			case "mail":
				cmdEmail();
				break;
			case "neofetch":
			case "fetch":
				cmdNeofetch();
				break;
			case "banner":
				printBanner();
				break;
			case "ls":
			case "dir":
				cmdLs();
				break;
			case "cat":
			case "less":
			case "more":
				cmdCat(args);
				break;
			case "theme":
				cmdTheme(args);
				break;
			case "crt":
				cmdCrt(args);
				break;
			case "history":
				cmdHistory();
				break;
			case "clear":
			case "cls":
				clearScreen();
				break;
			case "date":
				cmdDate();
				break;
			case "echo":
				cmdEcho(args);
				break;
			case "pwd":
				cmdPwd();
				break;
			case "sudo":
				cmdSudo(args);
				break;
			case "exit":
			case "quit":
			case "logout":
				cmdExit();
				break;
			default: {
				const maybe = suggest(cmd);
				printLine(`command not found: ${cmd}`, "line err");
				if (maybe) printLine(`did you mean: ${maybe}?`, "line warn");
				else printLine("type `help` for available commands", "line muted");
			}
		}

		printBlank();
		// trim very long output on mobile memory
		trimOutput();
	}

	function trimOutput() {
		if (!outputEl) return;
		const max = isCoarse ? 220 : 400;
		while (outputEl.children.length > max) {
			outputEl.removeChild(outputEl.firstChild);
		}
	}

	/* ---------- Welcome ---------- */
	async function printWelcome() {
		printBanner();
		printBlank();
		await typeLine(
			`Welcome to ${HOST}'s portfolio shell.`,
			"line",
			isCoarse ? 8 : 10,
		);
		printLine(`${PROFILE.name} · ${PROFILE.role}`, "line muted");
		printLine(`Location: ${PROFILE.location}`, "line muted");
		printBlank();
		printLine(
			isCoarse
				? "Tap a chip above, or type `help`."
				: "Type `help` to get started — or click a command above.",
			"line hint-line",
		);
		printLine(
			`${THEME_ORDER.length} color themes — run \`theme list\``, 
			"line muted",
		);
		printBlank();
	}

	/* ---------- Boot ---------- */
	const BOOT_LINES = [
		{ text: "KYOMEL BIOS v2.6", delay: 50 },
		{ text: "Copyright (C) 2026 Michael Stevan Lapandio", delay: 25 },
		{ text: "", delay: 20 },
		{
			text: 'Memory check ................ <span class="ok">OK</span>',
			delay: 70,
		},
		{
			text: 'Loading shell ............... <span class="ok">OK</span>',
			delay: 60,
		},
		{
			text: 'Mounting /home/guest ........ <span class="ok">OK</span>',
			delay: 55,
		},
		{
			text: 'CRT driver .................. <span class="ok">OK</span>',
			delay: 55,
		},
		{ text: "", delay: 20 },
		{ text: "SYSTEM READY", delay: 40 },
		{ text: "Starting portfolio.sh ...", delay: 55 },
	];

	function finishBoot() {
		if (!bootScreen) return;
		bootScreen.classList.add("is-done");
		bootScreen.setAttribute("aria-hidden", "true");
		try {
			sessionStorage.setItem("boot-done", "1");
		} catch {
			/* ignore */
		}
		if (app && !reduceMotion) {
			app.classList.add("power-on");
			setTimeout(() => app.classList.remove("power-on"), 600);
		}
	}

	async function runBoot() {
		if (!bootScreen || !bootLog) return;

		if (reduceMotion || sessionStorage.getItem("boot-done") === "1") {
			finishBoot();
			return;
		}

		bootAbort = new AbortController();
		const { signal } = bootAbort;
		bootLog.innerHTML = "";

		try {
			for (const line of BOOT_LINES) {
				if (signal.aborted) break;
				bootLog.innerHTML += line.text + "\n";
				await sleep(
					isCoarse ? Math.max(20, line.delay * 0.7) : line.delay,
					signal,
				);
			}
			if (!signal.aborted) await sleep(220, signal);
		} catch (err) {
			if (err.name !== "AbortError") throw err;
		}
		finishBoot();
	}

	function skipBoot() {
		if (bootAbort) bootAbort.abort();
		finishBoot();
	}

	/* ---------- History helpers ---------- */
	function historyUp() {
		if (!history.length) return;
		if (historyIndex === history.length) draft = input.value;
		historyIndex = Math.max(0, historyIndex - 1);
		input.value = history[historyIndex] || "";
	}

	function historyDown() {
		if (!history.length) return;
		historyIndex = Math.min(history.length, historyIndex + 1);
		input.value =
			historyIndex === history.length ? draft : history[historyIndex] || "";
	}

	/* ---------- Autocomplete ---------- */
	function autocomplete() {
		const value = input.value;
		const parts = value.split(/\s+/);
		if (parts.length > 1) {
			if (parts[0].toLowerCase() === "cat") {
				const files = [
					"about.txt",
					"skills.txt",
					"experience.txt",
					"education.txt",
					"contact.txt",
					"banner.txt",
					"README.md",
					"projects/",
				];
				const partial = parts[1] || "";
				const matches = files.filter((f) =>
					f.toLowerCase().startsWith(partial.toLowerCase()),
				);
				if (matches.length === 1) {
					input.value = parts[0] + " " + matches[0];
				} else if (matches.length > 1) {
					printEcho(value);
					printLine(matches.join("  "), "line muted");
					printBlank();
				}
			}
			return;
		}

		const partial = parts[0] || "";
		const keys = Object.keys(COMMANDS);
		const matches = keys.filter((k) => k.startsWith(partial.toLowerCase()));
		if (matches.length === 1) {
			input.value = matches[0] + " ";
		} else if (matches.length > 1) {
			printEcho(value || " ");
			printLine(matches.join("  "), "line muted");
			printBlank();
		}
	}

	/* ---------- Events ---------- */
	function focusInput(force) {
		if (!input || busy) return;
		// Don't auto-open mobile keyboard unless user initiated
		if (isCoarse && !force) return;
		input.focus({ preventScroll: true });
	}

	function setBusy(state) {
		busy = state;
		if (input) input.disabled = state;
	}

	function onSubmit(e) {
		e.preventDefault();
		if (busy) return;
		const value = input.value;
		input.value = "";
		draft = "";
		historyIndex = history.length;
		runCommand(value);
		// keep keyboard open on mobile after submit
		if (isCoarse) {
			requestAnimationFrame(() => input.focus({ preventScroll: true }));
		} else {
			focusInput(true);
		}
	}

	function onKeyDown(e) {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			historyUp();
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			historyDown();
			return;
		}
		if (e.key === "Tab") {
			e.preventDefault();
			autocomplete();
			return;
		}
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
			e.preventDefault();
			clearScreen();
			return;
		}
	}

	function onGlobalKey(e) {
		if (e.target === input) return;
		if (e.target.matches("input, textarea, button, a")) return;

		if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
			focusInput(true);
			return;
		}

		if (e.key === "t" && !e.metaKey && !e.ctrlKey && !e.altKey) {
			const next = toggleTheme();
			printLine(`theme set to ${next}`, "line ok");
			printBlank();
		}
	}

	function onVisibility() {
		if (!app) return;
		app.classList.toggle("is-hidden", document.hidden);
	}

	/* ---------- Init ---------- */
	async function init() {
		initTheme();
		initCrt();
		initViewport();

		motionQuery.addEventListener("change", (e) => {
			reduceMotion = e.matches;
		});

		document.addEventListener("visibilitychange", onVisibility);

		if (bootSkip) bootSkip.addEventListener("click", skipBoot);
		if (bootScreen) {
			bootScreen.addEventListener("click", (e) => {
				if (e.target === bootSkip) return;
				skipBoot();
			});
			bootScreen.addEventListener("keydown", skipBoot);
		}

		if (themeToggle) {
			themeToggle.addEventListener("click", () => {
				const next = toggleTheme();
				printLine(`theme set to ${next}`, "line ok");
				printBlank();
				focusInput(true);
			});
		}

		if (scanlineToggle) {
			scanlineToggle.addEventListener("click", () => {
				const on = toggleCrt();
				printLine(`crt effects: ${on ? "on" : "off"}`, "line ok");
				printBlank();
				focusInput(true);
			});
		}

		if (clearBtn) {
			clearBtn.addEventListener("click", () => {
				clearScreen();
				focusInput(true);
			});
		}

		if (mobClear) {
			mobClear.addEventListener("click", () => {
				clearScreen();
				focusInput(true);
			});
		}

		if (histPrev) {
			histPrev.addEventListener("click", () => {
				historyUp();
				focusInput(true);
			});
		}

		if (histNext) {
			histNext.addEventListener("click", () => {
				historyDown();
				focusInput(true);
			});
		}

		document.querySelectorAll("[data-cmd]").forEach((btn) => {
			btn.addEventListener("click", () => {
				const cmd = btn.getAttribute("data-cmd");
				if (!cmd) return;
				btn.classList.remove("is-pulse");
				void btn.offsetWidth;
				btn.classList.add("is-pulse");
				runCommand(cmd);
				// don't force keyboard on chip tap — user can tap input
				if (!isCoarse) focusInput(true);
			});
		});

		if (form) form.addEventListener("submit", onSubmit);
		if (input) {
			input.addEventListener("keydown", onKeyDown);
			input.addEventListener("focus", () => {
				requestAnimationFrame(() => {
					input.scrollIntoView({ block: "nearest", behavior: "smooth" });
					scrollToBottom();
				});
			});
		}
		document.addEventListener("keydown", onGlobalKey);

		if (app) {
			app.addEventListener("click", (e) => {
				if (e.target.closest("a, button, input, .term-nav, .mobile-controls"))
					return;
				focusInput(true);
			});
		}

		setBusy(true);
		await runBoot();
		await printWelcome();
		setBusy(false);
		// Desktop: focus input. Mobile: wait for user tap (avoid keyboard pop)
		if (!isCoarse) focusInput(true);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
