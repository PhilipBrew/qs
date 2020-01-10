const validator =  require('validator');
const isEmpty = require('../isEmpty');

module.exports = function validatePageInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.status = !isEmpty(data.status) ? data.status : 'draft';
    data.menu = !isEmpty(data.menu) ? data.menu : 'no';
    data.template = !isEmpty(data.template) ? data.template : 'analysis';

    if(validator.isEmpty(data.title)){errors.title = "Page title is required"}
    // if(validator.isEmpty(data.handle)){errors.handle = "Page handle is required"};
    if(validator.isEmpty(data.status)){errors.status = "Page Status is required"}
    if(validator.isEmpty(data.menu)){errors.menu = "Page menu status is required"}
    if(validator.isEmpty(data.template)) {errors.tamplate = "Page template is required"}

    if(!validator.isLength(data.title, {min : 3, max : 64})){ errors.title = "Page title  must be between 3 and 64 characters"; }
    if(!validator.isLength(data.description, { max : 1024})){ errors.description = "Page description  must not be more than 1024 characters"; }

    return  {
        errors,
        isValid : isEmpty(errors)
    }
}
