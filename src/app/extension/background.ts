import type { Settings } from './settings.ts'
import { defaultSettings } from './settings.ts'

async function getSettings() {
  return (await chrome.storage.local.get(['settings'])).settings as Settings || structuredClone(defaultSettings)
}

async function saveSettings(settings: Settings) {
  await chrome.storage.local.set({ settings })
}

chrome.tabs.onCreated.addListener(async (tab) => {
  const settings = await getSettings()
  if (settings.preserveEmpty)
    return

  try {
    await Promise.allSettled(
      (await chrome.tabs.query({ currentWindow: true, url: 'chrome://newtab/' })).map(async (newTab) => {
        if (newTab.id && newTab.id !== tab.id)
          await chrome.tabs.remove(newTab.id)
      }),
    )
  }
  catch {}
})

async function closeTab() {
  const window = await chrome.windows.getCurrent({ populate: true })
  if (!window.tabs || window.tabs.length === 0)
    return

  const tab = window.tabs.find(tab => tab.active)
  if (!tab || !tab.id)
    return

  const settings = await getSettings()
  if ((settings.preservePinned && tab.pinned) || (settings.preserveGrouped && tab.groupId !== -1))
    return

  try {
    const tabs = window.tabs.filter(b => !b.pinned && b.groupId === -1 && b.id !== tab.id)
    if (!tabs.length)
      await chrome.tabs.create({})
    await chrome.tabs.remove(tab.id)
  }
  catch {}
}

chrome.runtime.onMessage.addListener((message, _sender, response) => {
  switch (message.type) {
    case 'getCommands':
      chrome.commands.getAll().then(commands => response(commands))
      return true

    case 'getSettings':
      getSettings().then(settings => response(settings))
      return true

    case 'saveSettings':
      saveSettings(message.payload)
      return false
  }
})

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'close')
    await closeTab()
})
