let MarkdownFormatter = function() {

};

MarkdownFormatter.prototype.link = function(text, url) {
    return '[' + text + ']' + '(' + url + ')';
};

module.exports = new MarkdownFormatter();
