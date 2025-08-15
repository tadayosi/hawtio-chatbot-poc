import { Button, Content, Masthead, MastheadBrand, MastheadContent, MastheadLogo, MastheadMain, Page, PageSection, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core'
import { useState } from 'react'
import './App.css'

export const App = () => {
  const [count, setCount] = useState(0)
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

  return (
    <Page masthead={masthead}>
      <PageSection>
        <Content component='h2'>Chatbot</Content>
        <Content component='p'>
          Hello!
        </Content>
        <Button onClick={() => setCount((count) => count + 1)}>
          {count}
        </Button>
      </PageSection>
    </Page>
  )
}
