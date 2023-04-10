import { Subscription } from 'rxjs/internal/Subscription';

/**
 * Führt für alle registrierten Subscriptions ein unsubscripe aus
 */
export class SubscriptionHelper {
    subscriptions = new Array<Subscription>();

    add(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }
    
    unsubscribeAll() {
        for (const subscription of this.subscriptions) {
            if ( subscription && (!subscription.closed)) {
                subscription.unsubscribe();
            }
        }
        this.subscriptions.length = 0;
    }
}
