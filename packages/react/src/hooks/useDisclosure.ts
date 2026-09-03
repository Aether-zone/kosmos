import { useCallback, useMemo, useState } from 'react';

export interface Disclosure {
    open: boolean;
    setOpen: (open: boolean) => void;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
}

/** Open/close state for a Dialog, Drawer, Popover or anything else with two states. */
export function useDisclosure(defaultOpen = false): Disclosure {
    const [open, setOpen] = useState(defaultOpen);

    const onOpen = useCallback(() => setOpen(true), []);
    const onClose = useCallback(() => setOpen(false), []);
    const onToggle = useCallback(() => setOpen((current) => !current), []);

    return useMemo(
        () => ({ open, setOpen, onOpen, onClose, onToggle }),
        [open, onOpen, onClose, onToggle],
    );
}
