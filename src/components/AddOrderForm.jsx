export default function AddOrderForm({
    showAddOrder,
    formData,
    setFormData,
    items,
 
    addItemRow,
    deleteItemRow,
    handleItemChange,
    addOrder,
    partySuggestions,
    companySuggestions,
    designSuggestions,
    gradeSuggestions,
}) {
    return (
        <>
            {/* ADD ORDER */}
            {showAddOrder && (

                <div className="bg-white p-8 rounded-2xl shadow mb-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Add New Order
                    </h2>

                    {/* MAIN ORDER INFO */}
                    <div className="grid grid-cols-2 gap-4 mb-6">

                        <div>
                            <input
                                list="party-list"
                                type="text"
                                placeholder="Party Name"
                                value={formData.party_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        party_name: e.target.value,
                                    })
                                }
                                className="border p-3 rounded-lg w-full"
                            />

                            <datalist id="party-list">
                                {partySuggestions.map((party, i) => (
                                    <option key={i} value={party} />
                                ))}
                            </datalist>
                        </div>
                        {/* ORDER DATE */}
                        <div>

                            <label className="block mb-2 font-semibold text-gray-700">
                                Order Date
                            </label>

                            <input
                                type="date"
                                value={formData.order_date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        order_date: e.target.value,
                                    })
                                }
                                className="border p-3 rounded-lg w-full"
                            />

                        </div>



                        <div>
                            <input
                                list="company-list"
                                type="text"
                                placeholder="Company Name"
                                value={formData.company_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        company_name: e.target.value,
                                    })
                                }
                                className="border p-3 rounded-lg w-full"
                            />

                            <datalist id="company-list">
                                {companySuggestions.map((company, i) => (
                                    <option key={i} value={company} />
                                ))}
                            </datalist>
                        </div>


                    </div>

                    {/* ORDER ITEMS */}
                    <h3 className="text-xl font-semibold mb-4">
                        Order Details
                    </h3>

                    {items.map((item, index) => (

                        <div
                            key={index}
                            className="grid grid-cols-5 gap-4 mb-4"
                        >

                            <div>
                                <input
                                    list="design-list"
                                    type="text"
                                    placeholder="Design Name"
                                    value={item.design_name}
                                    onChange={(e) =>
                                        handleItemChange(
                                            index,
                                            "design_name",
                                            e.target.value
                                        )
                                    }
                                    className="border p-3 rounded-lg w-full"
                                />

                                <datalist id="design-list">
                                    {designSuggestions.map((design, i) => (
                                        <option key={i} value={design} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <input
                                    list="grade-list"
                                    type="text"
                                    placeholder="Grade"
                                    value={item.Grade}
                                    onChange={(e) =>
                                        handleItemChange(
                                            index,
                                            "Grade",
                                            e.target.value
                                        )
                                    }
                                    className="border p-3 rounded-lg w-full"
                                />

                                <datalist id="grade-list">
                                    {gradeSuggestions.map((grade, i) => (
                                        <option key={i} value={grade} />
                                    ))}
                                </datalist>
                            </div>

                            <input
                                type="text"
                                placeholder="Tile Size"
                                value={item.tile_size}
                                onChange={(e) =>
                                    handleItemChange(
                                        index,
                                        "tile_size",
                                        e.target.value
                                    )
                                }
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="text"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleItemChange(
                                        index,
                                        "quantity",
                                        e.target.value
                                    )
                                }
                                className="border p-3 rounded-lg"
                            />

                            <button
                                onClick={() =>
                                    deleteItemRow(index)
                                }
                                className="bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>

                        </div>

                    ))}

                    {/* ADD ITEM BUTTON */}
                    <button
                        onClick={addItemRow}
                        className="bg-green-600 text-white px-5 py-3 rounded-lg mb-6"
                    >
                        + Add More Item
                    </button>

                    <br />

                    {/* STATUS */}
                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value,
                            })
                        }
                        className="border p-3 rounded-lg mb-4 w-full"
                    >
                        <option value="Pending">
                            Pending
                        </option>

                        <option value="In Production">
                            In Production
                        </option>

                        <option value="Ready">
                            Ready
                        </option>

                        <option value="Dispatched">
                            Dispatched
                        </option>
                    </select>



                    {/* SUBMIT BUTTON */}
                    <button
                        onClick={addOrder}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                    >
                        Save Order
                    </button>

                </div>
            )}
        </>
    );
}