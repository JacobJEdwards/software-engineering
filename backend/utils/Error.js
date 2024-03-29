class ResponseHandler {
    constructor() {
        this.message = "Successful";
        this.statusCode = 200;
        this.hadError = false;
    }


    addError(message, code) {
        this.message = message;
        this.statusCode = code;
        this.hadError = true;
    }

    reset() {
        this.message = "Successful";
        this.statusCode = 200;
        this.hadError = false;
    }
}


export default ResponseHandler
