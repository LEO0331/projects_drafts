#!/bin/sh
set -e

# ref: https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/
#
# Usage example: /bin/sh ./git_push.sh wing328 openapi-petstore-perl "minor update" "gitlab.com"

git_user_id=$1
git_repo_id=$2
release_note=$3
git_host=$4

if [ "$git_host" = "" ]; then
    git_host="github.com"
    echo "[INFO] No command line input provided. Set \$git_host to $git_host"
fi

if [ "$git_user_id" = "" ]; then
    git_user_id="GIT_USER_ID"
    echo "[INFO] No command line input provided. Set \$git_user_id to $git_user_id"
fi

if [ "$git_repo_id" = "" ]; then
    git_repo_id="GIT_REPO_ID"
    echo "[INFO] No command line input provided. Set \$git_repo_id to $git_repo_id"
fi

if [ "$release_note" = "" ]; then
    release_note="Minor update"
    echo "[INFO] No command line input provided. Set \$release_note to $release_note"
fi

# Run relative to this project even when invoked from another directory.
cd "$(dirname "$0")"
if [ ! -e .git ]; then
    git init --initial-branch=master
fi

check_remote_url() {
    case "$1" in
        http://*|https://*)
            authority=${1#*://}
            case "${authority%%/*}" in
                *@*)
                    echo "[ERROR] Remove credentials from the origin URL and use a Git credential helper." >&2
                    exit 1
                    ;;
            esac
            ;;
    esac
}

# Authenticate using the configured Git credential helper.
if ! git remote get-url origin >/dev/null 2>&1; then
    origin_url="https://${git_host}/${git_user_id}/${git_repo_id}.git"
    check_remote_url "$origin_url"
    git remote add origin "$origin_url"
fi
origin_url=$(git remote get-url origin)
push_url=$(git remote get-url --push origin)
check_remote_url "$origin_url"
check_remote_url "$push_url"

# Commit only project sources, excluding local credentials and generated dumps.
set -- README.md git_push.sh poetry.lock pyproject.toml requirements.txt setup.cfg setup.py start.py test-requirements.txt test.py tox.ini
git add -- "$@"
if ! git diff --cached --quiet -- "$@"; then
    git commit -m "$release_note" --only -- "$@"
fi

# An empty remote has no branch to pull on the first publish.
if git ls-remote --exit-code --branches origin refs/heads/master >/dev/null; then
    git pull origin master
else
    lookup_status=$?
    if [ "$lookup_status" -ne 2 ]; then
        exit "$lookup_status"
    fi
fi
git push origin master
