import {
  Masthead, MastheadBrand,
  MastheadLogo, MastheadMain, MastheadToggle, Page,
  PageSidebar, PageSidebarBody, PageToggleButton
} from '@patternfly/react-core'
import { BarsIcon } from '@patternfly/react-icons'
import { FC, useState } from 'react'
import { ChatApp } from './Chat'

export const App: FC<{}> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            id="fill-nav-toggle"
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo>
            Hawtio AI
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  )

  const sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen} id="fill-sidebar">
      <PageSidebarBody>Navigation</PageSidebarBody>
    </PageSidebar>
  )

  return (
    <Page masthead={masthead} sidebar={sidebar} isContentFilled>
      <ChatApp />
    </Page>
  )
}
