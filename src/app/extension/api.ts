import type { Settings } from './settings.ts'
import json from '../../locales/en/messages.json' with { type: 'json' }
import { defaultSettings } from './settings.ts'

const messages = json as { [key: string]: { message: string } }

export function api() {}

api.getMessage = (key: string, substitutions?: string | string[]): string => {
  try {
    return chrome.i18n.getMessage(key, substitutions)
  }
  catch {
    return messages[key].message || ''
  }
}

api.getSettings = async () => {
  try {
    return await chrome.runtime.sendMessage({ type: 'getSettings' }) as Settings
  }
  catch {
    return structuredClone(defaultSettings)
  }
}

api.saveSettings = async (settings: Settings) => {
  try {
    await chrome.runtime.sendMessage({ type: 'saveSettings', payload: settings })
  }
  catch {}
}

api.getCommands = async () => {
  try {
    return await chrome.runtime.sendMessage({ type: 'getCommands' }) as chrome.commands.Command[]
  }
  catch {
    return []
  }
}

api.createTab = (url: string) => {
  try {
    chrome.tabs.create({ url })
  }
  catch {
    console.log(url)
  }
}
