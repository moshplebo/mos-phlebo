// https://github.com/typograf/typograf/
const Typograf = require("typograf");
const TypografRu = new Typograf({lang: 'ru'});
TypografRu.enable('common/nbsp/afterShortWord');
TypografRu.enable('common/nbsp/afterNumber');
module.exports = TypografRu;