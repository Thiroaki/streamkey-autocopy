import { app, BrowserWindow, Menu, Tray } from "electron"
import path from "path"
import startup from "./startup"
import streamkeycopy from "./streamkeycopy"
import updater from "./update"

//二重起動防止
if (!app.requestSingleInstanceLock()) app.quit()

/**
 * BrowserWindow
 */
const createWindow = () => {
  const mainWindow = new BrowserWindow({})
  if (process.env.NODE_ENV === "dev") {
    mainWindow.webContents.openDevTools({ mode: "detach" })
  }
}

/**
 * トレイアイコン
 */
let tray: Tray
let contextMenu: Menu

function onClickTray(menu: Menu) {
  if (updater.getAvailable()) {
    const item =
      menu.items.find((item) => item.id == "update-notify") || menu.items[1]
    item.visible = true
  }
  updater.checkUpdate()
}

const createTray = () => {
  contextMenu = Menu.buildFromTemplate([
    {
      id: "title",
      enabled: false,
      label: `${app.name} v${process.env.npm_package_version}`,
    },
    {
      id: "update-notify",
      label: "新しいバージョンがあります。",
      visible: updater.getAvailable(),
      click() {
        updater.tryUpdate()
      },
    },

    { type: "separator" },

    {
      type: "checkbox",
      id: "autocopy",
      label: "ストリームキー自動コピー",
      checked: streamkeycopy.getEnable(),
      click(menuItem) {
        streamkeycopy.toggleEnable().then((state) => {
          menuItem.checked = state
        })
      },
    },
    {
      type: "checkbox",
      id: "startup",
      label: "スタートアップ",
      checked: startup.getStartup(),
      click(menuItem) {
        startup.toggleEnable().then((state) => {
          menuItem.checked = state
        })
      },
    },

    { type: "separator" },

    {
      label: "終了",
      id: "exit",
      click() {
        app.quit()
      },
    },
  ])

  tray = new Tray(path.join(__dirname, "../resource/keycopy_icon.ico"))
  tray.setToolTip(app.name)

  // 左右クリック時にもコンテキストメニューを表示
  tray.setContextMenu(contextMenu)
  tray.on("click", () => tray.popUpContextMenu())
  contextMenu.addListener("menu-will-show", () => onClickTray(contextMenu))
}

/**
 * appの動作
 */
app.whenReady().then(async () => {
  updater.checkUpdate()
  streamkeycopy.enable()
  createTray()
})
