# Officer

Natural Language Processing (NLP) bot building framework

## Getting Started

**[Feedback Form](https://goo.gl/forms/FdyqRvBXSGIXOTcC2)**

Officer is an NLP bot building framework built to be used in conjunction with [Luis.ai](http://luis.ai).

Officer offers a convention over configuration style for building automation bots with a mix of NLP to help lower the barrier of entry for usage.

The bot has a few prebuild demo skills which can be used to test out the bot. These skills have heavy restrictions but the idea is you'll build in operations useful to you.

## What are the demo skills?

* Find out what's next on the demo trello board.
* Ask what issues are on any repository such as bluehatbrit/officebot, or microsoft/botbuilder.
* Create a new issue on github.
* Create a new team _(teams are still in development)_.

## Example usage

**Add @officebot to address the for the first time**

* "@officebot What's next on trello?"
* "@officebot Create a new team"
* "@officebot Get issues on tryghost/ghost"
* "@officebot Hold on, what was issue 1823 on microsoft/botbuilder again?"
* "@officebot Create an issue on bluehatbrit/office called crashes on db connect"

## Demo notes

* The trello integration uses [this demo board here](https://trello.com/b/viHXwBnd/vintus)
* Creating issues can only be done on `bluehatbrit/officebot` during the demo.
* Team management is still in development.
* If something goes drastically wrong just type say "@officebot halt" and it'll reset.