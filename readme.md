# `@architect/cli` [![Travis Build Status](https://travis-ci.com/architect/cli.svg?branch=master)](https://travis-ci.com/architect/cli) [![Appveyor Build Status](https://ci.appveyor.com/api/projects/status/xeq752lrapo7g93e/branch/master?svg=true)](https://ci.appveyor.com/project/ArchitectCI/cli/branch/master) [![codecov](https://codecov.io/gh/architect/cli/branch/master/graph/badge.svg)](https://codecov.io/gh/architect/cli)

Global command line interface for @architect projects.

## Installation

### `npm`

    npm i -g @architect/cli

### Binary Distributions

Coming soon! If you are interested in helping please let us know! Currently you
can generate experimental binaries by cloning this repo and running `npm run build`.

## Usage

Run `arc` with no arguments to get help. To create a new app and kick up the local
dev server:

    mkdir testapp
    cd testapp
    arc init
    arc sandbox

Package the current app as `sam.json` and deploy it with CloudFormation:

    arc deploy
