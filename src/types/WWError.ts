class WWError extends Error{
    cause: any;

    constructor(e: unknown) {
        super();
        if(e instanceof WWError) {
            this.cause = e.cause;
        } else {
            this.cause = e;
        }
    }

    toString(): string {
        return `Cause: ${this.cause}`;
    }

    static handlingError(e: unknown) {
        if(e instanceof WWError) {
            return e;
        }

        return new WWError(e);
    }
}

export default WWError;
