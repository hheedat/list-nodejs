module.exports = Controller("Admin/BaseController", function () {
    "use strict";
    return {
        indexAction: function () {
            //render View/Home/index_index.ejs file
            this.display();
        }
    };
});

