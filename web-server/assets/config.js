$(document).ready(function() {

    // Form submit
    $('#config-form').submit(function(e) {
        e.preventDefault();

        let form = this.elements;

        let config = {
            bot: {
                name: form.botName.value,
                id: form.botId.value,
                pass: form.botPass.value,
                luisModel: form.luisModel.value
            },
            github: {
                // It's on if the token has a value
                isOn: form.ghToken.value != '',
                token: form.ghToken.value
            },
            trello: {
                // It's on if the token and key have values
                isOn: form.trelloToken.value != '' && form.trelloKey.value != '',
                token: form.trelloToken.value,
                key: form.trelloKey.value
            }
        };

        $.post('/configuration', config, function(res, status) {
            console.log('successfully updated config');
        }).fail(function() {
            console.log('failed to update config');
        });
    });
});