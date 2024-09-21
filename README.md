<!-- LTeX: enabled=false -->
# GitFred
<!-- LTeX: enabled=true -->
![Download count](https://img.shields.io/github/downloads/chrisgrieser/gitfred/total?label=Total%20Downloads&style=plastic)
![version number](https://img.shields.io/github/v/release/chrisgrieser/gitfred?label=Latest%20Release&style=plastic)

Helpful GitHub Assistant for Alfred.

<img alt="Showcase owned repo search" width=70% src="https://github.com/chrisgrieser/gitfred/assets/73286100/c6cf4e32-d20b-4438-b868-4ff64d349c35">

<img alt="Showcase public repo search" width=70% src="https://github.com/chrisgrieser/gitfred/assets/73286100/24487302-8b9d-445c-8c26-66673d0bfd88">

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
- Access public repositories you own via `gmy`.
	+ <kbd>⏎</kbd>: If the repo is available locally on your device, open it in
	  Finder. Otherwise, open the repo's GitHub page.
	+ <kbd>⌘⏎</kbd>: Open the repo's GitHub page.
	+ <kbd>⌥⏎</kbd>: Copy the repo link.
	+ <kbd>⌃⏎</kbd>: Shallow clone the repo to a local folder and open in the
	  Terminal. If the repo is already locally available on your device, just
	  open the repository in the Terminal.
- Open recent GitHub issues you are involved in with `ghi`.
	+ <kbd>⏎</kbd>: Open the issue in the browser.
	+ <kbd>⌥⏎</kbd>: Copy the issue URL.
- Access Pull Requests (PRs) you have opened with the keyword `gpr`.
	+ <kbd>⏎</kbd>: Open the PR in the browser.
	+ <kbd>⌥⏎</kbd>: Copy the link to the PR.
- Directly open your GitHub notification via `ghn`.
	+ Requires [GitHub Token](https://github.com/settings/tokens) with access
	  to notifications.
	+ <kbd>⏎</kbd>: Open the notification in the browser.
	+ <kbd>⌘⏎</kbd>: Mark the notification as read.
	+ <kbd>⌥⏎</kbd>: Copy the URL of the notification target.
- Additionally, you can press the
  [hotkey](https://www.alfredapp.com/help/workflows/triggers/hotkey/) to clone
  GitHub repo from the current browser tab. ([Note that Firefox is not
  supported.](https://www.alfredforum.com/topic/16748-how-to-do-x-in-firefox-from-alfred/))

> [!NOTE]
> To be as lightweight as possible, this workflow only requires a GitHub token
> when needed, that is for accessing notifications. The GitHub cli `gh` is also
> only needed when cloned repos should also automatically be forked.

## Installation
This workflow requires Alfred 5.5.

[➡️ Download the latest release.](https://github.com/chrisgrieser/gitfred/releases/latest)

The workflow auto-updates via Alfred's workflow-update mechanism.

<!-- vale Google.FirstPerson = NO -->
## Credits
In my day job, I am a sociologist studying the social mechanisms underlying the
digital economy. For my PhD project, I investigate the governance of the app
economy and how software ecosystems manage the tension between innovation and
compatibility. If you are interested in this subject, feel free to get in touch.

- [Academic Website](https://chris-grieser.de/)
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
