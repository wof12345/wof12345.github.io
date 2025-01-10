import { v4 as uuidv4 } from 'uuid';

let defaultOptions = {

}

function _generateModifiedNotifcations(notifications) {
    let modified = notifications.map(elm => new Object({ ...elm, uuid: uuidv4() }))

    return modified
}

export function stackingNotification({ notifications = [], options = {} }) {
    let modifiedNotifications = $state([])
    let currentActiveNotifications = $state([])
    let compOptions = $state({ defaultOptions, ...options })

    modifiedNotifications = _generateModifiedNotifcations(notifications)

    return {
        get getModifiedNotifications() { return modifiedNotifications },
        get getActiveNotifications() { return currentActiveNotifications },
        updateNotifications: (notifications) => {
            modifiedNotifications = _generateModifiedNotifcations(notifications);
            return modifiedNotifications
        },
        updateCurrentActiveNotifications: (notifications) => {
            currentActiveNotifications = _generateModifiedNotifcations(notifications);
            return currentActiveNotifications
        },
        addToCurrentActiveNotificationsFront: (notification) => {
            currentActiveNotifications.unshift(notification)
            return currentActiveNotifications
        },
        spliceCurrentActiveNotifications: (idx, range = 1) => {
            currentActiveNotifications.splice(idx, range);
            return currentActiveNotifications
        }
    }
}


export let stackingNotificationStore = stackingNotification({ notifications: [], options: {} });