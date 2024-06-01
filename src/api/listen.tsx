import { Window  } from '@tauri-apps/api/window'
import { tray ,traymenu , Menu_hidecontroller ,Menu_showcontroller } from './trayicon'
import { TauriEvent } from '@tauri-apps/api/event'
import { MenuItem  } from "@tauri-apps/api/menu";
import { invoke } from '@tauri-apps/api/core';
import {
    sent_windows_info,
    sent_xhr_fetch, 
    sent_disable_element, 
    sent_nonstop, 
    sent_hd1080,
    sent_f11_event,
    sent_MutationObserver_event
} from './eval';
export function Listen_event() {
        const controller_window = Window.getByLabel('Controller')!
        controller_window.listen('tauri://html-result', async(e : any) => {
            let setWindow = Window.getByLabel(e.payload.label)!
            if (await setWindow.title() != e.payload.title){
                setWindow.setTitle(e.payload.title)

                if (!(await setWindow.isVisible())){
                    const items = await traymenu?.items()
                    const item = items?.find((item:any) => item.id == e.payload.label)
                    if (item){
                        console.log('item:',item)
                        let newmenu = await MenuItem.new({
                            id: e.payload.label,
                            text: e.payload.title,
                            enabled: true,
                            action: async() => {
                                await  setWindow.show();
                                await  setWindow.unminimize();
                                await  setWindow.setFocus();
                                traymenu!.remove(newmenu);
                            }
                        })
                        traymenu!.insert(newmenu,0);
                        traymenu!.remove(item);
                        tray!.setMenu(traymenu)
                    }
                }
            }
        })
        controller_window.listen('tauri://html-reload', async(e : any) => {
            setTimeout(async() => {
                await invoke('do_eval', { label: e.payload.label, jscode: sent_windows_info(e.payload.label) });
                await invoke('do_eval', { label: e.payload.label, jscode: sent_xhr_fetch() });
                await invoke('do_eval', { label: e.payload.label, jscode: sent_disable_element() });
                await invoke('do_eval', { label: e.payload.label, jscode: sent_nonstop() });
                await invoke('do_eval', { label: e.payload.label, jscode: sent_hd1080() });
                await invoke('do_eval', { label: e.payload.label, jscode: sent_f11_event(e.payload.label) });
                await invoke('do_eval', { label: e.payload.label, jscode: sent_MutationObserver_event(e.payload.label) });
                setInterval(async() => {
                    await invoke('do_eval', { label: e.payload.label, jscode: sent_nonstop() });
                    await invoke('do_eval', { label: e.payload.label, jscode: sent_hd1080() });
                }, 30000);
            }, 500);
        })
        controller_window.listen("tauri://F11", async (e:any) => {
            const msg_window = Window.getByLabel(e.payload.label)!;
            if (await msg_window.isFullscreen()) {
                await msg_window.setFullscreen(false);
            }else{
                await msg_window.setFullscreen(true);
            }
        })        

        controller_window.listen("tauri://mutationObserver", async (e:any) => {
            if(localStorage.getItem("isAdBlockEnabled") === "true"){
                await invoke('do_eval', { label: e.payload.label, jscode: sent_disable_element() });
            }
        })

        controller_window.listen("Controller://show", async (e:any) => {
            console.log('e.payload.args:', e.payload.args)
            if (!(e.payload.args)){
                traymenu!.remove(Menu_showcontroller!);
                traymenu!.insert(Menu_hidecontroller!,(await traymenu!.items()).length-1);
                tray!.setMenu(traymenu)
            }

            
        })
        controller_window.listen("Controller://create", async () => {
            if (!(await controller_window.isVisible())){

                traymenu!.remove(Menu_showcontroller!);
                traymenu!.insert(Menu_hidecontroller!,(await traymenu!.items()).length-1);
                tray!.setMenu(traymenu)
            }
        })
        controller_window.listen("tauri://testmsg", async (e:any) => {
            console.log('tauri://testmsg:', e.payload.status)
        })


        controller_window.listen(TauriEvent.WINDOW_RESIZED, async (e:any) => {
            if (e.payload.height == 0 && e.payload.width == 0 ){
                console.log('TauriEvent.WINDOW_RESIZED controller')
                traymenu!.remove(Menu_hidecontroller!);
                traymenu!.insert(Menu_showcontroller!,(await traymenu!.items()).length-1);
                tray!.setMenu(traymenu)
                await controller_window.hide()
            } 
        })

        controller_window.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
            window.__TAURI_INTERNALS__.metadata.webviews.map(async(value) => {
                if (value.label != "Controller") {
                    await Window.getByLabel(value.label)!.destroy();
                }
                await controller_window.destroy()
            })
        })
}

export default Listen_event;

