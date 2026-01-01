#!/usr/bin/env osascript -l JavaScript
ObjC.import("stdlib");
const app = Application.currentApplication();
app.includeStandardAdditions = true;
//──────────────────────────────────────────────────────────────────────────────

/** @param {string} str */
function alfredMatcher(str) {
	const clean = str.replace(/[-_.]/g, " ");
	const camelCaseSeparated = str.replace(/([A-Z])/g, " $1");
	return [clean, camelCaseSeparated, str].join(" ") + " ";
}

/**
 * @param {string} url
 * @param {string[]} header
 * @return {string} response
 */
function httpRequestWithHeaders(url, header) {
	let allHeaders = "";
	for (const line of header) {
		allHeaders += ` -H "${line}"`;
	}
	const curlRequest = `curl --silent --location ${allHeaders} "${url}" || true`;
	console.log(curlRequest);
	return app.doShellScript(curlRequest);
}

/**
 * Fetch multiple URLs in parallel using background curl processes
 * @param {string[]} urls
 * @param {string[]} header
 * @return {string[]} array of response bodies in same order as urls
 */
function httpRequestsInParallel(urls, header) {
	if (urls.length === 0) return [];

	let allHeaders = "";
	for (const line of header) {
		allHeaders += ` -H "${line}"`;
	}

	const tmpDir = app.doShellScript("mktemp -d");

	// Build parallel curl commands that write to numbered files
	const curlCommands = urls
		.map((url, i) => `curl --silent --location ${allHeaders} "${url}" > "${tmpDir}/${i}.json" &`)
		.join("\n");

	// Run all curls in parallel and wait for completion
	const script = `${curlCommands}\nwait`;
	console.log(`Fetching ${urls.length} pages in parallel...`);
	app.doShellScript(script);

	// Read results in order
	const results = urls.map((_, i) => {
		try {
			return app.doShellScript(`cat "${tmpDir}/${i}.json"`);
		} catch (_e) {
			return "[]";
		}
	});

	// Cleanup
	app.doShellScript(`rm -rf "${tmpDir}"`);

	return results;
}

/** @param {number} starcount */
function shortNumber(starcount) {
	const starStr = starcount.toString();
	if (starcount < 2000) return starStr;
	return starStr.slice(0, -3) + "k";
}

function getGithubToken() {
	const tokenShellCmd = $.getenv("github_token_shell_cmd");
	const tokenFromZshenvCmd = "test -e $HOME/.zshenv && source $HOME/.zshenv ; echo $GITHUB_TOKEN";
	let githubToken = $.getenv("github_token_from_alfred_prefs").trim();
	if (!githubToken && tokenShellCmd) {
		githubToken = app.doShellScript(tokenShellCmd + " || true").trim();
		if (!githubToken) console.log("GitHub token shell command failed.");
	}
	if (!githubToken) githubToken = app.doShellScript(tokenFromZshenvCmd);
	return githubToken;
}

//──────────────────────────────────────────────────────────────────────────────

/** @type {AlfredRun} */
// biome-ignore lint/correctness/noUnusedVariables: Alfred run
function run() {
	const githubToken = getGithubToken();
	const includePrivate = $.getenv("include_private_repos") === "1";
	const username = $.getenv("github_username");
	const localRepoFolder = $.getenv("local_repo_folder");
	const cloneDepth = Number.parseInt($.getenv("clone_depth"));
	const useAlfredFrecency = $.getenv("use_alfred_frecency") === "1";
	const only100repos = $.getenv("only_100_recent_repos") === "1";

	// determine local repos
	/** @type {Record<string, {path: string; dirty: boolean|undefined}>} */
	const localRepos = {};
	app.doShellScript(`mkdir -p "${localRepoFolder}"`);
	const localRepoPaths = app
		.doShellScript(`find ${localRepoFolder} -type d -maxdepth 2 -name ".git"`)
		.split("\r");

	for (const gitFolderPath of localRepoPaths) {
		/** @type {{path: string; dirty: boolean|undefined}} */
		const repo = {};
		repo.path = gitFolderPath.replace(/\.git\/?$/, "");
		const name = repo.path.replace(/.*\/(.*)\/$/, "$1");
		try {
			repo.dirty = app.doShellScript(`cd "${repo.path}" && git status --porcelain`) !== "";
		} catch (_error) {
			// error can occur with cloud sync issues
			repo.dirty = undefined;
		}
		localRepos[name] = repo;
	}

	//───────────────────────────────────────────────────────────────────────────
	// FETCH REMOTE REPOS

	// DOCS https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
	let apiUrl = `https://api.github.com/users/${username}/repos?type=all&per_page=100&sort=updated`;
	const headers = ["Accept: application/vnd.github.json", "X-GitHub-Api-Version: 2022-11-28"];
	if (githubToken && includePrivate) {
		// DOCS https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user--parameters
		apiUrl = "https://api.github.com/user/repos?per_page=100&sort=updated";
		headers.push(`Authorization: BEARER ${githubToken}`);
	}

	// Fetch repos - either single page or all pages in parallel
	/** @type {GithubRepo[]} */
	const allRepos = [];

	if (only100repos) {
		// Single page fetch
		const response = httpRequestWithHeaders(apiUrl + "&page=1", headers);
		if (!response) {
			const item = { title: "No response from GitHub. Try again later.", valid: false };
			return JSON.stringify({ items: [item] });
		}
		const repos = JSON.parse(response);
		if (repos.message) {
			const item = {
				title: "GitHub denied request.",
				subtitle: repos.message,
				valid: false,
			};
			return JSON.stringify({ items: [item] });
		}
		console.log(`repos page #1: ${repos.length}`);
		allRepos.push(...repos);
	} else {
		// Get repo count from user API and orgs to determine pages needed
		// DOCS https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28
		const userResponse = httpRequestWithHeaders("https://api.github.com/user", headers);
		const userData = JSON.parse(userResponse || "{}");
		let totalRepos = (userData.public_repos || 0) + (userData.total_private_repos || 0);

		// Get orgs and their repo counts
		// DOCS https://docs.github.com/en/rest/orgs/orgs?apiVersion=2022-11-28
		const orgsResponse = httpRequestWithHeaders("https://api.github.com/user/orgs", headers);
		const orgs = JSON.parse(orgsResponse || "[]");
		if (Array.isArray(orgs) && orgs.length > 0) {
			const orgUrls = orgs.map((org) => `https://api.github.com/orgs/${org.login}`);
			const orgResponses = httpRequestsInParallel(orgUrls, headers);
			for (const orgResponse of orgResponses) {
				try {
					const orgData = JSON.parse(orgResponse || "{}");
					totalRepos += (orgData.public_repos || 0) + (orgData.total_private_repos || 0);
				} catch (_e) {
					// Skip invalid responses
				}
			}
		}

		// This may over-estimate since org counts include all org repos, not just
		// those accessible via /user/repos.
		const estimatedPages = Math.ceil(totalRepos / 100) || 1;
		console.log(`Estimated ${totalRepos} repos across ${estimatedPages} pages`);

		// Fetch all pages in parallel
		const urls = [];
		for (let page = 1; page <= estimatedPages; page++) {
			urls.push(apiUrl + `&page=${page}`);
		}

		const responses = httpRequestsInParallel(urls, headers);
		for (let i = 0; i < responses.length; i++) {
			const response = responses[i];
			if (!response) continue;
			try {
				const repos = JSON.parse(response);
				if (repos.message) {
					if (i === 0) {
						const item = {
							title: "GitHub denied request.",
							subtitle: repos.message,
							valid: false,
						};
						return JSON.stringify({ items: [item] });
					}
					continue;
				}
				console.log(`repos page #${i + 1}: ${repos.length}`);
				allRepos.push(...repos);
			} catch (_e) {
				// Skip invalid JSON responses
			}
		}
	}

	// Create items for Alfred
	const repos = allRepos
		.filter((repo) => !repo.archived) // GitHub API doesn't allow filtering
		.sort((a, b) => {
			// sort local repos to the top
			const aIsLocal = Boolean(localRepos[a.name]);
			const bIsLocal = Boolean(localRepos[b.name]);
			if (aIsLocal && !bIsLocal) return -1;
			if (!aIsLocal && bIsLocal) return 1;
			return 0; // otherwise use sorting from GitHub (updated status)
		})
		.map((repo) => {
			let matcher = repo.name;
			let type = "";
			let subtitle = "";
			const localRepo = localRepos[repo.name];
			const memberRepo = repo.owner.login !== username;
			const mainArg = localRepo?.path || repo.html_url;

			// open in terminal when local, clone when not
			let termAct = "Open in Terminal";
			if (!localRepo) termAct = cloneDepth > 0 ? `Shallow Clone (depth ${cloneDepth})` : "Clone";
			const terminalArg = localRepo?.path || repo.html_url;
			if (localRepo) {
				if (localRepos[repo.name]?.dirty) type += "✴️ ";
				type += "📂 ";
				matcher += "local ";
			}

			// extra info
			if (repo.fork) type += "🍴 ";
			if (repo.fork) matcher += "fork ";
			if (repo.is_template) type += "📄 ";
			if (repo.is_template) matcher += "template ";
			if (repo.private) type += "🔒 ";
			if (repo.private) matcher += "private ";
			if (repo.stargazers_count > 0) subtitle += `⭐ ${shortNumber(repo.stargazers_count)}  `;
			if (repo.open_issues > 0) subtitle += `🟢 ${repo.open_issues}  `;
			if (repo.forks_count > 0) subtitle += `🍴 ${repo.forks_count}  `;
			if (memberRepo) subtitle += `👤 ${repo.owner.login}  `;
			if (memberRepo) matcher += "member " + repo.owner.login + " ";

			/** @type {AlfredItem} */
			const alfredItem = {
				title: `${type}${repo.name}`,
				subtitle: subtitle,
				match: alfredMatcher(matcher),
				arg: mainArg,
				quicklookurl: repo.private ? undefined : mainArg,
				uid: useAlfredFrecency ? repo.full_name : undefined,
				mods: {
					ctrl: { subtitle: "⌃: " + termAct, arg: terminalArg },
					alt: { subtitle: "⌥: Copy GitHub URL", arg: repo.html_url },
					cmd: { subtitle: "⌘: Open at GitHub", arg: repo.html_url },
				},
			};
			return alfredItem;
		});

	return JSON.stringify({
		items: repos,
		// short, since cloned repos should be available immediately
		cache: { seconds: 15, loosereload: true },
	});
}
