import { MessageProps } from '@patternfly/chatbot'
import { createContext, Dispatch } from 'react'
import { Model, MODELS } from './model'

export type ChatContext = {
  model: Model,
  setModel: Dispatch<React.SetStateAction<Model>>,
  messages: MessageProps[],
  setMessages: Dispatch<React.SetStateAction<MessageProps[]>>,
  announcement: string,
  setAnnouncement: Dispatch<React.SetStateAction<string>>,
  isDrawerOpen: boolean,
  setIsDrawerOpen: Dispatch<React.SetStateAction<boolean>>
}

export const ChatContext = createContext<ChatContext>({
  model: new Model(MODELS[0]),
  setModel: () => {},
  messages: [],
  setMessages: () => {},
  announcement: '',
  setAnnouncement: () => {},
  isDrawerOpen: false,
  setIsDrawerOpen: () => {}
})
