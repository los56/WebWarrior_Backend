class WWError extends Error{
    cause: any;
    beforeStack: any[] = [];

    constructor(e: unknown) {
        super();
        if(e instanceof WWError) {
            this.cause = e.cause;
        } else {
            this.cause = e;
        }
    }

    static handlingError(e: unknown) {
        const _e = new WWError(e);
        if(e instanceof WWError) {
            _e.beforeStack = e.beforeStack;
        }
        if(e instanceof Error) {
            const _s = e.stack?.split('\n');
            if(_s) {
                _s.forEach(v => {
                    _e.beforeStack.push(v);
                });
            }
        }

        return _e;
    }
}

export default WWError;
