<center>
# Officebot (Automation with NLP) - Technical Design Document
**Elliot Blackburn**
</center>
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

One of Officebot's core features is removing the age old "command style" system for making a computer or robot do what you want. Using Natural Language Processing techniques, we are able to infer intents and entities from someones natural speech.

Officebot aims to remove the old "@officebot deploy lybrary/lybrary to prod" and instead replace it with something like "Hey @officebot, send the latest lybrary/lybrary to the horde of customers". From speech like that it can infer the intent to deploy an application, and the entities such as the project, a deployment platform. Using my application I can then identify the occurances of these in the text and process accordingly.

For example, if the user said "yo @officebot deploy lybrary/lybrary" we can see that no environment is included. The bot will detect that and ask something like "yeah sure, what environment shall I get it on?" and can then continue the process. This makes the bot much easier to approach, especially as a new employee.

For the NLP I've decided to make use of a Microsoft preview product which works well with some of the other tools I've selected. Microsoft's Language Understanding Intelligence Service (LUIS) is a service which can be trained. The training is very important as it allows me to define my own intents, actions, and entities. The bot will then receive all of the user input and attempt to match it to an intent with any entities. Because it receives all user input, it also makes this avalible for training later on, meaning the bot will get better and better over time at identifying language.

The NLP can also be trained and re-deployed without having to re-deploy the main bot since it's a microsoft service. This is invaluble as it means the bot can continue to improve without any down time.

## Coding Standards

This projects ultimate aim is to launch as an open source project to enable others to build out features of the bot they find useful. As a result coding standards are important, having readable code that makes sense is vital going forward. Currently the bulk of the application is written in standard JavaScript, as a result I'm using Google JavaScript style. Coding standards are enforced by an automated linter, this removes the need to document the standards in full, but below are a few examples.

* Variable names use `lowerCamelCase`.
* Const's use `UPPERCASE_UNDERSCORE_NOTATION`.
* Do not abbreviate variable names, horrizontal space is secondary to understanding. Abbreviations are okay if they are standard such as "num" or "Dns" but in other cases, be explicit.
* All *.js files should end with a new line.
* Filenames must be all lowercase and may include hyphens `-` with no additional punctuation.
* Bracers are used for all control statements with the exception of single line statements. IE:

```javascript
// Good
let option = results.response;
if (option === 4) {
    doSomething();
} else if (option === 5) {
    doSomethingElse();
}

// Good
if (results.response === 4) doSomething();

// Poor
if (results.response === 5)
    doSomethingElse();
```

## Technology Stack

* Node.js - Accomodating JavaScript on the serverside, this is my main anchoring platform for the project. The core code is all written in JavaScript and listens like a web server for incomming messages.
* NPM - Libraries are very important so having a good package manager is also useful, NPM is the standard node.js package manager.
* Redis - Used for storing persistent data, this may not be the best idea but it's light weight and easy to use. In the future a relational database may be needed but currently we can serialise JSON directly against a key which is working well for things like "teams" and "settings".
* BotFramework (BotBuilder) - Acting as a base sdk, the BotFramework from Microsoft is giving some core capabilities like sending and receiving messages. This project seems to be stretching it though and may result in feature contributions.
* BotConnector - To hook into various platforms, the BotConnector is being used enable Facebook, Slack, and Alexa connection. This also doesn't seem very well equip to deal with many complexities, in the future of this project it might be worth creating a new service to replace this closed source component.
* Express.js - Acting as the web server for both the bot's HTTP interface, and for serving up configuration pages. Express is a ground work technology that we're using to offload a of already solved problems to.
* Handlebars.js - A templating engine for the web interface. This is use strictly for configuration of the bot but it's very easy to work with and essentially adds some sugar to plain-old HTML.
* Microsoft Cognitive Services (LUIS) - The basis for the NLP discussed in [artificial intelligence](#artificial-intelligence).

## Toolchain

* Git - Acting as my version control for both the project and associated documentation. This was chosen for several reasons. First it's a standard for open source projects these days due to it's powerful branching capabilities. Second of all it's one that I am deeply familiar with and that I now run training on.
* GitHub - GitHub functions in three ways for this project.
    * As a repository backup. If I was working with a team then it would also act as a central place for us to feed from.
    * As a project management tool, making use of Issues, Projects, and Pull Requests I am able to manage my project quickly and effectively.
    * A place to mount the core project maintenance for it's future as an open source project.
* Travis-CI - Continous integration is vital for all projects. As my technology stack is supported well by linux systems I am able to make use of Travis-CI, a well known CI platform. Travis is also free for open source projects which is a great benefit.
* Azure Web Services - Azure is required for running the bot as it makes use of Microsoft's LUIS. This means you require some service keys from Azure, they are currently free but in the future this sets them up for adding paid systems.

## Contribution Guideline

Contribution guidelines have yet to be established as the project is not yet accepting contributions and still has no open source license attached.

## Branching Methodology

Branching works very simply and feeds from many popular open source projects such as Ghost, Scientist, and many others. Below is an example of how this flow works, the flow is used for implementing and removing features as well as bug fixes.

1. Ensure your master branch is up to date.
2. Create a branch form master, name it something clearly identifiable in line with the code change intentions.
3. Work on the branch making automic commits with clear descriptions and as much detail as possible about the change.
4. When the branch is ready for review or discussion or help, issue a pull request back into master using GitHub.
5. Discussion and iteration takes place using the pull request with new commits taking places and comments being made.
6. When the changes are approved the pull request is accepted and the the branch is merged into master. The branch is then deleted to keep things tidy.

With such a simple branching methodology, it makes it very easy to keep track of the status of changes and even lowers the barrier of entry for contribution.

## Risks and Contingencies

Currently the main risk of the project is it's reliance on two closed source systems, LUIS and the BotConnector. So far it hasn't been an issue but it means that the life of the project can only last as long as those two services exist.

In the future of the project, I would aim to create my own implementation of the BotConnector's API as an addition to this project. This would remove a major point of reliance upon Microsoft that is currently there and has already caused some pain with things such as bugs. As the project is in it's prototype stages, this isn't currently a major issue or one that can be tackled but further down the line it would be a feature the project wishes to implement.

The dependency on LUIS is another aspect which is one that is very hard to solve. For now it will be an accepted risk but the project, later down the line I'd like to change the code to have it as an option rather than a requirement just to ensure a life-line for those wanting to avoid it.

## Infrastructure

Due to the nature of the project, infrastructure is fairly upto the user that decides to setup their own bot. The only dependncy currently is the use of Azure to get access keys to LUIS, there is little we can do at this right now. Here is a list of infrastructure currently used.

* Vagrant - Used as a development environment for the officebot, this environment makes it very easy to develop and also allows the tearing down and setting up of a new environment in a minutes should something go wrong.
* Azure - Currently only used for LUIS keys, this will eventually be used as a demo platform for a hosted version as they offer free hosting for students on a specific computation tier.

## Localisation

Internationalisation (i18n) is a very real possibility for the project but not until it goes beyond the prototyping stages. Due to the main interface being text and voice, i18n is very possible for this application. The main issue would be the code infrastructure to support, but also that LUIS doesn't work very well with it.

I'd need to add multiple models and train it using knowledge of other languages which I do not have. As a result, i18n is not a feature that will be considered for this prototype but is something we could move into in the future.

## Quality Assurance and Testing

I will break down testing / Q&A into two sections, usability testing and functional testing. Both require a different approach and so they should be considered seperately.

### Functional testing

Functional testing is entirely automated through the use of a testing suite, this is not a negotiable concept these days and is a standard across all projects big or small. My test suite will be comprised of a few components.

* Unit tests to test the base modules of code such as actions taken to create and destroy teams. These unit tests will ensure that the code itself works as expected and will follow a behaviour syntax approach, such as "given X, expect Y". The unit tests will attempt to mirror the structure of the main project in it's layout and will also take on part of the task of code documentation. The unit tests should be clear examples of how functions should be used.
* Integration tests will be used to simulate higher level functionality from a user perspective. Some may act through the main messaging interface and others may move past it and go straight to the base API. These will test large portions of functionality to ensure the user gets the expected response.

This test suite will use a number of tools, most choices are farily arbitrary and are chosen due to popularity my familiarity with them.

* Grunt will act as a task runner and enable the running of all or individual tests from a simple commandline interface.
* Mocha is the main testing framework, enabling the easy defintion of unit and integration tests. It's a popular tool with many additional plugins. Mocha is also well known for producing very readable tests. As a bonus, there is also a Grunt plugin to make interfacing with Mocha tests easy.
* Should.js, written by the founder of the Express framework, should is an assertion library which helps to make very readable tests. Assertions can be defined in a friendly way and requires very little learning from someone new to the project. Below is an example of two assertions that can be applied.

```javascript
user.should.exist();
user.should.have.property('name', 'elliot');
```

### Usability testing

Arguably, usability testing is more important than functional testing. If the user finds it hard to use the project then they will simply opt not to. As a result user testing is taken very seriously.

The project currently uses hallway usability testing, by approaching people who don't have a steak in the project and asking them to use the bot. From that I then ask them to complete tasks or for their thoughts on various components.

The trade show on Friday 9th will be a key point for getting a large number of hands on the project. The main goal is to ensure the NLP is working correctly and that people find it easy to access tasks being created. The usefulness of the tasks themselves are not a primary goal for general usability testing. This is because the project aims to create a large suite of tasks which are useful to a user in a team context, as my uses will differ to another team it is hard to evaluate the usefulness of the bots skills.