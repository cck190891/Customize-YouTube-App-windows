
import Setting from './Setting';
import { init_tray } from './api/trayicon';
import Listen_event from './api/listen';
import { create_webviewwindow } from './api/utils/plugin-webview';
import { useEffect, useState } from 'preact/hooks';


function App() {

  document.title = 'Controller'
  document.addEventListener('keydown', function (event) {
    // Prevent F5 or Ctrl+R (Windows/Linux) and Command+R (Mac) from refreshing the page
    if (
      event.key === 'F5' ||
      (event.ctrlKey && event.key === 'r') ||
      (event.metaKey && event.key === 'r')
    ) {
      event.preventDefault();
    }
  });
  document.addEventListener('contextmenu', function (event) {
    // Prevent context menu from showing up
    console.log('contextmenu:', event)
    event.preventDefault();
  });


  useEffect(() => {
    init_tray();
    Listen_event();
    create_webviewwindow('https://www.youtube.com/');
  }, []);

  const [url, setURL] = useState('');

  return (
    <>
      <div>
        <button           
          type="button"
          onClick={() => create_webviewwindow("https://www.youtube.com/")}>
          new page
        </button>
        <button
          type="button"
          onClick={() =>
            create_webviewwindow("https://www.youtube.com/feed/history")
          }
        >
          history
        </button>
        <button
          type="button"
          onClick={() =>
            create_webviewwindow("https://www.youtube.com/feed/playlists")
          }
        >
          playlists
        </button>
      </div>
      <input type="text" value={url} onChange={(e) => setURL((e.target as HTMLInputElement).value)} />
      <button
          type="button"
          onClick={() =>
            create_webviewwindow(url||"https://www.youtube.com/")
          }
      >open url</button>
        
      <Setting />
    </>
  );
}
export default App;

