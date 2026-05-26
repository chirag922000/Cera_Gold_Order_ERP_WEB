import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AddOrderForm from "../components/AddOrderForm";
import OrderCard from "../components/OrderCard";

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [searchOrder, setSearchOrder] = useState("");
    const [showAddOrder, setShowAddOrder] =
        useState(false);
    const [gradeSuggestions, setGradeSuggestions] = useState([]);

    const [filterMonth, setFilterMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [partySuggestions, setPartySuggestions] =
        useState([]);

    const [companySuggestions, setCompanySuggestions] =
        useState([]);

    const [designSuggestions, setDesignSuggestions] =
        useState([]);
    // MAIN ORDER DATA
    const [formData, setFormData] = useState({
        party_name: "",
        company_name: "",
        status: "Pending",
        order_date: "",

    });

    // MULTIPLE ORDER ITEMS
    const [items, setItems] = useState([
        {
            design_name: "",
            Grade: "",
            tile_size: "",
            quantity: "",
        },
    ]);

    const fetchOrders = async () => {

        let query = supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    id,
                    design_name,
                    Grade,
                    tile_size,
                    quantity
                )
            `)
            .order("id", { ascending: false });
    
        // APPLY MONTH FILTER ONLY IF SEARCH IS EMPTY
        if (!searchOrder) {
    
            const startDate = `${filterMonth}-01`;
    
            const endDate = new Date(
                new Date(filterMonth + "-01")
                    .getFullYear(),
    
                new Date(filterMonth + "-01")
                    .getMonth() + 1,
    
                0
            )
                .toISOString()
                .split("T")[0];
    
            query = query
                .gte("order_date", startDate)
                .lte("order_date", endDate);
        }
    
        const { data, error } = await query;
    
        if (error) {
            console.log(error);
            return;
        }
    
        setOrders(data);
    };

    const loadSuggestions = async () => {

        // PARTY + COMPANY
        const { data: ordersData } = await supabase
            .from("orders")
            .select("party_name, company_name");

        const { data: itemsData } = await supabase
            .from("order_items")
            .select("design_name, Grade");



        setPartySuggestions([
            ...new Set(
                ordersData?.map((x) => x.party_name)
            ),
        ]);

        setCompanySuggestions([
            ...new Set(
                ordersData?.map((x) => x.company_name)
            ),
        ]);

        setDesignSuggestions([
            ...new Set(
                itemsData?.map((x) => x.design_name)
            ),
        ]);

        setGradeSuggestions([
            ...new Set(
                itemsData
                    ?.map((x) => x.Grade)
                    .filter(Boolean)
            ),
        ]);

    };


    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchOrders();
                await loadSuggestions();
            } catch (err) {
                console.log(err);
            }
        };

        loadData();
    }, []);

    useEffect(() => {

        const loadFilteredOrders = async () => {
            await fetchOrders();
        };

        loadFilteredOrders();

    }, [filterMonth,searchOrder]);

    // ADD NEW ITEM ROW
    const addItemRow = () => {
        setItems([
            ...items,
            {
                design_name: "",
                Grade: "",
                tile_size: "",
                quantity: "",
            },
        ]);
    };

    // DELETE ITEM ROW
    const deleteItemRow = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);

        setItems(updatedItems);
    };

    // HANDLE ITEM CHANGE
    const handleItemChange = (
        index,
        field,
        value
    ) => {
        const updatedItems = [...items];

        updatedItems[index][field] = value;

        setItems(updatedItems);
    };

    // ADD ORDER
    const addOrder = async () => {
        if (
            !formData.party_name ||
            !formData.company_name
        ) {
            alert("Please fill required fields");
            return;
        }

        // INSERT MAIN ORDER
        const { data, error } = await supabase
            .from("orders")
            .insert([
                {
                    party_name: formData.party_name,
                    company_name: formData.company_name,
                    status: formData.status,

                    order_date: formData.order_date,

                },
            ])
            .select();

        if (error) {
            console.log(error);
            alert("Error adding order");
            return;
        }

        const orderId = data[0].id;

        // INSERT ORDER ITEMS
        const itemsWithOrderId = items.map(
            (item) => ({
                ...item,
                order_id: orderId,
            })
        );

        const { error: itemError } =
            await supabase
                .from("order_items")
                .insert(itemsWithOrderId);

        if (itemError) {
            console.log(itemError);
            alert("Error adding items");
            return;
        }

        alert("Order Added Successfully");
        setShowAddOrder(false);
        // RESET FORM
        setFormData({
            party_name: "",
            company_name: "",
            status: "Pending",

            order_date: "",

        });

        setItems([
            {
                design_name: "",
                Grade: "",
                tile_size: "",
                quantity: "",
            },
        ]);

        fetchOrders();
    };

    // DELETE ORDER
    const deleteOrder = async (id) => {
        const confirmDelete = window.confirm(
            "Delete this order?"
        );

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("orders")
            .delete()
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Delete failed");
            return;
        }

        fetchOrders();
    };

    const shareOnWhatsApp = async (order) => {

        const input =
            document.getElementById(`pdf-${order.id}`);

        const canvas = await html2canvas(input, {
            scale: 2,
        });

        // USE JPEG INSTEAD OF PNG
        const imgData =
            canvas.toDataURL("image/jpeg", 1.0);

        const pdf = new jsPDF(
            "p",
            "mm",
            "a4"
        );

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const imgWidth = pageWidth;

        const imgHeight =
            (canvas.height * imgWidth) /
            canvas.width;

        pdf.addImage(
            imgData,
            "JPEG",
            0,
            0,
            imgWidth,
            imgHeight
        );

        pdf.save(
            `CG${order.id}-${order.party_name}.pdf`
        );

        await supabase
            .from("orders")
            .update({
                whatsapp_sent: true,
            })
            .eq("id", order.id);

        fetchOrders();
    };

    const getDaysPassed = (date) => {

        if (!date) return "-";

        const today = new Date();

        const orderDate = new Date(date);

        const diff =
            today - orderDate;

        return Math.floor(
            diff / (1000 * 60 * 60 * 24)
        );
    };

    const filteredOrders = orders.filter((order) => {

        if (!searchOrder) return true;
    
        const search = searchOrder.toLowerCase();
    
        return (
            `CG${order.id}`.toLowerCase().includes(search) ||
            order.party_name?.toLowerCase().includes(search) ||
            order.company_name?.toLowerCase().includes(search)
        );
    
    });

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">

                {/* LEFT SIDE */}
                <h1 className="text-4xl font-bold">
                    CERAGOLD CERAMIC
                </h1>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4">

                    <button
                        onClick={() =>
                            setShowAddOrder(!showAddOrder)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                    >
                        {showAddOrder
                            ? "Close Form"
                            : "Add Order"}
                    </button>
                    <input
                        type="text"
                        placeholder="Search Order No (CG12)"
                        value={searchOrder}
                        onChange={(e) =>
                            setSearchOrder(e.target.value)
                        }
                        className="border p-3 rounded-xl"
                    />
                    <input
                        type="month"
                        value={filterMonth}
                        onChange={(e) =>
                            setFilterMonth(e.target.value)
                        }
                        className="border p-3 rounded-xl"
                    />

                    <div className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                        Total Orders: {orders.length}
                    </div>

                </div>

            </div>
            <AddOrderForm
                showAddOrder={showAddOrder}
                formData={formData}
                setFormData={setFormData}
                items={items}
                setItems={setItems}
                addItemRow={addItemRow}
                deleteItemRow={deleteItemRow}
                handleItemChange={handleItemChange}
                addOrder={addOrder}
                partySuggestions={partySuggestions}
                companySuggestions={companySuggestions}
                designSuggestions={designSuggestions}
                gradeSuggestions={gradeSuggestions}
            />

            {/* ORDERS LIST */}
            <div className="space-y-6">

            {filteredOrders.map((order) => (

                    <OrderCard
                        key={order.id}
                        order={order}
                        supabase={supabase}
                        fetchOrders={fetchOrders}
                        getDaysPassed={getDaysPassed}
                        shareOnWhatsApp={shareOnWhatsApp}
                        deleteOrder={deleteOrder}
                    />

                ))}

            </div>

        </div>
    );
}