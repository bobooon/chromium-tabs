import { Box, Button, DropdownMenu, Flex, Separator, Text } from '@radix-ui/themes'
import { useEffect, useReducer, useState } from 'react'
import { api } from '../extension/api.ts'
import { defaultSettings } from '../extension/settings.ts'
import { pageReducer } from './reducer.ts'
import { UiSwitch, UiTooltip } from './ui.tsx'
import './page.css'

export default function Page() {
  const [state, dispatch] = useReducer(pageReducer, { settings: structuredClone(defaultSettings) })
  const [shortcut, setShortcut] = useState('')

  useEffect(() => {
    (async () => {
      dispatch({ type: 'getSettings', value: await api.getSettings() })
      setShortcut((await api.getCommands())[1].shortcut || '')
    })()
  }, [])

  return (
    <Box p="5" width="400px">
      <Flex direction="column" gap="3">
        <Flex asChild align="center" gap="2" width="100%">
          <Text as="label" size="2">
            <UiTooltip content={api.getMessage('shortcutHelp')} />
            <Text style={{ flexGrow: 1 }}>{api.getMessage('shortcut')}</Text>
            <Button
              size="1"
              variant="soft"
              color={shortcut ? 'green' : 'red'}
              style={{ height: '20px' }}
              onClick={() => api.createTab('chrome://extensions/shortcuts')}
            >
              {shortcut || api.getMessage('shortcutDisabled')}
            </Button>
          </Text>
        </Flex>

        <Box my="3" mx="-5">
          <Separator size="4" />
        </Box>

        <UiSwitch
          label={api.getMessage('preservePinned')}
          tooltip={api.getMessage('preservePinnedHelp')}
          checked={state.settings.preservePinned}
          onCheckedChange={value => dispatch({ type: 'setPreservePinned', value })}
          disabled={!shortcut}
        />
        <UiSwitch
          label={api.getMessage('preserveGrouped')}
          tooltip={api.getMessage('preserveGroupedHelp')}
          checked={state.settings.preserveGrouped}
          onCheckedChange={value => dispatch({ type: 'setPreserveGrouped', value })}
          disabled={!shortcut}
        />
        <UiSwitch
          label={api.getMessage('preserveEmpty')}
          tooltip={api.getMessage('preserveEmptyHelp')}
          checked={state.settings.preserveEmpty}
          onCheckedChange={value => dispatch({ type: 'setPreserveEmpty', value })}
          disabled={!shortcut}
        />

        <Box my="3" mx="-5">
          <Separator size="4" />
        </Box>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="soft">
              {api.getMessage('advanced')}
              <DropdownMenu.TriggerIcon />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={() => api.createTab(`chrome://extensions/?id=${chrome?.runtime?.id}`)}>
              {api.getMessage('extensionInfo')}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => api.createTab('chrome://extensions/shortcuts')}>
              {api.getMessage('extensionShortcuts')}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Box>
  )
}
