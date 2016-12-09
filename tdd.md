# Technical Design Document

## Table of contents

1. [Introduction](#introduction)
2. [Design and Interaction](#design-and-interaction)
3. [Artificial Intellignece](#artificial-intelligence)
4. [Architecture](#architecture)
5. [Coding Standards](#coding-standards)
6. [Technology Stack](#technology-stack)
7. [Toolchain](#toolchain)
8. [Contribution Guidelines](#contribution-guidelines)
9. [Branching Methodology](#branching-methodology)
10. [Risks and Contingencies](#risks-and-contingencies)
11. [Infrastructure](#infrastructure)
12. [Localisation](#localisation)
13. [Quality Assurance and Testing](#quality-assurance-and-testing)
14. [Technical Design Review](#technical-design-review)
15. [Prototype Roadmap](#prototype-roadmap)

## Introduction

**Officebot** (working title) is a new breed of automation bot. This project explores with world of ChatOps and how Natural Language Processing (NLP) might be combined with the idea of multi-platform chat-oriented bots to further the field of ChatOps.

The motiviation behind this as a project is to delve deeper into the operations side of software and game engineer, one rarely explored in academics. Automation plays a huge role at top performing companies and can save a business immesurable amounts of time and money.

The Officebot makes use of new emerging technologies and approaches to try and create an ops bot to support software and game engineers in their day-to-day development. The bot comes pre-packaged with a number of capabilities including links to external API's, and also basic team management.

This particular bot is pushing the boundries of the core technologies being used (mostly a JavaScript and Microsoft based stack) and has already resulted in numerous bug reports and feature request to the core repositories. In the further development this project should serve as a way of pushing forward the underlying technologies.

## Design and Interaction

The design and interaction of this bot come in multiple layers, since this bot can be deployed to numberous platforms we must take a lot into consideration. Along side this, there are actually two primary interfaces with the bot from a user perspective.

* Text based - For example, Slack integration will make this a very popular choice for most users. This is the standard approach to ChatOps / automation bots these days. The twist here is that we include NLP, meaning your standard "command" like structures are out of the window. With NLP we can ask questions back and forth and lower the barrier to entry. No more questions like "how do I deploy?", because the bot can just talk you though it.
* Speech based - This will be added at the latter end, but with the way the bot will be built we will be able to create a deployable version for the Amazon Echo (see [Technology Stack](#technology-stack)). This will enable the use of speech to control the bot, this gives the user further options of how to interact with the bot, potentially allowing them both avenues. It's also a next level advancement for accessibility by removing the screen-reader and text-to-speech entirely.

The issue that we face with this is ensuring the NLP service is trained sufficiently to allow interaction to really feel natural.

The final consideration is the back-end configuration system. This is a simple web-service for configuring the bot and maintaining it's settings. For now this is quite locked down and no extension will be possible, but in future iterations it would be good to allow plugin developers to add configuration options through this. Potentially even expanding into a system to allow hooking into 3rd party OAuth(1.0/2.0) systems. That is out of the scope of this iteration stage though.

The design for the back-end configuration will be done with bootstrap, it's fast to develop with and also removes many design decisions such as how to display forms of checkboxes.

## Artifical intelligence

LUIS for NLP

## Coding Standards

Google Node.js JavaScript Linting standards

## Technology Stack

* Node.js
* NPM
* Redis
* BotFramework (BotBuilder)
* BotConnector
* Express.js
* Handlebars.js
* Microsoft Cognitive Services - LUIS

## Toolchain

* Git
* GitHub
* Travis-CI
* Azure Web Services

## Contribution Guideline

Open source, pull requests, issue template, core contributors

## Branching Methodology

Topic branches, master branch is deployable, continous integration

## Risks and Contingencies

Deployment, API hooks dependant on vendors

## Infrastructure

Node.js, Vagrant, Azure

## Localisation

I18n being ignored for now, but easy to implement

## Quality Assurance and Testing

Automated tests, CI server, code reviews impossible due to team size, adhearing to principles

## Technical Design Review

Review process for this document = I thought this was right so it became so.

## Prototype Roadmap

Feature roadmap as a link to github project