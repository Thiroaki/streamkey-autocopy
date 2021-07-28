// TODO github release を確認でアップデートを検知、実行
import axios from "axios"
import { exec } from "child_process"
import { app } from "electron"

const RepoApiUrl =
  "https://api.github.com/repos/Thiroaki/streamkey-autocopy/releases/latest"
const StoreUrl = "https://booth.pm/ja/items/2969654"

interface GhRes {
  tag_name: string
}

let updateAvailable = false

function openStorePage() {
  const cmd = `start "${StoreUrl}"`
  exec(cmd, { shell: "powershell.exe" })
}

async function checkUpdate(): Promise<boolean> {
  const vlocal = `v${app.getVersion()}`
  const res = await axios.get<GhRes>(RepoApiUrl).catch((err) => {
    console.log(err.response.status)
  })
  if (res && res.data.tag_name) {
    const vremote = res.data.tag_name
    updateAvailable = vlocal < vremote
  } else {
    updateAvailable = false
  }
  return updateAvailable
}

function tryUpdate() {
  openStorePage()
}

const getAvailable = () => {
  return updateAvailable
}

export default {
  checkUpdate,
  tryUpdate,
  getAvailable,
}
