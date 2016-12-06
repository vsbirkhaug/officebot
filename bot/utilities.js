let utilities = {

    extractEntity: function extractEntity(entitySearch, args) {
        let targetEntity = args.entities.find(function(e) {
            return e.type === entitySearch;
        });

        return targetEntity.entity;
    }

}

module.exports = utilities;
