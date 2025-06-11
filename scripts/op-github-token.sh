#!/usr/bin/env zsh
# shellcheck disable=2154,SC1071

if [[ "$github_token_from_op_plugin" == "true" ]]; then
    echo $(op plugin run -- gh auth status --show-token | grep 'Token: ' | sed 's/.*: \(.*\)/\1/')
fi
