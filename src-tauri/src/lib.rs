// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// use tauri::Manager;

use tauri::Manager;

#[tauri::command]
async fn do_eval(webviews: tauri::Webview, label: String, jscode: String) {
    let webviewwindow = webviews.get_webview_window(&label).unwrap();
    let _ = webviewwindow.eval(&jscode);
    // println!("{}: {}", label, jscode);
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: bool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            let window = app.get_window("Controller").unwrap();
            let is_visible = window.is_visible().unwrap();
            app.emit("Controller://show", Payload { args: is_visible })
                .unwrap();

            window.show().unwrap();
            window.unminimize().unwrap();
            window.set_focus().unwrap();
        }))
        .invoke_handler(tauri::generate_handler![do_eval])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
