'use client'

import { cn } from "lib/utils";

type ActionType = {
    toggleEdit: () => void
    loading: boolean
}

export function Actions({
    toggleEdit,
    loading
}: ActionType) {

    return (
        <div className="flex justify-end gap-3 text-sm mt-5">
            <button
                onClick={toggleEdit}
                disabled={loading}
                className="cursor-pointer hover:text-gray-800">
                Discard
            </button>
            <button
                type="submit"
                disabled={loading}
                className={cn(
                    "px-4 py-2 text-white rounded-lg",
                    loading ? 
                    'pointer-events-none bg-blue-400' :
                     'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                )}
            >
                {loading ?
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" /> :
                    <span>Save</span>
                }
            </button>
        </div>
    );
}


