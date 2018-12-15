export function extend(unused1: any, unused2: any, unused3?: any) {
    arguments[0] = arguments[0] || {};
    for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                if (typeof (arguments[i][key]) === 'object') {
                    if (arguments[i][key] instanceof Array) {
                        arguments[0][key] = arguments[i][key];
                    } else {
                        arguments[0][key] = extend(arguments[0][key], arguments[i][key]);
                    }
                } else {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
    }
    return arguments[0];
}
