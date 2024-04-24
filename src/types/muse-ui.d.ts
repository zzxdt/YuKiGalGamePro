import { createApp, h, App as VueApp, VNode } from 'vue'
import { CreateDialogOptions, BasicDialogOptions, ConfirmDialogOptions } from 'vuetify3-dialog'
export type MessageModel = 'alert' | 'prompt' | 'confirm'
export type MessageType = '' | 'success' | 'info' | 'warning' | 'error'
export type CreateElementFunc = () => VNode
export type BeforeCloseFunction = (result: boolean, modal: any, close: () => void) => any
interface ValidatorResult {
  valid: boolean
  message: string
}
interface MessageReturn {
  result: boolean
  value?: string | number
}
type Validator = (value: string | number) => ValidatorResult
export interface MessageOptions {
  successIcon?: string
  infoIcon?: string
  warningIcon?: string
  errorIcon?: string
  title?: string
  icon?: string
  iconSize?: number
  mode?: MessageModel
  type?: MessageType
  content?: string | CreateElementFunc
  width?: number | string
  maxWidth?: number | string
  className?: string
  transition?: string
  beforeClose?: BeforeCloseFunction
  okLabel?: string
  cancelLabel?: string
  inputType?: string
  inputPlaceholder?: string
  inputValue?: string | number
  validator?: Validator
}
declare module '@vue/runtime-core' {
  export interface Vue {
    $message(options: MessageOptions): Promise<MessageReturn>
    $alert(content: string, options: MessageOptions): Promise<MessageReturn>
    $alert(content: string, title: string, opotions: MessageOptions): Promise<MessageReturn>
    $confirm(content: string, options: MessageOptions): Promise<MessageReturn>
    $confirm(content: string, options: MessageOptions, title: string): Promise<MessageReturn>
    $prompt(content: string, options: MessageOptions): Promise<MessageReturn>
    $prompt(content: string, options: MessageOptions, title: string): Promise<MessageReturn>
    $toast: Toast
    $dialog: {
      create: (options: CreateDialogOptions) => Promise<string>;
      warn: (options: BasicDialogOptions) => Promise<string>;
      error: (options: BasicDialogOptions) => Promise<string>;
      info: (options: BasicDialogOptions) => Promise<string>;
      success: (options: BasicDialogOptions) => Promise<string>;
      confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
    };
  }
}
export type ToastPosition =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
export interface ToastAction {
  action: string | VNode
  click: (id: string) => any
}
export interface ToastOptions {
  message?: string
  time?: number
  position?: ToastPosition
  close?: boolean
  icon?: string
  actions?: ToastAction[]
  color?: string
  textColor?: string
  closeIcon?: string
  successIcon?: string
  infoIcon?: string
  warningIcon?: string
  errorIcon?: string
}
export interface Toast {
  install(app: VueApp, options?: ToastOptions): void
  config(options: ToastOptions): ToastOptions
  message(options: ToastOptions): string
  success(message: string): string
  success(options: ToastOptions): string
  info(message: string): string
  info(options: ToastOptions): string
  warning(message: string): string
  warning(options: ToastOptions): string
  error(message: string): string
  error(options: ToastOptions): string
  close(id: string): void
}
