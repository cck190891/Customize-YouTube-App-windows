import { invoke } from '@tauri-apps/api/core';




async function do_eval(label:string, js_mode:Array<string>) {

    for (const single_line of js_mode) {
        invoke('do_eval', { label, jscode: single_line });
    }
}



export { do_eval }
