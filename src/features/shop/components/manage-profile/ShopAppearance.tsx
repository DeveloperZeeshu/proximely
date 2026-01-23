'use client'

import { Pencil } from "lucide-react";
import { Actions } from "./Actions";
import { useState } from "react";

export const ShopAppearance = () => {
    const [toEdit, setToEdit] = useState<boolean>(false)

    const cancelEdit = () => {

    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Shop Appearance</h3>

                {!toEdit &&
                    <div
                        onClick={() => setToEdit(true)}
                        className="text-sm flex items-center gap-1 cursor-pointer hover:text-gray-800">
                        <Pencil size={14} />
                        <span>Edit</span>
                    </div>}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Logo Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shop Logo
                    </label>

                    <div className="flex items-center gap-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-23 w-23 flex items-center justify-center bg-gray-50">
                            <span className="text-sm text-gray-400">
                                Logo Preview
                            </span>
                        </div>

                        <div>
                            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                Change Logo
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                                JPG, PNG or GIF. Max 2MB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Banner Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Image
                    </label>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center bg-gray-50">
                        <span className="text-sm text-gray-400">
                            Banner Preview
                        </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                            Update Banner
                        </button>
                        <span className="text-xs text-gray-500">
                            Recommended: 1200 × 400px
                        </span>
                    </div>
                </div>

            </div>

            {toEdit &&
                <Actions
                    toggleEdit={cancelEdit}
                />}
        </div>
    );
}