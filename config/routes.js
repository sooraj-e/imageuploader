/**
 * Load controllers.
 */

var homeController = require('../controllers/home');

module.exports = function(app) {
    app.get('/', homeController.index);
    app.post('/upload',homeController.upload);

}	