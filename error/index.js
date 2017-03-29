/**
 * Created by Tristan on 2017/3/28.
 */
function ParamError(code, message) {
    this.name = 'param error';
    this.code = code || 500;
    this.message = message || 'unknow error';
    this.stack = (new Error()).stack;
}
ParamError.prototype = Object.create(Error.prototype);
ParamError.prototype.constructor = ParamError;


function BusinessError(code, message) {
    this.name = 'business error';
    this.code = code || 500;
    this.message = message || 'unknow error';
    this.stack = (new Error()).stack;
}

BusinessError.prototype = Object.create(Error.prototype);
BusinessError.prototype.constructor = BusinessError;


function UnckeckError(code, message) {
    this.name = 'Unckeck error';
    this.code = code || 500;
    this.message = message || 'unknow error';
    this.stack = (new Error()).stack;
}

UnckeckError.prototype = Object.create(Error.prototype);
UnckeckError.prototype.constructor = UnckeckError;


module.exports = {
    ParamError: ParamError,
    BusinessError: BusinessError,
    UnckeckError: UnckeckError
}