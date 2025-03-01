"use client"

import React, { ReactNode } from "react";
import { Drawer, DrawerContent } from "./drawer";

type FTBDrawerContext = {
    state: "open" | "closed",
    open: boolean,
    component: ReactNode,
    setDrawerComponent: (component: ReactNode) => void,
    setOpen: (open: boolean) => void,
    toggleDrawer: () => void
}

const FTBDrawerContext = React.createContext<FTBDrawerContext | null>(null);

function useFTBDrawer () {
    const context = React.useContext(FTBDrawerContext);
    if (!context) {
        throw new Error("useDrawer must be used within a DrawerProvider.");
    }

    return context;
}

function FTBDrawerProvider({
    defaultOpen = false,
    open: openProp,
    onOpenChange: setOpenProp,
    component: componentProp,
    setDrawerComponent: setDrawerComponentProp,
    children
}: React.ComponentProps<"div"> & {
    defaultOpen?: boolean,
    open?: boolean,
    component?: ReactNode,
    onOpenChange?: (open: boolean) => void,
    setDrawerComponent?: (component: ReactNode) => void
}) {
    const [_open, _setOpen] = React.useState(defaultOpen);
    const [_component, _setComponent] = React.useState<ReactNode | null>(null);
    const open = openProp ?? _open;
    const component = componentProp ?? _component;
    const setOpen = React.useCallback((value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
            setOpenProp(openState);
        } else {
            _setOpen(openState);
        }
    },
    [setOpenProp, open]
    )

    const setDrawerComponent = React.useCallback((value: ReactNode | ((value: ReactNode) => ReactNode)) => {
        const componentState = typeof value === "function" ? value(component) : value;
        if (setDrawerComponentProp) {
            setDrawerComponent(componentState)
        } else {
            _setComponent(componentState)
        }
    }, [setDrawerComponentProp, component])

    const toggleDrawer = React.useCallback(() => {
        return setOpen((open) => !open);
    }, [setOpen])

    const state = open ? "open" : "closed";

    const contextValue = React.useMemo<FTBDrawerContext>(() => ({
        state,
        open,
        component,
        setDrawerComponent,
        setOpen,
        toggleDrawer
    }), [state, open, component,setOpen, toggleDrawer])

    return (
        <FTBDrawerContext.Provider value={contextValue}>
            <>
                {children}
            </>
        </FTBDrawerContext.Provider>
    )
}

function FTBDrawer ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof Drawer> & { className?: string}) {
    const { open, setOpen, component } = useFTBDrawer();

    return (
        <Drawer open={open} onOpenChange={setOpen} modal={true} {...props} handleOnly={true}>
            <DrawerContent>
                {component}
            </DrawerContent>
        </Drawer>
    )
}

export {
    FTBDrawer,
    FTBDrawerProvider,
    useFTBDrawer
}