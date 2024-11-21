import { logger } from 'node-karin'
import { Config } from '@/components'

const ProhibitedWords = async (e: { isGroup: any; group_id: any; msg: string | any[]; sender: { role: string }; isMaster: any; bot: { RecallMessage: (arg0: any, arg1: any) => any }; contact: any; message_id: any; reply: (arg0: string, arg1: { at: boolean }) => any }) => {
  if (!e.isGroup) {
    logger.debug('不在群聊，跳过监听')
    return false
  }
  let type = e.group_id
  let data = Config.getYaml('config', 'group')
  type = data[`${type}`] ? type : 'default'
  let rules = (data[`${type}`] && data[`${type}`]['enable']) || ''
  if (!rules) return false
  let words = data[`${type}`]['words']
  let match = data[`${type}`]['rule']
  if (match == 0 && words.some((word: any) => e.msg.includes(word))) {
    if ((['owner', 'admin'].includes(e.sender.role) || e.isMaster)) {
    return false
    } else {
    await e.bot.RecallMessage(e.contact, e.message_id)
    await e.reply('请不要发布违规内容', {at: true})
    return true
    }
  }
  if (match == 1 && words.some((word: string | any[]) => e.msg === word)) {
    if ((['owner', 'admin'].includes(e.sender.role) || e.isMaster)) {
    return false
    } else {
    await e.bot.RecallMessage(e.contact, e.message_id)
    await e.reply('请不要发布违规内容', {at: true})
    return true
    }
  }
}

export default {
  ProhibitedWords,
}
