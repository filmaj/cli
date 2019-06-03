# `@architect/cli`

new experimental global cli tool for architect projects 

### installation

For now:

```bash
npm i -g @architect/cli
```
Coming soon: binary distributions. If you are interested in helping please let us know! Currently you can generate experimental binaries by cloning this repo and running `npm run build`. 

## Usage

Run `arc` with no arguments to get help. To create a new app and kick up the local dev server:

```bash
mkdir testapp
cd testapp
arc init
arc sandbox
```

Package the current app as `sam.json` and deploy it with Cloudformation:

```bash
arc deploy
```
