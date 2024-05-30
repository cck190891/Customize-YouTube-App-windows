import { Window  } from '@tauri-apps/api/window'
import { tray ,traymenu , Menu_hidecontroller ,Menu_showcontroller } from './trayicon'
import { TauriEvent } from '@tauri-apps/api/event'
import { MenuItem  } from "@tauri-apps/api/menu";

export function html_result_listen() {
    
        const controller_window = Window.getByLabel('Controller')!
        controller_window.listen('tauri://html-result', async(e : any) => {
            if (e.payload.label == 'Controller') return
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
        
        controller_window.listen("Controller://show", async () => {
            if (!(await controller_window.isVisible())){

                traymenu!.remove(Menu_showcontroller!);
                traymenu!.insert(Menu_hidecontroller!,(await traymenu!.items()).length-1);
                tray!.setMenu(traymenu)
            }
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

export default html_result_listen;

