let builder = require('botbuilder');
let memory = require('../memory');

let teamsKey = 'teams';

let index = function(session) {
    memory.get(teamsKey).then(function(teamsObj) {
        if (!teamsObj) {
            session.send("There aren't any teams... how sad");
        } else {
            let msg = '**Teams:**\n\n';
            teamsObj.teams.forEach(function(team) {
                msg += team.name + '\n\n';
            });
            session.send(msg);
        }
    }).catch(function(err) {
        session.send("Woops, there's been an issue and I can't seem to get the teams");
    }).finally(function() {
        session.endDialog();
    });
};

let create = [
    function(session, args, next) {
        console.log(args);
        let teamName = builder.EntityRecognizer.findEntity(args.entities, 'team.name');
        
        let team = session.dialogData.team = {
            name: teamName ? teamName.entity : null
        };

        if (!team.name) {
            builder.Prompts.text('What shall we name the team?');
        } else {
            next();
        }
    },
    function(session, results) {
        let team = session.dialogData.team;

        if (results.response) {
            team.name = results.response;
        }

        console.log(team.name);

        // Should be null if the user said cancel
        // but Microsoft can't do things right so it doesn't
        if (team.name) {
            // Make it
            memory.get(teamsKey).then(function(allTeams) {
                
                // If no teams exist, lets create some
                if (!allTeams) {
                    allTeams = {
                        teams: []
                    };
                }

                allTeams.teams.push(team);
                console.log(allTeams);

                // Async
                return memory.store(teamsKey, allTeams);
            }).then(function() {
                console.log('teams exist now?');
            }).catch(function(err) {
                console.log(err);
            }).finally(function() {
                session.endDialog();
            });
        }
    }
];

// In dev
let remove = [
    function(session, args, next) {
        // Grab the entity
        let teamName = builder.EntityRecognizer.findEntity('team.name', args.entities);

        let team = session.dialogData.team = {
            name: teamName ? teamName.entity : null
        };

        if (!team.name) {
            builder.Prompts.text(session, 'Which team?');
        } else {
            next();
        }
    },
    function(session, results, next) {
        let teamToDelete = session.dialogData.team;
        if (results.response) {
            teamToDelete.name = results.response
        }

        // teamToDelete.name should be null if the user has cancelled
        if (teamToDelete.name) {
            // Grab all of the teams
            memory.get(teamsKey).then(function(teamsContainer) {
                // Find the team to delete
                let index = teamsContainer.teams.findIndex(function(t) {
                    return t.name === teamsToDelete.name;
                });

                // Delete it
                teamsContainer.teams.splice(index, 1);

                // Save the result
                return memory.store(teamsKey, teamsContainer);
            }).then(function() {
                console.log('done');
                session.send("Okay it's gone now");
            }).catch(function(err) {
                console.log(err);
                session.send("Woops, I think I made a mistake");
            }).finally(function() {
                session.endDialog();
            });
        } else {
            session.endDialog('Oh okay');
        }
    }
];

module.exports = {
    index: index,
    create: create
};
