const validator =  require('validator');
const isEmpty = require('../isEmpty');

module.exports = function validateObjectInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.qsId = !isEmpty(data.qsId) ? data.qsId : '';
    data.height = !isEmpty(data.height) ? data.height : '300px';
    data.width = !isEmpty(data.width) ? data.width : '12';
    data.type = !isEmpty(data.type) ? data.type : 'QdtViz';
    // data.description = !isEmpty(data.description) ? data.description : 'QdtViz';

    // if(validator.isEmpty(data.title)){errors.title = "Object title is required"}
    if(validator.isEmpty(data.qsId)){errors.qsId = "Object id is required"}
    // if(validator.isEmpty(data.height)){errors.height = "Object height is required"}
    if(validator.isEmpty(data.type)) {errors.type = "Object type is required"}
    // if(validator.isEmpty(data.description)) {errors.description = "Object type is required"}

    // if(!validator.isLength(data.title, {min : 3, max : 64})){ errors.title = "Object title  must be between 3 and 64 characters"; }
    // if(!validator.isLength(data.description, {min : 34, max : 1024})){ errors.description = "Object description  must be between 34 and 1024 characters"; }

    return  {
        errors,
        isValid : isEmpty(errors)
    }
}
