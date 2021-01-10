import MrTreeWidget from "@/MrTreeWidget";

global.$ = require('jquery');

global.beforeEach(() => {
    $('body').empty();
})

MrTreeWidget.register();