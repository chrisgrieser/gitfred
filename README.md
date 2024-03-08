<!-- LTeX: enabled=false -->
# GitFred
<!-- LTeX: enabled=true -->
![Download count](https://img.shields.io/github/downloads/chrisgrieser/gitfred/total?label=Total%20Downloads&style=plastic)
![version number](https://img.shields.io/github/v/release/chrisgrieser/gitfred?label=Latest%20Release&style=plastic)

Helpful GitHub Assistant for Alfred.

<img alt="Showcase owned repo search" width=70% src="https://github.com/chrisgrieser/gitfred/assets/73286100/c6cf4e32-d20b-4438-b868-4ff64d349c35">

<img alt="Showcase public repo search" width=70% src="https://github.com/chrisgrieser/gitfred/assets/73286100/c73f2245-6e56-45c5-998f-ab5b5f7512e5">

<img alt="Showcase issue search" width=70% src="https://github.com/chrisgrieser/gitfred/assets/73286100/fe15a8a2-e0c4-493f-95ba-f41e3da7e8dc">

## Usage
- Search all public GitHub repositories via the keyword `gh`.
	+ <kbd>⏎</kbd>: Open the repo's GitHub page.
	+ <kbd>⌘⏎</kbd>: Open the repo's homepage. If it has none, opens the
	  releases page instead.
	+ <kbd>⌥⏎</kbd>: Copy the repo URL.
	+ <kbd>⌃⏎</kbd>: Shallow clone the repo to a local folder and open in the
	  Terminal. Optionally, creates a fork on GitHub with the `gh` cli and
	  prepares the repo for a PR.
	+ <kbd>⇧⏎</kbd>: Search the last 100 issues, use <kbd>⏎</kbd> to open the
	  issue in the browser.
- Quick access the repositories you own via `gg`.
	+ <kbd>⏎</kbd>: If the repo is available locally on your device, open it in
	  Finder. Otherwise, open the repo's GitHub page.
	+ <kbd>⌘⏎</kbd>: Open the repo's GitHub page.
	+ <kbd>⌥⏎</kbd>: Copy the repo link.
	+ <kbd>⌃⏎</kbd>: Shallow clone the repo to a local folder and open in the
	  Terminal. If the repo is already locally available on your device, just
	  open the repository in the Terminal. 
	+ <kbd>⇧⏎</kbd>: Search the last 100 issues, use <kbd>⏎</kbd> to open the
	  issue in the browser.
- Open recent GitHub issues you are involved in with `ghi`.
	+ <kbd>⏎</kbd>: Open the issue in the browser.
	+ <kbd>⌥⏎</kbd>: Copy the issue URL.
- Access Pull Requests (PRs) you have opened with the keyword `gpr`.
	+ <kbd>⏎</kbd>: Open the PR in the browser.
	+ <kbd>⌥⏎</kbd>: Copy the link to the PR.
- Directly open your GitHub notification via `gn`. (Requires that you export a
  `$GITHUB_TOKEN` set in your `.zshenv`.)
	+ <kbd>⏎</kbd>: Open the notification in the browser.
	+ <kbd>⌘⏎</kbd>: Mark the notification as read.
	+ <kbd>⌥⏎</kbd>: Copy the URL of the notification target.

## Installation
[➡️ Download the latest release.](https://github.com/chrisgrieser/gitfred/releases/latest)

When admitted to the Alfred Gallery, the workflow auto-updates via Alfred's
workflow-update mechanism.

<!-- vale Google.FirstPerson = NO -->
## Credits
__About Me__  
In my day job, I am a sociologist studying the social mechanisms underlying the
digital economy. For my PhD project, I investigate the governance of the app
economy and how software ecosystems manage the tension between innovation and
compatibility. If you are interested in this subject, feel free to get in touch.

__Profiles__  
- [reddit](https://www.reddit.com/user/pseudometapseudo)
- [Discord](https://discordapp.com/users/462774483044794368/)
- [Academic Website](https://chris-grieser.de/)
- [Twitter](https://twitter.com/pseudo_meta)
- [Mastodon](https://pkm.social/@pseudometa)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/)

<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'>
	<img
	height='36'
	style='border:0px;height:36px;'
	src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3'
	border='0'
	alt='Buy Me a Coffee at ko-fi.com'
/></a>
