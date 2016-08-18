/// <reference path="../typings/index.d.ts"/>

import _ from 'underscore';

interface Subscription {
    id: number;
    names: string[];
    callback: (data: any, event?: string) => boolean;
}


export module Events {
    var currentId = 0;
    var subscriptions: { [id: number]: Subscription } = { };
    var namespaces: { [name: string]: Subscription[] } = { };

    function iterateOverEventName(name: string, callback:(namespace: string) => void) {
        var namespaces = name.split(".");
        var nameAcc = "";
        _.each(namespaces, (name) => {
            if (nameAcc.length != 0) {
                nameAcc = nameAcc + "."
            }
            nameAcc = nameAcc + name;
            callback(nameAcc);
        });
    }

    export function Subscribe<T>(name: string, callback: (data: T, name?: string) => boolean) {
        return SubscribeMultiple([name], callback);
    }

    export function SubscribeMultiple<T>(names: string[], callback: (data: T, name?: string) => boolean) {
        var sub: Subscription = {id: currentId, names: names, callback: callback}
        subscriptions[currentId] = sub;
        currentId++;

        _(names).each((name) => {
            if (!_.has(namespaces, name)) {
                namespaces[name] = [];
            }
            namespaces[name].push(sub);
        });

        return sub.id;
    }

    export function Unsubscribe(id: number) {
        var sub = subscriptions[id];
        delete subscriptions[id];
        _(sub.names).each((name) => {
            namespaces[name] = _.without(namespaces[name], sub);
        });
        namespaces[name] = _.without(namespaces[name], sub);
    }

    export function Publish<T>(name: string, data?: T): boolean {
        return PublishMultiple([name], data);
    }

    export function PublishMultiple<T>(names: string[], data?: T): boolean {
        var success = true;
        var calledEvents: Subscription[] = [];
        _(names).each((name) => {
            iterateOverEventName(name, (partialName) => {
                if (_.isArray(namespaces[partialName])) {
                    _.each(namespaces[partialName], (sub) => {
                        if (!_.contains(calledEvents, sub) && success) {
                            if (!sub.callback(data, name)){
                                success = false;
                            }
                            calledEvents.push(sub);
                        }
                    });
                }
            });
        });
        return success;
    }
}

export default Events;
