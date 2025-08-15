import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot'
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent'
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav'
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter'
import ChatbotHeader, {
  ChatbotHeaderActions,
  ChatbotHeaderMain,
  ChatbotHeaderMenu,
  ChatbotHeaderSelectorDropdown,
  ChatbotHeaderTitle
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader'
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt'
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message'
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar'
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox'
import {
  Brand, Bullseye, Button, Content, DropdownItem, DropdownList, Masthead, MastheadBrand,
  MastheadLogo, MastheadMain, MastheadToggle, Page, PageSection, PageSidebar, PageSidebarBody, PageToggleButton
} from '@patternfly/react-core'
import PFHorizontalLogoColor from '@patternfly/react-core/dist/styles/assets/images/PF-HorizontalLogo-Color.svg'
import PFHorizontalLogoReverse from '@patternfly/react-core/dist/styles/assets/images/PF-HorizontalLogo-Reverse.svg'
import { BarsIcon } from '@patternfly/react-icons'
import React, { FC, useEffect, useRef, useState } from 'react'
import patternflyAvatar from './assets/patternfly_avatar.jpg'
import userAvatar from './assets/user_avatar.jpg'

export const Chat: FC<{}> = () => {
  const [count, setCount] = useState(0)
  return (
    <PageSection>
      <Content component='h2'>Chatbot</Content>
      <Content component='p'>
        Hello!
      </Content>
      <Button onClick={() => setCount((count) => count + 1)}>
        {count}
      </Button>
    </PageSection>
  )
}

const footnoteProps = {
  label: 'Lightspeed uses AI. Check for mistakes.',
  popover: {
    title: 'Verify accuracy',
    description: `While Lightspeed strives for accuracy, there's always a possibility of errors. It's a good practice to verify critical information from reliable sources, especially if it's crucial for decision-making or actions.`,
    bannerImage: {
      src: 'https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif',
      alt: 'Example image for footnote popover'
    },
    cta: {
      label: 'Got it',
      onClick: () => {
        alert('Do something!')
      }
    },
    link: {
      label: 'Learn more',
      url: 'https://www.redhat.com/'
    }
  }
}

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

Here is an inline code - \`() => void\`

Here is some YAML code:

~~~yaml
apiVersion: helm.openshift.io/v1beta1/
kind: HelmChartRepository
metadata:
  name: azure-sample-repo0oooo00ooo
spec:
  connectionConfig:
  url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs
~~~

Here is some JavaScript code:

~~~js
import React from 'react';

const MessageLoading = () => (
  <div className="pf-chatbot__message-loading">
    <span className="pf-chatbot__message-loading-dots">
      <span className="pf-v6-screen-reader">Loading message</span>
    </span>
  </div>
);

export default MessageLoading;

~~~
`

const initialMessages: MessageProps[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, can you give me an example of what you can do?',
    name: 'User',
    avatar: userAvatar
  },
  {
    id: '2',
    role: 'bot',
    content: markdown,
    name: 'Bot',
    avatar: patternflyAvatar,
    actions: {
      // eslint-disable-next-line no-console
      positive: { onClick: () => console.log('Good response') },
      // eslint-disable-next-line no-console
      negative: { onClick: () => console.log('Bad response') },
      // eslint-disable-next-line no-console
      copy: { onClick: () => console.log('Copy') },
      // eslint-disable-next-line no-console
      share: { onClick: () => console.log('Share') },
      // eslint-disable-next-line no-console
      listen: { onClick: () => console.log('Listen') }
    }
  }
]

const welcomePrompts = [
  {
    title: 'Topic 1',
    message: 'Helpful prompt for Topic 1'
  },
  {
    title: 'Topic 2',
    message: 'Helpful prompt for Topic 2'
  }
]

const initialConversations = {
  Today: [{ id: '1', text: 'Hello, can you give me an example of what you can do?' }],
  'This month': [
    {
      id: '2',
      text: 'Enterprise Linux installation and setup'
    },
    { id: '3', text: 'Troubleshoot system crash' }
  ],
  March: [
    { id: '4', text: 'Ansible security and updates' },
    { id: '5', text: 'Red Hat certification' },
    { id: '6', text: 'Lightspeed user documentation' }
  ],
  February: [
    { id: '7', text: 'Crashing pod assistance' },
    { id: '8', text: 'OpenShift AI pipelines' },
    { id: '9', text: 'Updating subscription plan' },
    { id: '10', text: 'Red Hat licensing options' }
  ],
  January: [
    { id: '11', text: 'RHEL system performance' },
    { id: '12', text: 'Manage user accounts' }
  ]
}

export const EmbeddedChatbotDemo: FC<{}> = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages)
  const [selectedModel, setSelectedModel] = useState('Granite 7B')
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [announcement, setAnnouncement] = useState<string>()
  const scrollToBottomRef = useRef<HTMLDivElement>(null)
  const displayMode = ChatbotDisplayMode.embedded
  // Auto-scrolls to the latest message
  useEffect(() => {
    // don't scroll the first load - in this demo, we know we start with two messages
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const onSelectModel = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setSelectedModel(value as string)
  }

  // you will likely want to come up with your own unique id function; this is for demo purposes only
  const generateId = () => {
    const id = Date.now() + Math.random()
    return id.toString()
  }

  const handleSend = (message: string | number) => {
    setIsSendButtonDisabled(true)
    const newMessages: MessageProps[] = []
    // we can't use structuredClone since messages contains functions, but we can't mutate
    // items that are going into state or the UI won't update correctly
    messages.forEach((message) => newMessages.push(message))
    newMessages.push({ id: generateId(), role: 'user', content: String(message), name: 'User', avatar: userAvatar })
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: 'Bot',
      avatar: patternflyAvatar,
      isLoading: true
    })
    setMessages(newMessages)
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`)

    // this is for demo purposes only; in a real situation, there would be an API response we would wait for
    setTimeout(() => {
      const loadedMessages: MessageProps[] = []
      // we can't use structuredClone since messages contains functions, but we can't mutate
      // items that are going into state or the UI won't update correctly
      newMessages.forEach((message) => loadedMessages.push(message))
      loadedMessages.pop()
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'API response goes here',
        name: 'Bot',
        avatar: patternflyAvatar,
        isLoading: false,
        actions: {
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') },
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log('Copy') },
          // eslint-disable-next-line no-console
          share: { onClick: () => console.log('Share') },
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log('Listen') }
        }
      })
      setMessages(loadedMessages)
      // make announcement to assistive devices that new message has loaded
      setAnnouncement(`Message from Bot: API response goes here`)
      setIsSendButtonDisabled(false)
    }, 5000)
  }

  const findMatchingItems = (targetValue: string) => {
    let filteredConversations = Object.entries(initialConversations).reduce((acc, [key, items]) => {
      const filteredItems = items.filter((item) => item.text.toLowerCase().includes(targetValue.toLowerCase()))
      if (filteredItems.length > 0) {
        acc[key] = filteredItems
      }
      return acc
    }, {})

    // append message if no items are found
    if (Object.keys(filteredConversations).length === 0) {
      filteredConversations = [{ id: '13', noIcon: true, text: 'No results found' }]
    }
    return filteredConversations
  }

  const horizontalLogo = (
    <Bullseye>
      <Brand className="show-light" src={PFHorizontalLogoColor} alt="PatternFly" />
      <Brand className="show-dark" src={PFHorizontalLogoReverse} alt="PatternFly" />
    </Bullseye>
  )

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
          <MastheadLogo href="https://patternfly.org" target="_blank">
            Logo
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
      <Chatbot displayMode={displayMode}>
        <ChatbotConversationHistoryNav
          displayMode={displayMode}
          onDrawerToggle={() => {
            setIsDrawerOpen(!isDrawerOpen)
            setConversations(initialConversations)
          }}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          activeItemId="1"
          // eslint-disable-next-line no-console
          onSelectActiveItem={(e, selectedItem) => console.log(`Selected history item with id ${selectedItem}`)}
          conversations={conversations}
          onNewChat={() => {
            setIsDrawerOpen(!isDrawerOpen)
            setMessages([])
            setConversations(initialConversations)
          }}
          handleTextInputChange={(value: string) => {
            if (value === '') {
              setConversations(initialConversations)
            }
            // this is where you would perform search on the items in the drawer
            // and update the state
            const newConversations: { [key: string]: Conversation[] } = findMatchingItems(value)
            setConversations(newConversations)
          }}
          drawerContent={
            <>
              <ChatbotHeader>
                <ChatbotHeaderMain>
                  <ChatbotHeaderMenu aria-expanded={isDrawerOpen} onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)} />
                  <ChatbotHeaderTitle>{horizontalLogo}</ChatbotHeaderTitle>
                </ChatbotHeaderMain>
                <ChatbotHeaderActions>
                  <ChatbotHeaderSelectorDropdown value={selectedModel} onSelect={onSelectModel}>
                    <DropdownList>
                      <DropdownItem value="Granite 7B" key="granite">
                        Granite 7B
                      </DropdownItem>
                      <DropdownItem value="Llama 3.0" key="llama">
                        Llama 3.0
                      </DropdownItem>
                      <DropdownItem value="Mistral 3B" key="mistral">
                        Mistral 3B
                      </DropdownItem>
                    </DropdownList>
                  </ChatbotHeaderSelectorDropdown>
                </ChatbotHeaderActions>
              </ChatbotHeader>
              <ChatbotContent>
                {/* Update the announcement prop on MessageBox whenever a new message is sent
                 so that users of assistive devices receive sufficient context  */}
                <MessageBox announcement={announcement}>
                  <ChatbotWelcomePrompt
                    title="Hello, Chatbot User"
                    description="How may I help you today?"
                    prompts={welcomePrompts}
                  />
                  {/* This code block enables scrolling to the top of the last message.
                  You can instead choose to move the div with scrollToBottomRef on it below 
                  the map of messages, so that users are forced to scroll to the bottom.
                  If you are using streaming, you will want to take a different approach; 
                  see: https://github.com/patternfly/virtual-assistant/issues/201#issuecomment-2400725173 */}
                  {messages.map((message, index) => {
                    if (index === messages.length - 1) {
                      return (
                        <>
                          <div ref={scrollToBottomRef}></div>
                          <Message key={message.id} {...message} />
                        </>
                      )
                    }
                    return <Message key={message.id} {...message} />
                  })}
                </MessageBox>
              </ChatbotContent>
              <ChatbotFooter>
                <MessageBar
                  onSendMessage={handleSend}
                  hasMicrophoneButton
                  isSendButtonDisabled={isSendButtonDisabled}
                />
                <ChatbotFootnote {...footnoteProps} />
              </ChatbotFooter>
            </>
          }
        ></ChatbotConversationHistoryNav>
      </Chatbot>
    </Page>
  )
}
