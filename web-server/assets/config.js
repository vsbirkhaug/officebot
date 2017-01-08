$(document).ready(function() {

    // Form submit
    $('#config-form').submit(function(e) {
        e.preventDefault();

        let form = this.elements;

        let config = {
            botId: form.botId.value,
            botPass: form.botPass.value,
            luisModel: form.luisModel.value,
            ghToken: form.ghToken.value,
            trelloToken: form.trelloToken.value,
            trelloKey: form.trelloKey.value
        };

        $.post('/configuration', config, function(res, status) {
            //console.log(status);
            console.log('successfully updated config');
        }).fail(function() {
            console.log('failed to update config');
            //console.log('fail');
        });
    });
});