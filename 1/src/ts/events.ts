////////////////////////////////////////////////////////////////
///
///   This is a simple event manager. you can subscribe to
///   events by calling the subscribe function and passing
///   in a path which is a . delimited namespace for the
///   event. Events that then publish anything below that
///   namespace will get passed to the function.
///
////////////////////////////////////////////////////////////////

/** Represents an event subscription. */
interface Subscription {
    id: number;
    names: string[];
    callback: (data: any, event?: string) => (any | void);
}

class EventManager {
    currentId = 0;
    subscriptions: { [id: number]: Subscription } = { };
    namespaces: { [name: string]: Subscription[] } = { };

    private iterateOverEventName(name: string, callback:(namespace: string) => void) {
        let namespaces = name.split(".");
        let nameAcc = "";
        for (let name of namespaces) {
            if (nameAcc.length != 0) {
                nameAcc = nameAcc + "."
            }
            nameAcc = nameAcc + name;
            callback(nameAcc);
        }
    }

    /** Subscribe to a given event. Note that your event will get called for any
        published event and down the chain.

        eg. Subscribe("foo.bar", fun...) will be called with Publish("foo.bar.bas") */
    Subscribe(name: string, callback: (data: any, eventName?: string) => (any | void)) {
        return this.SubscribeMultiple([name], callback);
    }

    /** Allows you to subscribe to multiple different events with one handler.
        This event will get called for any of the passed in events. */
    SubscribeMultiple(names: string[], callback: (data: any, eventName?: string) => (any | void)) {
        let sub: Subscription = {id: this.currentId, names: names, callback: callback}
        this.subscriptions[this.currentId] = sub;
        this.currentId++;

        for (let name of names) {
            if (!(name in this.namespaces)) {
                this.namespaces[name] = [];
            }
            this.namespaces[name].push(sub);
        }

        return sub.id;
    }

    /** Stops this event handler from being called. Used to free memory generally. */
    Unsubscribe(id: number) {
        let sub = this.subscriptions[id];
        delete this.subscriptions[id];
        for (let name in sub.names) {
            this.namespaces[name] = this.namespaces[name].filter(s => s != sub);
        }
    }

    /** Publish the event with name: name and data: data. */
    async Publish<T>(name: string, data?: T): Promise<any[]> {
        return await this.PublishMultiple([name], data);
    }

    /** Publish multiple events with a given argument. The idea here is that if
        an event subscribed to multiple event names it will only get called once. */
    async PublishMultiple<T>(names: string[], data?: T): Promise<any[]> {
        let calledEvents: Subscription[] = [];
        let results: Promise<any>[] = [];
        for (let name of names) {
            this.iterateOverEventName(name, (partialName) => {
                if (Array.isArray(this.namespaces[partialName])) {
                    for (let sub of this.namespaces[partialName]) {
                        if (!(calledEvents.some(s => s === sub))) {
                            let result = sub.callback(data, name);
                            if (result != undefined) {
                                results.push(Promise.resolve(result));
                            }
                            calledEvents.push(sub);
                        }
                    }
                }
            });
        }
        if (results.length != 0) {
            return Promise.all(results);
        } else {
            return Promise.resolve([]);
        }
    }
}

export default new EventManager();
