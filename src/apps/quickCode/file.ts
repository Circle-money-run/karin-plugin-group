import fs from 'node:fs'
import path from 'node:path'
import { karin, common, logger } from 'node-karin'

export const FileDownload = karin.command(/^文件下载/, async (e) => {
  e.reply('请发送文件', { at: true })
  const event = await karin.ctx(e)
  const file = JSON.parse(event.msg)
  const Path = `${e.msg.replace(/文件下载/, '').trim() || process.cwd()}/${file.name}`
  if (!(file.type === 'file')) {
    e.reply('未识别到文件，取消操作', { at: true })
    return true
  }
  let url
  if (!e.isGroup) {
    url = await (e.bot as any).super.pickFriend(e.userId).getFileUrl(file.fid)
  } else {
    url = await (e.bot as any).super.pickGroup(e.groupId).getFileUrl(file.fid)
  }
  if (!url) {
    e.reply('获取链接失败', { at: true })
    return true
  }
  await e.reply(`检测到文件，开始下载...\n文件的链接为:\n${url}\n保存的路径为:\n${Path}`)
  try {
    await common.downFile(url, Path)
    await e.reply('安装完成')
  } catch (error) {
    logger.error(`文件下载错误: ${error}`)
    await e.reply('文件下载错误：请前往控制台查询', { reply: true })
  }
  return true
}, { name: '文件下载', priority: -1, permission: 'master' })

export const UploadDownload = karin.command(/^文件上传/, async (e) => {
  let Path = e.msg.replace(/文件上传/, '').trim()
  if (!Path) {
    await e.reply('请发送路径', { at: true })
    const event = await karin.ctx(e)
    Path = event.msg
  }

  if (!(fs.existsSync(Path))) {
    await e.reply('文件不存在', { reply: true })
    return true
  }

  await e.reply('开始上传文件', { reply: true })
  try {
    const name = path.basename(Path)
    await e.bot.uploadFile(e.contact, Path, name)
    await e.reply('上传完成', { reply: true })
  } catch (error) {
    logger.error(`文件上传错误：${error}`)
    await e.reply('文件下载错误：请前往控制台查询', { reply: true })
  }
  return true
}, { name: '文件上传', priority: -1, permission: 'master' })

export const FileMove = karin.command(/^文件移动/, async (e) => {
  await e.reply('请发送文件路径', { at: true })
  const Path1 = await karin.ctx(e)
  const Path = Path1.msg
  const name = path.basename(Path)
  await e.reply('请发送移动路径', { reply: true })
  const Path2 = await karin.ctx(e)
  let FinalPath = Path2.msg
  if (FinalPath === '') FinalPath = process.cwd()
  if (!(fs.existsSync(Path))) {
    e.reply('文件不存在', { reply: true })
    return true
  }
  await e.reply('开始移动文件', { reply: true })
  try {
    await fs.promises.rename(Path, `${FinalPath}/${name}`)
    await e.reply(`移动完成，文件原位置:\n${process.cwd()}/${Path}\n文件当前位置:\n${FinalPath}/${name}`, { reply: true })
  } catch (error) {
    logger.error('文件移动错误：')
    logger.error(error)
    await e.reply('文件下载错误：请前往控制台查询', { reply: true })
  }
  return true
}, { name: '文件上传', priority: -1, permission: 'master' })
