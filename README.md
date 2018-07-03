# Pastitude
Pastitude is an open-source project for sharing source code. It comes with features that aim to make sharing code more comfortable and easier.

## Main features:
 * End-to-end encryption (with an auto-generated key in URL or password)
 * Multiple files under a single link
 * Destroy paste when opened or after given time
 * Real-time syntax highlight
 * Vim mode support
 * Nice design (currently only dark theme)

## Installation
I highly recommend to run Pastitude via docker-compose. You have to do only following steps:
 1. Copy `.env.example` to `.env`
 2. If you are in another branch than a master, then run `npm install && gulp build --production`
 3. Run `docker-compose up -d`

_Environment file doesn't have specific purpose for an application. It's just prepared for [jwilder's nginx proxy](https://github.com/jwilder/nginx-proxy)._

## Contribution
If you want to contribute to Pastitude feel free to do so by forking project and creating pull request, but please keep the code standard consistent. _You don't have to run `gulp build --production` before posting pull request, I'll do it for you._

If you only want to share your idea, create issue :)