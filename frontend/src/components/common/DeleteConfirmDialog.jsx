import React from "react";

function DeleteConfirmDialog({
  deleteItemId,
  handleDeleteConfirm,
  setDeleteItemId,
}) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        deleteItemId ? "" : "hidden"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-6 max-w-sm w-full relative">
        <h3 className="text-white text-lg font-semibold mb-4">Delete Item</h3>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteItemId(null)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:ring focus:ring-purple-500"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring focus:ring-red-500"
            aria-label="Delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmDialog;
