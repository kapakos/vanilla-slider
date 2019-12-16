/**
 * Initializes A Slider Object
 * @param options
 * @returns {VanillaSlider}
 * @constructor
 */
function VanillaSlider(options){
    if(!(this instanceof arguments.callee)){
        return new VanillaSlider(options)
    }

    var validator = new Validator(options);
    if(validator.errors){
        throw new Error('Validation error on the options passed. Message: ' + validator.message);
    }

}

function Validator(options){
    return {
        errors: null,
        message: ''
    }
}