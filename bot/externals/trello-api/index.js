let Promise = require('bluebird');
let request = require('request');
let UrlAssembler = require('url-assembler');

const baseUri = 'https://api.trello.com/1/';
const boardId = '5849425e994cbfba2f752602';

let getNextItem = function getNextItem() {
    console.log('trello-api.getNextItem');

    let url = UrlAssembler(baseUri)
        .template('boards/:boardId/lists')
        .param('boardId', boardId)
        .query({
            key: process.env.TRELLO_KEY,
            token: process.env.TRELLO_TOKEN,
            cards: 'open',
            card_fields: 'name,url'
        }).toString();

    let req = {
        url: url,
        json: true
    };

    return new Promise(function(resolve, reject) {
        request.get(req, function(err, res, body) {
            if (err) {
                reject(err);
            }

            let upNextList = body.find(function(list) {
                return list.name === process.env.TRELLO_BACKLOG_NAME;
            });

            if (upNextList.cards.length > 0) {
                resolve(upNextList.cards[0]);
            } else {
                resolve();
            }
        });
    });
};

let getLists = function getListId(listName) {
    console.log('trello-api.getLists');

    let url = UrlAssembler(baseUri)
        .template('boards/:boardId/lists')
        .param('boardId', boardId)
        .query({
            key: process.env.TRELLO_KEY,
            token: process.env.TRELLO_TOKEN
        }).toString();

    let req = {
        url: url,
        json: true
    };

    return new Promise(function(resolve, reject) {
        request.get(req, function(err, res, body) {
            if (err) {
                reject(err);
            }

            let inProgressList = body.find(function(list) {
                return list.name === listName;
            });

            if (inProgressList) {
                console.log('got in progress id');
                resolve(inProgressList.id);
            } else {
                console.log('not got in progress id');
                resolve();
            }
        });
    });
};

let moveCardToList = function moveCardToList(cardId, listId) {
    console.log('trello-api.moveCardToList');

    let url = UrlAssembler(baseUri)
        .template('cards/:cardId/idList')
        .param('cardId', cardId)
        .query({
            value: listId,
            key: process.env.TRELLO_KEY,
            token: process.env.TRELLO_TOKEN
        }).toString();
    
    let req = {
        url: url,
        json: true
    };

    return new Promise(function(resolve, reject) {
        request.put(req, function(err, res, body) {
            if (err) {
                reject(err);
            }

            if (res.statusCode === 404) {
                let notFound = new Error('Not found');
                reject(notFound);
            }

            resolve();
        });
    });
};

let claimNextCard = function claimNextItem(card) {
    let inProgListName = process.env.TRELLO_IN_PROG_NAME;

    return new Promise(function(resolve, reject) {
        getLists('In Progress').then(function(inProgressListId) {
            return moveCardToList(card.id, inProgressListId);
        }).then(function() {
            resolve();
        }).catch(function(err) {
            reject(err);
        });
    });
};

module.exports = {
    getNextItem: getNextItem,
    claimNextCard: claimNextCard
};
