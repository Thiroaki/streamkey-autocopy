/**
 * VRChatのログからTopazChatのストリームキーをコピーするやつ
 */

/* メモ
  トパチャのURL 'rtspt://topaz.chat/live/streamkey'
  ログの形式    '2021.05.13 21:34:24 Log        -  [AVProVideo] Opening rtspt://topaz.chat/live/Yellowdvx3 (offset 0) with API MediaFoundation'
*/

import { exec } from "child_process"
import VrcLogCatcher from "vrc-log-catcher"

const regTopazchatUrl =
  /rtsp[tu]?:\/\/topaz\.chat\/live\/[\w!\(\)%#\$&\?\(\)~=\+\-]+/
const regTopazchatLog = /\[AVProVideo\] Opening rtsp[tu]?:\/\/topaz.chat\/live/g
const logWatcher = new VrcLogCatcher()

/**
 * クリップボードにコピー
 */
function sendClipboardText(text: string) {
  exec(`echo ${text} | clip`)
}

function getStreamUrl(text: string) {
  let url = ""
  if (regTopazchatUrl.test(text)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url = text.match(regTopazchatUrl)![0]
  }
  return url
}

function getStreamKeyTopazchat(streamUrl: string): string {
  const key = new URL(streamUrl).pathname.split("/").pop()
  if (key) return key
  return ""
}

function matchTopazchatLog(logs: string[]) {
  return logs.filter((line) => regTopazchatLog.test(line))
}

/**
 * ファイル監視のコールバック
 */
function onLogUpdated(lines: string[]) {
  //console.log(`${lines.length} logs added`)
  const topazLog = matchTopazchatLog(lines)
  if (topazLog.length == 0) return

  // 全部コピー
  topazLog.forEach((log) => {
    const streamkey = getStreamKeyTopazchat(getStreamUrl(log))
    // TODO: オプトアウト実装
    sendClipboardText(streamkey)

    // debug
    console.log(`key: ${streamkey}`)
  })
}

/**
 * オンオフ系
 */
let isAutoCopy = false
function getEnable() {
  return isAutoCopy
}

function enable() {
  logWatcher.regist(onLogUpdated)
  isAutoCopy = true
}

function disable() {
  logWatcher.unregist(onLogUpdated)
  isAutoCopy = false
}

async function toggleEnable(): Promise<boolean> {
  if (isAutoCopy) {
    disable()
  } else {
    enable()
  }
  return isAutoCopy
}

export default {
  enable,
  disable,
  getEnable,
  toggleEnable,
}
