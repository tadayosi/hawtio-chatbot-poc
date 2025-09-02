import { MessageProps } from '@patternfly/chatbot'
import { createContext, Dispatch } from 'react'
import { LangChainModel, MODELS } from './model'

export type ChatContext = {
  model: LangChainModel,
  setModel: Dispatch<React.SetStateAction<LangChainModel>>,
  messages: MessageProps[],
  setMessages: Dispatch<React.SetStateAction<MessageProps[]>>,
  announcement: string,
  setAnnouncement: Dispatch<React.SetStateAction<string>>,
  isDrawerOpen: boolean,
  setIsDrawerOpen: Dispatch<React.SetStateAction<boolean>>
}

export const ChatContext = createContext<ChatContext>({
  model: new LangChainModel(MODELS[0]!),
  setModel: () => {},
  messages: [],
  setMessages: () => {},
  announcement: '',
  setAnnouncement: () => {},
  isDrawerOpen: false,
  setIsDrawerOpen: () => {}
})
