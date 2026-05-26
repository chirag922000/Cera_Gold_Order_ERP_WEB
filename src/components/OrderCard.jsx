export default function OrderCard({
    order,
    supabase,
    fetchOrders,
    getDaysPassed,
    shareOnWhatsApp,
    deleteOrder,
}) {

    const tableHeaderStyle = {
        border: "1px solid #ddd",
        padding: "14px",
        textAlign: "left",
    };

    const tableCellStyle = {
        border: "1px solid #ddd",
        padding: "12px",
    };
    return (
        <div className="bg-white rounded-2xl shadow p-6">

            {/* TOP */}
            <div className="flex justify-between items-center mb-4">

                <div>

                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-bold">
                            {order.party_name}
                        </h2>

                        <span className="bg-gray-200 px-3 py-1 rounded-lg text-sm font-semibold">
                            CG{order.id}
                        </span>

                    </div>

                    <p className="text-gray-500">
                        {order.company_name}
                    </p>

                    <div className="mt-2 text-sm text-gray-600">

                        <p>
                            Order Date:
                            {order.order_date || "-"}
                        </p>

                        <p>
                            Dispatch Date:
                            {order.dispatch_date || "-"}
                        </p>

                        <div className="mt-3">

                            <label className="text-sm font-semibold">
                                Update Dispatch Date
                            </label>

                            <input
                                type="date"
                                value={order.dispatch_date || ""}
                                onChange={async (e) => {

                                    const newDate = e.target.value;

                                    await supabase
                                        .from("orders")
                                        .update({
                                            dispatch_date: newDate,
                                            status: newDate
                                                ? "Dispatched"
                                                : order.status,
                                        })
                                        .eq("id", order.id);

                                    fetchOrders();
                                }}
                                className="border p-2 rounded-lg w-full mt-1"
                            />

                        </div>

                    </div>
                </div>

                <div className="flex gap-3 items-center">

                    {
                        order.status !== "Dispatched" && (
                            <p>
                                Days Passed:
                                {" "}
                                {getDaysPassed(order.order_date)} days
                            </p>
                        )
                    }

                    <select
                        value={order.status}
                        onChange={async (e) => {

                            const newStatus = e.target.value;

                            await supabase
                                .from("orders")
                                .update({
                                    status: newStatus,

                                    dispatch_date:
                                        newStatus === "Dispatched"
                                            ? order.dispatch_date
                                            : null,
                                })
                                .eq("id", order.id);

                            fetchOrders();
                        }}
                        className="px-4 py-2 rounded-lg border"
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

                    <button
                        onClick={() =>
                            shareOnWhatsApp(order)
                        }
                        className={`text-white px-4 py-2 rounded-lg
                        ${order.whatsapp_sent
                                ? "bg-blue-600"
                                : "bg-green-600"
                            }`}
                    >
                        {order.whatsapp_sent
                            ? "✓"
                            : "DOWNLOAD"}
                    </button>

                    <button
                        onClick={() =>
                            deleteOrder(order.id)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Delete
                    </button>

                </div>

            </div>

            {/* ITEMS TABLE */}
            <div className="overflow-hidden rounded-xl border">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Design
                            </th>

                            <th className="p-3 text-left">
                                Grade
                            </th>

                            <th className="p-3 text-left">
                                Tile Size
                            </th>

                            <th className="p-3 text-left">
                                Quantity
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {order.order_items?.map(
                            (item) => (

                                <tr
                                    key={item.id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {item.design_name}
                                    </td>

                                    <td className="p-3">
                                        {item.Grade}
                                    </td>

                                    <td className="p-3">
                                        {item.tile_size}
                                    </td>

                                    <td className="p-3">
                                        {item.quantity}
                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

            {/* PDF CONTENT */}
            <div
                id={`pdf-${order.id}`}
                className="bg-white absolute -left-[9999px] top-0"
                style={{
                    width: "800px",
                    padding: "40px",
                    fontFamily: "Arial",
                    color: "#111",
                }}
            >

                {/* HEADER */}
                <div
                    style={{
                        borderBottom: "3px solid #111",
                        paddingBottom: "20px",
                        marginBottom: "30px",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "42px",
                            fontWeight: "bold",
                            margin: 0,
                            letterSpacing: "2px",
                        }}
                    >
                        CERAGOLD CERAMIC
                    </h1>

                    <p
                        style={{
                            marginTop: "10px",
                            color: "#555",
                            fontSize: "16px",
                        }}
                    >
                        Order List
                    </p>
                </div>

                {/* ORDER INFO */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "30px",
                    }}
                >

                    <div>
                        <p style={{ margin: "8px 0" }}>
                            <strong>Order No:</strong>
                            {" "}CG{order.id}
                        </p>

                        <p style={{ margin: "8px 0" }}>
                            <strong>Party Name:</strong>
                            {" "}{order.party_name}
                        </p>

                         
                    </div>

                    <div>
                        <p style={{ margin: "8px 0" }}>
                            <strong>Status:</strong>
                            {" "}{order.status}
                        </p>

                        <p style={{ margin: "8px 0" }}>
                            <strong>Order Date:</strong>
                            {" "}{order.order_date}
                        </p>

                         
                    </div>

                </div>

                {/* TABLE */}
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "15px",
                    }}
                >

                    <thead>

                        <tr
                            style={{
                                backgroundColor: "#111",
                                color: "white",
                            }}
                        >
                            <th style={tableHeaderStyle}>Design</th>
                            <th style={tableHeaderStyle}>Grade</th>
                            <th style={tableHeaderStyle}>Size</th>
                            <th style={tableHeaderStyle}>Qty</th>
                        </tr>

                    </thead>

                    <tbody>

                        {order.order_items?.map((item) => (

                            <tr key={item.id}>

                                <td style={tableCellStyle}>
                                    {item.design_name}
                                </td>

                                <td style={tableCellStyle}>
                                    {item.Grade}
                                </td>

                                <td style={tableCellStyle}>
                                    {item.tile_size}
                                </td>

                                <td style={tableCellStyle}>
                                    {item.quantity}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {/* FOOTER */}
                <div
                    style={{
                        marginTop: "50px",
                        textAlign: "center",
                        color: "#777",
                        fontSize: "14px",
                    }}
                >
                    Thank you for your business
                </div>

            </div>

        </div>
    );
}