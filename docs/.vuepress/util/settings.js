import settings from '../settings/index.js'

export function getSettings() {
    // return a copy of settings to prevent modification
    return JSON.parse(JSON.stringify(settings))
}