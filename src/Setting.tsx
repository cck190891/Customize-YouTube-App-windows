import { useEffect,  useState } from 'preact/hooks';


export default function Setting() {

    // ADblock
    const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(localStorage.getItem("isAdBlockEnabled") === "true");
    useEffect(() => {
      async function run() {
        if (isAdBlockEnabled) {
                localStorage.setItem("isAdBlockEnabled", "true");
            } else {
                localStorage.setItem("isAdBlockEnabled", "false");
            }
        }
        run();
    }, [isAdBlockEnabled]);

    // Nonstop 
    const [isNonstopEnabled, setIsNonstopEnabled] = useState(localStorage.getItem("isNonstopEnabled") === "true");
    useEffect(() => {
      async function run() {
        if (isNonstopEnabled) {
                localStorage.setItem("isNonstopEnabled", "true");
            } else {
                localStorage.setItem("isNonstopEnabled", "false");
            }
        }
        run();
    }, [isNonstopEnabled]);

    // HD1080
    const [isAutohdEnabled, setIsAutohdEnabled] = useState(localStorage.getItem('isAutohdEnabled') === 'true');
    useEffect(() => {
      async function run() {
        if (isAutohdEnabled) {
                localStorage.setItem('isAutohdEnabled', 'true');
            } else {
                localStorage.setItem('isAutohdEnabled', 'false');
            }
        }
        run();
    }, [isAutohdEnabled]);

    // yt page hide to trayicon
    const [isHidetotrayEnabled, setIsHidetotrayEnabled] = useState(localStorage.getItem('isHidetotrayEnabled') === 'true');
    useEffect(() => {
      async function run() {
        if (isHidetotrayEnabled) {
                localStorage.setItem('isHidetotrayEnabled', 'true');
            } else {
                localStorage.setItem('isHidetotrayEnabled', 'false');
            }
        }
        run();
    }, [isHidetotrayEnabled]);

    const [isScriptpathEnabled, setIsScriptpathEnabled] = useState(localStorage.getItem('isScriptpathEnabled') ? localStorage.getItem('isScriptpathEnabled'): "https://raw.githubusercontent.com/TheRealJoelmatic/RemoveAdblockThing/main/Youtube-Ad-blocker-Reminder-Remover.user.js");
    useEffect(() => {
      async function run() {
          localStorage.setItem('isScriptpathEnabled', isScriptpathEnabled!);
          if (isScriptpathEnabled == "") {
              setIsScriptpathEnabled("https://raw.githubusercontent.com/TheRealJoelmatic/RemoveAdblockThing/main/Youtube-Ad-blocker-Reminder-Remover.user.js") 
            }
        }
        run();
    }, [isScriptpathEnabled]);
    return (
        <>
            <p>adb(need reopen)</p>
            <input
                type="checkbox"
                defaultChecked={isAdBlockEnabled}
                onChange={(e) => setIsAdBlockEnabled((e.target as HTMLInputElement).checked)}
            />
            {isAdBlockEnabled && <><p>// From : https://github.com/TheRealJoelmatic/RemoveAdblockThing/tree/main</p>
            <p>// https://github.com/TheRealJoelmatic/RemoveAdblockThing/blob/main/Youtube-Ad-blocker-Reminder-Remover.user.js</p>
            <p>u can use self cdn file
            <input type="text"   value={isScriptpathEnabled!}  onChange={(e) => setIsScriptpathEnabled((e.target as HTMLInputElement).value)}></input></p>

            <p>Nonstop</p>
            <input
                type="checkbox"
                defaultChecked={isNonstopEnabled}
                onChange={(e) => setIsNonstopEnabled((e.target as HTMLInputElement).checked)}
            /></>
            }

            <p>auto 1080p</p>
            <input
                type="checkbox"
                defaultChecked={isAutohdEnabled}
                onChange={(e) => setIsAutohdEnabled((e.target as HTMLInputElement).checked)}
            />

            <p>yt page hide to trayicon</p>
            <input
                type="checkbox"
                defaultChecked={isHidetotrayEnabled}
                onChange={(e) => setIsHidetotrayEnabled((e.target as HTMLInputElement).checked)}
            />

        </>
    );
}





