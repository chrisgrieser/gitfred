#!/usr/bin/env zsh
# shellcheck disable=2154,SC1071

echo $(op plugin run -- gh auth status --show-token | grep 'Token: ' | sed 's/.*: \(.*\)/\1/')
