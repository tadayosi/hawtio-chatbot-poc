import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot'
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent'
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav'
import ChatbotFooter from '@patternfly/chatbot/dist/dynamic/ChatbotFooter'
import ChatbotHeader, {
  ChatbotHeaderActions,
  ChatbotHeaderMain,
  ChatbotHeaderMenu,
  ChatbotHeaderSelectorDropdown,
  ChatbotHeaderTitle
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader'
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message'
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar'
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox'
import {
  Bullseye,
  Content,
  DropdownItem, DropdownList
} from '@patternfly/react-core'
import userAvatar from '@patternfly/react-core/dist/styles/assets/images/img_avatar-light.svg'
import React, { FC, useEffect, useRef, useState } from 'react'
//import patternflyAvatar from '@patternfly/react-core/dist/styles/assets/images/PF-IconLogo.svg'
import patternflyAvatar from './assets/patternfly_avatar.jpg'

const initialMessages: MessageProps[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello',
    name: 'User',
    avatar: userAvatar
  },
  {
    id: '2',
    role: 'bot',
    content: 'Hello',
    name: 'Bot',
    avatar: patternflyAvatar,
    actions: {
      positive: { onClick: () => console.log('Good response') },
      negative: { onClick: () => console.log('Bad response') },
      copy: { onClick: () => console.log('Copy') },
      share: { onClick: () => console.log('Share') },
      listen: { onClick: () => console.log('Listen') }
    }
  }
]

const initialConversations: Conversation[] | { [key: string]: Conversation[] } = {}

const models: { id: string; name: string }[] = [
  { id: 'granite-7b', name: 'Granite 7B' },
  { id: 'llama-30', name: 'Llama 3.0' },
  { id: 'mistral-3b', name: 'Mistral 3B' }
]

export const ChatApp: FC<{}> = () => {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedModel, setSelectedModel] = useState('Granite 7B')
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [conversations, setConversations] = useState(initialConversations)
  const [announcement, setAnnouncement] = useState<string>()
  const scrollToBottomRef = useRef<HTMLDivElement>(null)

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


  const chatbotHeader = (
    <ChatbotHeader>
      <ChatbotHeaderMain>
        <ChatbotHeaderMenu aria-expanded={isDrawerOpen} onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)} />
        <ChatbotHeaderTitle>
          <Bullseye>
            <Content component='h1'>Hawtio AI</Content>
          </Bullseye>
        </ChatbotHeaderTitle>
      </ChatbotHeaderMain>
      <ChatbotHeaderActions>
        <ChatbotHeaderSelectorDropdown value={selectedModel} onSelect={onSelectModel}>
          <DropdownList>
            {models.map(({ id, name }) => <DropdownItem value={name} key={id}>{name}</DropdownItem>)}
          </DropdownList>
        </ChatbotHeaderSelectorDropdown>
      </ChatbotHeaderActions>
    </ChatbotHeader>
  )

  const chatbotContent = (
    <ChatbotContent>
      {/* Update the announcement prop on MessageBox whenever a new message is sent
                 so that users of assistive devices receive sufficient context  */}
      <MessageBox announcement={announcement}>
        {/* This code block enables scrolling to the top of the last message.
                  You can instead choose to move the div with scrollToBottomRef on it below 
                  the map of messages, so that users are forced to scroll to the bottom.
                  If you are using streaming, you will want to take a different approach; 
                  see: https://github.com/patternfly/virtual-assistant/issues/201#issuecomment-2400725173 */}
        {messages.map((message, index) => (
          <>
            {index === messages.length - 1 && (<div ref={scrollToBottomRef}></div>)}
            <Message key={message.id} {...message} />
          </>
        ))}
      </MessageBox>
    </ChatbotContent>
  )

  const chatbotFooter = (
    <ChatbotFooter>
      <MessageBar
        onSendMessage={handleSend}
        hasAttachButton={false}
        isSendButtonDisabled={isSendButtonDisabled}
      />
    </ChatbotFooter>
  )

  return (
    <Chatbot displayMode={ChatbotDisplayMode.embedded}>
      <ChatbotConversationHistoryNav
        displayMode={ChatbotDisplayMode.embedded}
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
            {chatbotHeader}
            {chatbotContent}
            {chatbotFooter}
          </>
        }
      />
    </Chatbot>
  )
}
