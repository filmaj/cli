# `@architect/cli`

new experimental global cli tool for architect projects 

### installation

For now:

```bash
npm i -g @architect/cli
```
Coming soon: binary distributions. If you are interested in helping please let us know! Currently you can generate experimental binaries by cloning this repo and running `npm run build`. 

# commands

## `arc help`

get help

## `arc init`

generate local code based on `.arc` (and will generate a default `.arc` if none exists)

## `arc package`

generate `sam.json` based on `.arc`

## `arc repl`

start a repl based on `.arc`

## `arc sandbox` 

start a local web server on 3333

## `arc version`

gets the current version

# example usages

create a new app and kick up the local dev server

```bash
mkdir testapp
cd testapp
arc init
arc sandbox
```

package `sam.json` and deploy it with Cloudformation

```bash
arc package
sam package --template-file sam.json --output-template-file out.yaml --s3-bucket [S3 bucket]
sam deploy --template-file out.yaml --stack-name [Stack Name] --s3-bucket [S3 bucket] --capabilities CAPABILITY_IAM
```
