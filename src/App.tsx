import { Masthead, MastheadBrand, MastheadContent, MastheadLogo, MastheadMain, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core'
import { FC } from 'react'
import { EmbeddedChatbotDemo } from './Chat'

export const App: FC<{}> = () => {
  const headerToolbar = (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>Menu 1</ToolbarItem>
        <ToolbarItem>Menu 2</ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  )

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <MastheadLogo>Hawtio AI</MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>{headerToolbar}</MastheadContent>
    </Masthead>
  )

  return (<EmbeddedChatbotDemo />)
}
