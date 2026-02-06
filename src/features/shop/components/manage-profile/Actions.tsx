'use client'

import { Button } from "@/components/ui/button";

type ToggleEditType = {
    toggleEdit: () => void
}

export function Actions({
    toggleEdit,
}: ToggleEditType) {

    return (
        <div className="flex justify-end gap-3 text-sm mt-5">
            <button
                onClick={toggleEdit}
                className="cursor-pointer hover:text-gray-800">
                Discard
            </button>
            <Button
                type="submit"
                text={'Save'}
            />
        </div>
    );
}


