'use client'

interface Props {
    children?: React.ReactNode,
    isOpen: boolean,
    closeDrawer: Function
}

function useSetDrawerState(open: boolean, closeDrawer: Function) {
    const drawerOpenedUrlKey = "drawerOpened"
    if(typeof window != "undefined") {
        const url = new URL(window.location.href);
        window.addEventListener("popstate", () => {
            if (!url.searchParams.has(drawerOpenedUrlKey)) {
                closeDrawer()
                return;
            }
        });
    
        if (open) {
            document.body.classList.add("overflow-hidden");
            history.pushState(null, "", `?${drawerOpenedUrlKey}`);
        } else {
            document.body.classList.remove("overflow-hidden");
            if (url.searchParams.has(drawerOpenedUrlKey)) {
                url.searchParams.delete(drawerOpenedUrlKey)
                history.replaceState(null, "", url)
            }
        }
    }
}

export default function Drawer({ children, isOpen, closeDrawer }: Props) {
    useSetDrawerState(isOpen, closeDrawer);

    return (
        <div className={`fixed inset-x-0 bottom-0 h-full transition-all z-10 backdrop-blur-sm ${!isOpen ? 'translate-y-full' : ''}`} onClick={() => closeDrawer()}>
            <div className="h-full relative">
                <div className="h-full opacity-50"></div>
                <div className="absolute bottom-0 w-full min-h-60 max-h-[80dvh] py-5 px-2 rounded-t-lg overflow-y-auto bg-background border-t" onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </div>
    )
}