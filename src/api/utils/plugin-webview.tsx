
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
// import { Window } from '@tauri-apps/api/window'
import { TauriEvent } from '@tauri-apps/api/event'
import { tray ,traymenu} from '../trayicon'
import { MenuItem  } from "@tauri-apps/api/menu";
let new_label:string
let label = (Math.floor(Math.random() * 1000))

const create_webviewwindow =async (url:string,input_label='') => {
    if (input_label == 'Controller'){
        new_label = input_label
    }else{
        new_label = `main-${label}`;
    }
    while (Object.values(window.__TAURI_INTERNALS__.metadata.windows).some(window => window.label === new_label)) {
        label++;
        new_label = `main-${label}`;
    }

    const webview_window = new WebviewWindow(new_label, {
        url: url,
    });

    webview_window.once('tauri://created', async function () {

        window.__TAURI_INTERNALS__.metadata.webviews.push({ windowLabel: new_label, label: new_label })
        window.__TAURI_INTERNALS__.metadata.windows.push({ label: new_label })
    });
        


    webview_window.listen(TauriEvent.WINDOW_RESIZED, async (e:any) => {
        console.log('isHidetotrayEnabled:',localStorage.getItem("isHidetotrayEnabled") === "true" )
        if (e.payload.height == 0 && e.payload.width == 0 && localStorage.getItem("isHidetotrayEnabled") === "true"){
            console.log('TauriEvent.WINDOW_RESIZED tester',e)

            await webview_window.hide();

            let window_show = await MenuItem.new({
                id: webview_window.label,
                text: await webview_window.title(),
                enabled: true,
                action: async() => {
                    await  webview_window.show();
                    console.log('show:')
                    // setFocus has issue
                    // cant bring this window to front
                    await  webview_window.setFocus();
                    console.log('setFocus:')

                    traymenu!.remove(window_show);
                }
            })
            traymenu!.insert(window_show,0);
            console.log('windows_show:', window_show)
            tray!.setMenu(traymenu)
        }
    })


    webview_window.once('tauri://error', function (e) {
        console.log('error requested:', e)
        console.log('window.__TAURI_INTERNALS__.metadata.windows:', window.__TAURI_INTERNALS__.metadata.windows)
        console.log('window.__TAURI_INTERNALS__.metadata.webviews:', window.__TAURI_INTERNALS__.metadata.webviews)
    });

    return new_label
}

export { create_webviewwindow }