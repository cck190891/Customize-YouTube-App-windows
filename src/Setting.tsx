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
    
    return (
        <>
            <p>adb(need reload)</p>
            <input
                type="checkbox"
                defaultChecked={isAdBlockEnabled}
                onChange={(e) => setIsAdBlockEnabled((e.target as HTMLInputElement).checked)}
            />
            <p>Nonstop</p>
            <input
                type="checkbox"
                defaultChecked={isNonstopEnabled}
                onChange={(e) => setIsNonstopEnabled((e.target as HTMLInputElement).checked)}
            />

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





