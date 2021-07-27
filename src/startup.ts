import { app } from "electron/main"
import path from "path"
import fs from "fs"
import util from "util"
import child_process from "child_process"
const exec = util.promisify(child_process.exec)

const StartupDir = path.join(
  app.getPath("appData"),
  "Microsoft\\Windows\\Start Menu\\Programs\\Startup",
)
const ExePath = app.getPath("exe")
const ExeName = path.basename(ExePath)
const ExePathStartup = path.join(StartupDir, ExeName) + ".lnk"

async function registStartup() {
  const makeShortcutCmd = `
  $WshShell = New-Object -ComObject WScript.Shell;
  $ShortCut = $WshShell.CreateShortcut("${ExePathStartup}");
  $ShortCut.TargetPath = "${ExePath}";
  $ShortCut.Save();
  `
  await exec(makeShortcutCmd, { shell: "powershell.exe" })
}

function unregistStartup() {
  fs.unlinkSync(ExePathStartup)
}

function getStartup(): boolean {
  return fs.existsSync(ExePathStartup)
}

async function toggleEnable(): Promise<boolean> {
  try {
    if (getStartup()) {
      unregistStartup()
    } else {
      await registStartup()
    }
    return getStartup()
  } catch (err) {
    console.log(err)
    return getStartup()
  }
}

export default {
  getStartup,
  toggleEnable,
}
