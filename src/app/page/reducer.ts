import type { Settings } from '../extension/settings.ts'
import { api } from '../extension/api.ts'

interface State { settings: Settings }

const actions = {
  getSettings: async (state: State, value: Settings) => {
    state.settings = { ...value }
  },
  setPreserveEmpty: (state: State, value: boolean) => {
    state.settings.preserveEmpty = value
  },
  setPreservePinned: (state: State, value: boolean) => {
    state.settings.preservePinned = value
  },
  setPreserveGrouped: (state: State, value: boolean) => {
    state.settings.preserveGrouped = value
  },
}

type Action = {
  [K in keyof typeof actions]: {
    type: K
    value: Parameters<typeof actions[K]>[1]
  }
}[keyof typeof actions]

export function pageReducer(prevState: State, action: Action) {
  const state = { ...prevState }

  if (actions[action.type]) {
    const handler = actions[action.type] as (state: State, value: any) => any
    handler(state, action.value)
    api.saveSettings(state.settings)
  }

  return state
}
