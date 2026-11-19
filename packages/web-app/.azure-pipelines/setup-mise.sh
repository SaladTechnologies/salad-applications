#!/usr/bin/env bash
# Installs mise at a pinned, checksum-verified version, then every tool in mise.toml, and puts their bin directories on
# PATH for the job's later steps. Ported from salad-cloud-cli's .github/actions/setup-mise/setup.sh (the
# devops/templates CI example) to Azure Pipelines, which provides AGENT_TEMPDIRECTORY and AGENT_TOOLSDIRECTORY. Run it
# from the directory that holds mise.toml.
#
# To move to a newer mise, change version and take the archive's sum from the release's SHASUMS256.txt.
set -euo pipefail

temp="${AGENT_TEMPDIRECTORY:?set by the Azure Pipelines agent}"
tools_dir="${AGENT_TOOLSDIRECTORY:?set by the Azure Pipelines agent}"

version=2026.10.11
case "$(uname -s)/$(uname -m)" in
  Linux/x86_64)
    asset="mise-v${version}-linux-x64.tar.xz"
    sum=f5cf1e23fc08e44c72f5a77b656e03af8131b82a75407bb3a343e8eb4de28f6f
    ;;
  *)
    echo "setup-mise: no pinned mise build for $(uname -s)/$(uname -m)" >&2
    exit 1
    ;;
esac

dir="${temp}/mise-${version}"
mkdir -p "${dir}"
curl -fsSL --retry 3 -o "${dir}/${asset}" "https://github.com/jdx/mise/releases/download/v${version}/${asset}"
printf '%s  %s\n' "${sum}" "${dir}/${asset}" | sha256sum -c -
tar -xJf "${dir}/${asset}" -C "${dir}"

export PATH="${dir}/mise/bin:${PATH}"
export MISE_DATA_DIR="${tools_dir}/mise"
export MISE_TRUSTED_CONFIG_PATHS="${PWD}"
export MISE_YES=1
mise --version
mise install

# Each task.prependpath puts its directory in front of the ones before it, so the paths go in reverse: the first tool in
# mise.toml must end up first in PATH (npm ahead of the older npm that ships with Node.js, see mise.toml).
# A command substitution, not `< <(...)`, so set -e stops the step when mise bin-paths fails.
bin_paths="$(mise bin-paths)"
mapfile -t paths <<<"${bin_paths}"
for ((i = ${#paths[@]} - 1; i >= 0; i--)); do
  echo "##vso[task.prependpath]${paths[i]}"
done
echo "##vso[task.prependpath]${dir}/mise/bin"
