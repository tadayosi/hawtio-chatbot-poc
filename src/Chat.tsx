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
  Alert,
  Bullseye,
  Button,
  Content,
  DropdownItem, DropdownList,
  Flex
} from '@patternfly/react-core'
import userAvatar from '@patternfly/react-core/dist/styles/assets/images/img_avatar-light.svg'
import React, { FC, Fragment, useContext, useEffect, useRef, useState } from 'react'
//import patternflyAvatar from '@patternfly/react-core/dist/styles/assets/images/PF-IconLogo.svg'
import { AIMessage } from '@langchain/core/messages'
import { ToolCall } from '@langchain/core/messages/tool'
import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon'
import patternflyAvatar from './assets/patternfly_avatar.jpg'
import { ChatContext } from './context'
import { LangChainModel, MODELS } from './model'

const initialConversations: Conversation[] | Record<string, Conversation[]> = {}

export const ChatApp: FC<{}> = () => {
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [model, setModel] = useState(new LangChainModel(MODELS[0]!))
  const [conversations, setConversations] = useState<Conversation[] | Record<string, Conversation[]>>(initialConversations)
  const [announcement, setAnnouncement] = useState<string>('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  console.log('Use model:', model.model.id)

  const findMatchingItems = (targetValue: string) => {
    let filteredConversations: Conversation[] | Record<string, Conversation[]> = Object.entries(initialConversations).reduce((acc, [key, items]) => {
      const filteredItems = items.filter((item) => item.text.toLowerCase().includes(targetValue.toLowerCase()))
      if (filteredItems.length > 0) {
        acc[key] = filteredItems
      }
      return acc
    }, {} as Record<string, Conversation[]>)

    // append message if no items are found
    if (Object.keys(filteredConversations).length === 0) {
      filteredConversations = [{ id: '13', noIcon: true, text: 'No results found' }]
    }
    return filteredConversations
  }

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
          const newConversations = findMatchingItems(value)
          setConversations(newConversations)
        }}
        drawerContent={
          <ChatContext.Provider value={{
            model, setModel, messages, setMessages, announcement, setAnnouncement, isDrawerOpen, setIsDrawerOpen
          }}>
            <ChatAppHeader />
            <ChatAppContent />
            <ChatAppFooter />
          </ChatContext.Provider>
        }
      />
    </Chatbot>
  )
}

const ChatAppHeader: FC<{}> = () => {
  const { setModel, isDrawerOpen, setIsDrawerOpen } = useContext(ChatContext)
  const [selectedModel, setSelectedModel] = useState(MODELS[0]!.name)

  useEffect(() => {
    const modelInfo = MODELS.find(m => m.name === selectedModel)
    if (modelInfo) {
      setModel(new LangChainModel(modelInfo))
    }
  }, [selectedModel])

  const onSelectModel = (_event?: React.MouseEvent<Element, MouseEvent>, value?: string | number) => {
    setSelectedModel(value as string)
  }

  return (
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
            {MODELS.map(({ id, name }) => <DropdownItem value={name} key={id}>{name}</DropdownItem>)}
          </DropdownList>
        </ChatbotHeaderSelectorDropdown>
      </ChatbotHeaderActions>
    </ChatbotHeader >
  )
}

const ChatAppContent: FC<{}> = () => {
  const { messages, announcement } = useContext(ChatContext)
  const scrollToBottomRef = useRef<HTMLDivElement>(null)

  // Auto-scrolls to the latest message
  useEffect(() => {
    // don't scroll the first load - in this demo, we know we start with two messages
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <ChatbotContent>
      {/* Update the announcement prop on MessageBox whenever a new message is sent
                 so that users of assistive devices receive sufficient context  */}
      <MessageBox announcement={announcement}>
        {/* This code block enables scrolling to the top of the last message.
                  You can instead choose to move the div with scrollToBottomRef on it below 
                  the map of messages, so that users are forced to scroll to the bottom.
                  If you are using streaming, you will want to take a different approach; 
                  see: https://github.com/patternfly/virtual-assistant/issues/201#issuecomment-2400725173 */}
        {messages
          .map((message, index) => (
            <Fragment key={message.id}>
              {index === messages.length - 1 && (<div ref={scrollToBottomRef} />)}
              <Message key={message.id} {...message} />
            </Fragment>
          ))}
      </MessageBox>
    </ChatbotContent>
  )
}

const ChatAppFooter: FC<{}> = () => {
  const { model, messages, setMessages, setAnnouncement } = useContext(ChatContext)
  const modelName = model.model.name
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false)
  const messagesRef = useRef<MessageProps[]>(messages)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // TODO: demo-level unique ID generation
  const generateId = () => {
    const id = Date.now() + Math.random()
    return id.toString()
  }

  const toolApproveButtons = (toolCalls: ToolCall[]) => (
    <Flex columnGap={{ default: 'columnGapSm' }}>
      <Button variant='primary' onClick={() => approve(toolCalls)}>Approve</Button>
      <Button variant='secondary' onClick={reject}>Reject</Button>
    </Flex>
  )

  const toBotMessage = (answer: AIMessage | string): MessageProps => {
    const botMessage: MessageProps = {
      id: generateId(),
      role: 'bot',
      name: modelName,
      avatar: patternflyAvatar,
      isLoading: false,
      actions: {
        positive: { onClick: () => console.log('Good response') },
        negative: { onClick: () => console.log('Bad response') },
        copy: { onClick: () => console.log('Copy') },
        share: { onClick: () => console.log('Share') },
        listen: { onClick: () => console.log('Listen') }
      }
    }
    if (typeof answer === 'string') {
      // Error
      botMessage.content = `Error: ${answer}`
      return botMessage
    }

    if (!answer.tool_calls || answer.tool_calls.length === 0) {
      // No tool calls
      botMessage.content = answer.content as string
      return botMessage
    }

    // Tool calls
    const toolCalls = answer.tool_calls
    botMessage.content = `${modelName} wants to use ` + (toolCalls.length > 1 ? 'tools' : 'a tool')
    botMessage.extraContent = {
      beforeMainContent: toolCalls.map((call, index) => (
        <Alert key={index} variant='info' title={<><WrenchIcon /> {call.name}</>} isExpandable>
          Args: {JSON.stringify(call.args)}
        </Alert>
      )),
      afterMainContent: toolApproveButtons(toolCalls)
    }
    return botMessage
  }

  const handleSend = async (message: string) => {
    if (!message.trim()) {
      return
    }
    console.log('Send', messagesRef.current)

    setIsSendButtonDisabled(true)
    const newMessages: MessageProps[] = []
    newMessages.push(...messagesRef.current)
    newMessages.push({ id: generateId(), role: 'user', content: message, name: 'User', avatar: userAvatar })
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: modelName,
      avatar: patternflyAvatar,
      isLoading: true
    })
    setMessages(newMessages)
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`)
    console.log('handleSend - newMessages:', newMessages)

    const answer = await model.chat(message)
    const loadedMessages: MessageProps[] = []
    loadedMessages.push(...newMessages)
    console.log('handleSend - loadedMessages:', loadedMessages)
    // Remove the loading message
    loadedMessages.pop()
    const botMessage = toBotMessage(answer)
    loadedMessages.push(botMessage)
    setMessages(loadedMessages)
    setAnnouncement(`Message from Bot: ${answer}`)
    setIsSendButtonDisabled(false)
  }

  const approve = async (toolCalls: ToolCall[]) => {
    console.log('Approved', messagesRef.current)

    setIsSendButtonDisabled(true)
    const newMessages: MessageProps[] = []
    newMessages.push(...messagesRef.current)
    newMessages.push({ id: generateId(), role: 'user', content: 'Approved', name: 'User', avatar: userAvatar })
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: modelName,
      avatar: patternflyAvatar,
      isLoading: true
    })
    setMessages(newMessages)
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`User approved tool usage. Message from Bot is loading.`)
    console.log('approve - newMessages:', newMessages)

    const answer = await model.invokeTools(toolCalls)
    console.log('Answer:', answer)
    const loadedMessages: MessageProps[] = []
    loadedMessages.push(...newMessages)
    console.log('approve - loadedMessages:', loadedMessages)
    // Remove the loading message
    loadedMessages.pop()
    const botMessage = toBotMessage(answer)
    loadedMessages.push(botMessage)
    setMessages(loadedMessages)
    setAnnouncement(`Message from Bot: ${answer}`)
    setIsSendButtonDisabled(false)
  }

  const reject = () => {
    console.log('Rejected')

    setIsSendButtonDisabled(true)
    const newMessages: MessageProps[] = []
    newMessages.push(...messages)
    newMessages.push({ id: generateId(), role: 'user', content: 'Rejected', name: 'User', avatar: userAvatar })
    setMessages(newMessages)
    setIsSendButtonDisabled(false)
  }

  return (
    <ChatbotFooter>
      <MessageBar
        onSendMessage={m => handleSend(String(m))}
        hasAttachButton={false}
        isSendButtonDisabled={isSendButtonDisabled}
      />
    </ChatbotFooter>
  )
}

