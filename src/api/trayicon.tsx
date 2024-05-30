import { MenuItem, Menu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { Image } from '@tauri-apps/api/image';
import { Window  } from '@tauri-apps/api/window';
import { resolveResource } from "@tauri-apps/api/path";
import { create_webviewwindow } from "./utils/plugin-webview";
import { exit } from '@tauri-apps/plugin-process';

export let Menu_showcontroller:MenuItem | null = null;
export let Menu_hidecontroller:MenuItem | null = null;
export let Create_yt:MenuItem | null = null;
export let Close_app:MenuItem | null = null;
export let traymenu:Menu | null = null;
export let tray:TrayIcon | null = null;

export async function init_tray() {
  const icon = await Image.fromPath(await resolveResource('../src-tauri/icons/favicon.ico')); 
  Menu_showcontroller = await MenuItem.new({
    id: '1',
    text: 'Show Controller',
    enabled: true,
    action: async() => {
      const setWindow =Window.getByLabel('Controller')!
      await setWindow.show();
      await  setWindow.unminimize();

      await setWindow.setFocus();
      traymenu!.remove(Menu_showcontroller!);
      traymenu!.insert(Menu_hidecontroller!,(await traymenu!.items()).length-1);
      console.log('show controller')
    }
  })
  Menu_hidecontroller = await MenuItem.new({
    id: '2',
    text: 'Hide Controller',
    enabled: true,
    action:async () => {
      await Window.getByLabel('Controller')!.hide();
      traymenu!.remove(Menu_hidecontroller!);
      traymenu!.insert(Menu_showcontroller!,(await traymenu!.items()).length-1);
      console.log('hide controller')
    }
  })
  Create_yt = await MenuItem.new({
    id: '3',
    text: 'Create New Page',
    enabled: true,
    action: () => {
    console.log('Create New Page')
    create_webviewwindow('https://www.youtube.com/')
    }
  })
  Close_app = await MenuItem.new({
    id: '4',
    text: 'Close App',
    enabled: true,
    action: async() => {
      await exit(0)
    }
  })
  traymenu = await Menu.new(
    {
      id:"0", 
      items: await Window.getByLabel('Controller')?.isVisible()?[Create_yt,Menu_hidecontroller,Close_app]: [Create_yt,Menu_showcontroller,Close_app] 
    }
  );

  tray = await TrayIcon.new({ 
    tooltip: 'Youtube' , 
    title: 'Youtube',
    icon:icon ,
    menu: traymenu
  });
          
}