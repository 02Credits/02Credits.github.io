import * as _ from 'underscore';

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
        _.each(namespaces, (name) => {
            if (nameAcc.length != 0) {
                nameAcc = nameAcc + "."
            }
            nameAcc = nameAcc + name;
            callback(nameAcc);
        });
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

        _(names).each((name) => {
            if (!_.has(this.namespaces, name)) {
                this.namespaces[name] = [];
            }
            this.namespaces[name].push(sub);
        });

        return sub.id;
    }

    /** Stops this event handler from being called. Used to free memory generally. */
    Unsubscribe(id: number) {
        let sub = this.subscriptions[id];
        delete this.subscriptions[id];
        _(sub.names).each((name) => {
            this.namespaces[name] = _.without(this.namespaces[name], sub);
        });
    }

    /** Publish the event with name: name and data: data. */
    async Publish<T>(name: string, data?: T): Promise<any[]> {
        return await this.PublishMultiple([name], data);
    }

    /** Publish multiple events with a given argument. The idea here is that if
        an event subscribed to multiple event names it will only get called once. */
    async PublishMultiple<T>(names: string[], data?: T): Promise<any[]> {
        let calledEvents: Subscription[] = [];
        let results = [];
        _(names).each((name) => {
            this.iterateOverEventName(name, (partialName) => {
                if (_.isArray(this.namespaces[partialName])) {
                    _.each(this.namespaces[partialName], (sub) => {
                        if (!_.contains(calledEvents, sub)) {
                            let result = sub.callback(data, name);
                            if (result != undefined) {
                                results.push(Promise.resolve(result));
                            }
                            calledEvents.push(sub);
                        }
                    });
                }
            });
        });
        if (_.any(results)) {
            return Promise.all(results);
        } else {
            return Promise.resolve([]);
        }
    }
}

export default new EventManager();
