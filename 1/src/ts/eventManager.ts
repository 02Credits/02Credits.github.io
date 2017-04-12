export class EventManager0 {
    currentId = 0;
    subscriptions: { [id: number]: () => void } = { };

    Subscribe(callback: () => void) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish() {
        for (let id in this.subscriptions) {
            this.subscriptions[id]();
        }
    }
}

export class EventManager1<A> {
    currentId = 0;
    subscriptions: { [id: number]: (arg: A) => void } = { };

    Subscribe(callback: (arg: A) => void) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg: A) {
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            sub(arg);
        }
    }
}

export class EventManager2<A1, A2> {
    currentId = 0;
    subscriptions: { [id: number]: (arg1: A1, arg2: A2) => void } = { };

    Subscribe(callback: (arg1: A1, arg2: A2) => void) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg1: A1, arg2: A2) {
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            sub(arg1, arg2);
        }
    }
}

export class EventManager3<A1, A2, A3> {
    currentId = 0;
    subscriptions: { [id: number]: (arg1: A1, arg2: A2, arg3: A3) => void } = { };

    Subscribe(callback: (arg1: A1, arg2: A2, arg3: A3) => void) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg1: A1, arg2: A2, arg3: A3) {
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            sub(arg1, arg2, arg3);
        }
    }
}

export class EventManager4<A1, A2, A3, A4> {
    currentId = 0;
    subscriptions: { [id: number]: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => void } = { };

    Subscribe(callback: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => void) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg1: A1, arg2: A2, arg3: A3, arg4: A4) {
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            sub(arg1, arg2, arg3, arg4);
        }
    }
}

export class EventManager5<A1, A2, A3, A4, A5> {
    currentId = 0;
    subscriptions: { [id: number]: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => void } = { };

    Subscribe(callback: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => void) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) {
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            sub(arg1, arg2, arg3, arg4, arg5);
        }
    }
}

export class PollManager0<R> {
    currentId = 0;
    subscriptions: { [id: number]: () => R } = { };

    Subscribe(callback: () => R) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish() {
        let result: Promise<R>[] = [];
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            result.push(Promise.resolve(sub()));
        }
        return Promise.all(result);
    }
}

export class PollManager1<A, R> {
    currentId = 0;
    subscriptions: { [id: number]: (arg: A) => R } = { };

    Subscribe(callback: (arg: A) => R) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg: A) {
        let result: Promise<R>[] = [];
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            result.push(Promise.resolve(sub(arg)));
        }
        return Promise.all(result);
    }
}

export class PollManager2<A1, A2, R> {
    currentId = 0;
    subscriptions: { [id: number]: (arg1: A1, arg2: A2) => R } = { };

    Subscribe(callback: (arg1: A1, arg2: A2) => R) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg1: A1, arg2: A2) {
        let result: Promise<R>[] = [];
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            result.push(Promise.resolve(sub(arg1, arg2)));
        }
        return Promise.all(result);
    }
}

export class PollManager3<A1, A2, A3, R> {
    currentId = 0;
    subscriptions: { [id: number]: (arg1: A1, arg2: A2, arg3: A3) => R } = { };

    Subscribe(callback: (arg1: A1, arg2: A2, arg3: A3) => R) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg1: A1, arg2: A2, arg3: A3) {
        let result: Promise<R>[] = [];
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            result.push(Promise.resolve(sub(arg1, arg2, arg3)));
        }
        return Promise.all(result);
    }
}

export class PollManager4<A1, A2, A3, A4, R> {
    currentId = 0;
    subscriptions: { [id: number]: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => R } = { };

    Subscribe(callback: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => R) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg1: A1, arg2: A2, arg3: A3, arg4: A4) {
        let result: Promise<R>[] = [];
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            result.push(Promise.resolve(sub(arg1, arg2, arg3, arg4)));
        }
        return Promise.all(result);
    }
}

export class PollManager5<A1, A2, A3, A4, A5, R> {
    currentId = 0;
    subscriptions: { [id: number]: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => R } = { };

    Subscribe(callback: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => R) {
        this.subscriptions[this.currentId] = callback;
    }

    Unsubscribe(id: number) {
        delete this.subscriptions[id];
    }

    Publish(arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) {
        let result: Promise<R>[] = [];
        for (let id in this.subscriptions) {
            let sub = this.subscriptions[id];
            result.push(Promise.resolve(sub(arg1, arg2, arg3, arg4, arg5)));
        }
        return Promise.all(result);
    }
}
