import { karin, Cfg } from 'node-karin'
import lodash from 'lodash'
import { Config } from '#lib'
import { Render } from '#components'

const cfgMap = {
  黑名单用户: 'App_BlackList.users',
  黑名单群: 'App_BlackList.groups',
  白名单用户: 'App_WhiteList.users',
  白名单群: 'App_WhiteList.groups',
  日志等级: 'config_log4jsCfg.level',
}

const CfgReg = `^#?(Karin|karin|卡莲)设置\\s*(${lodash.keys(cfgMap).join('|')})?\\s*(.*)$`

export const set = karin.command(CfgReg, async (e) => {
  const reg = new RegExp(CfgReg).exec(e.msg)
  if (reg && reg[2]) {
    let val = reg[3] || ''
    let cfgKey = cfgMap[reg[2]]
    if (cfgKey == 'config_log4jsCfg.level') {
			let level = ['trace', 'debug', 'info', 'warn', 'fatal', 'mark', 'error', 'off']
			if (!level.includes(val)) {
				e.reply('请输入正确的日志等级，可选：\ntrace,debug,info,warn,fatal,mark,error,off', true)
				return true;
			}
		} else if (val.includes('开启') || val.includes('关闭')) {
      val = !/关闭/.test(val)
    } else {
      cfgKey = ''
    }

    if (cfgKey) {
      setCfg(cfgKey, val)
    }
  }

  const cfg = {}
  for (const name in cfgMap) {
    const key = cfgMap[name].split('_')[1].replace('.', '_')
    cfg[key] = getStatus(cfgMap[name])
  }

  // 渲染图像
  const base64 = await Render.render('admin/index', {
    ...cfg,
  }, { e, scale: 1 })

  await e.reply(base64)
}, { permission: 'master' })

// function setCfg (rote, value, def = false) {
//   const arr = rote?.split('_') || []
//   if (arr.length > 0) {
//     const type = arr[0]; const name = arr[1]
//     const data = Cfg.getYaml(def ? 'defSet' : 'config', type) || {}
//     data[name] = value
//     Config.save(type, def ? 'defSet' : 'config', data)
//   }
// }

const setCfg = function (rote, value, def = false) {
  const arr = rote?.split('_') || []
  if (arr.length > 0) {
    const type = arr[0]; const name = arr[1]
    Config.save(type, def ? 'defSet' : 'config', name, value)
  }
}

const getStatus = function (rote, def = false) {
  let _class = 'cfg-status'
  let value = ''
  const arr = rote?.split('_') || []
  if (arr.length > 0) {
    const type = arr[0]; const name = arr[1]
    const data = Cfg.getYaml(def ? 'defSet' : 'config', type) || {}
    const keys = name.split('.')
    let datas = data
for (const types of keys) {
  datas = datas[types];
}
    if (datas === true || datas === false) {
      _class = datas === false ? `${_class}  status-off` : _class
      value = datas === true ? '已开启' : '已关闭'
    } else {
      value = datas
    }
  }
  if (!value) {
    _class = `${_class}  status-off`
    value = '已关闭'
  }

  return `<div class="${_class}">${value}</div>`
}
