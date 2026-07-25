"use client";
import React, { useState } from "react";
import {
  useGetAdminOrdersQuery,
  useDeleteOrderMutation,
  useSyncDelhiveryOrdersMutation,
} from "@/redux/api/orderApi";
import { Order } from "@/types/order";
import Link from "next/link";
import { Parser } from "json2csv";
import PaginationComponent from "@/utils/pagination/PaginationComponent";
import PreviewIcon from "../SvgIcons/PreviewIcon";
import DeleteIcon from "../SvgIcons/DeleteIcon";
import ReusableAlert from "@/utils/alerts/ReusableAlert";
import toast from "react-hot-toast";
import SearchInput from "@/utils/search/SearchInput";
import CsvIcon from "../SvgIcons/CsvIcon";
import Spinner from "../common/Spinner";
import SyncIcon from "../SvgIcons/SyncIcons";
import { Tooltip } from "@mui/material";
import Offcanvas from "../common/shared/ReusableOffCanvas";
import FilterForm from "../orders/OrderFilterForm";

const OrderTable = () => {
  const [filterOptions, setFilterOptions] = useState<{ search?: string;[key: string]: any }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isFilterOffCanvasOpen, setIsFilterOffCanvasOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpandRow = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const { data, isLoading, isError } = useGetAdminOrdersQuery(filterOptions);
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [syncDelhiveryOrders, { isLoading: isSyncing }] =
    useSyncDelhiveryOrdersMutation();

  // Check if any filter options are applied
  const hasActiveFilters = Object.keys(filterOptions).length > 0;

  // Handle sync with Delhivery
  const handleSyncOrders = async () => {
    try {
      const response = await syncDelhiveryOrders({}).unwrap();
      toast.success(response.message);
    } catch (error) {
      // Error handling is managed in the mutation's onQueryStarted
    }
  };

  // Handle search input from SearchInput component
  const handleSearch = (query: any) => {
    setFilterOptions((prev) => ({ ...prev, search: query || undefined }));
    setCurrentPage(1);
  };

  // Handle filter form apply
  const handleApplyFilters = (filters: any) => {
    setFilterOptions(filters);
    setCurrentPage(1);
    setIsFilterOffCanvasOpen(false);
  };

  // Toggle off-canvas
  const toggleFilterOffCanvas = () => {
    setIsFilterOffCanvasOpen((prev) => !prev);
  };

  // Close off-canvas
  const closeFilterOffCanvas = () => {
    setIsFilterOffCanvasOpen(false);
  };

  // Calculate paginated data
  const filteredOrders = data?.orders || [];
  const totalItems = filteredOrders.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      toast.error("No orders available to export!");
      return;
    }

    setIsDownloading(true);

    const fields = [
      { label: "Order ID", value: "_id" },
      { label: "Customer Name", value: "shippingInfo.fullName" },
      { label: "Email", value: "shippingInfo.email" },
      { label: "Phone Number", value: "shippingInfo.phoneNo" },
      { label: "Address", value: "shippingInfo.address" },
      { label: "City", value: "shippingInfo.city" },
      { label: "State", value: "shippingInfo.state" },
      { label: "Country", value: "shippingInfo.country" },
      { label: "Zip Code", value: "shippingInfo.zipCode" },
      { label: "Total Amount", value: "totalAmount" },
      { label: "Payment Method", value: "paymentMethod" },
      {
        label: "Order Status",
        value: (order: any) =>
          order.delhiveryCurrentOrderStatus || order.orderStatus,
      },
      { label: "Date", value: "createdAt" },
    ];

    try {
      const parser = new Parser({ fields });
      const csv = parser.parse(filteredOrders);

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orders.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Orders exported successfully");
    } catch (error) {
      toast.error("Failed to export orders");
      console.error("CSV export error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const openDeleteModal = (order: any) => {
    setCurrentOrder(order);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCurrentOrder(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!currentOrder) return;
    try {
      await deleteOrder(currentOrder!._id).unwrap();
      toast.success("Order deleted successfully");
      closeDeleteModal();
    } catch (error) {
      toast.error("Error deleting order");
      console.error("Failed to delete order:", error);
    }
  };

  // Early returns for loading and error states
  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <Spinner />
        <p className="ml-2 text-gray-500 dark:text-gray-400">
          Loading orders...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">
        Error loading orders.
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Orders
        </h4>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SearchInput
          placeholder="Search by name, order ID, phone..."
          onSearch={handleSearch}
        />
        <div className="flex items-center justify-end gap-4">
          <select
            defaultValue="8"
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            <option disabled>Select items per page</option>
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>

          {/* Export CSV Button */}
          <Tooltip title="Export as CSV" arrow>
            <button
              onClick={exportToCSV}
              disabled={isDownloading}
              className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
              {isDownloading ? <Spinner /> : <CsvIcon />}
            </button>
          </Tooltip>

          {/* Sync with Delhivery Button */}
          <Tooltip title="Sync Orders with Delhivery" arrow>
            <button
              onClick={handleSyncOrders}
              disabled={isSyncing}
              className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
              {isSyncing ? <Spinner /> : <SyncIcon />}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Payment Method
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders?.map((order: any) => (
              <React.Fragment key={order._id}>
                <tr
                  className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {order._id.slice(-6).toUpperCase()}
                </th>
                <td className="px-6 py-4 text-center">
                  {(order.shippingInfo?.fullName || order.shippingAddress?.fullName) || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">₹{order.totalAmount}</td>
                <td className="px-6 py-4 text-center">
                  {order.delhiveryCurrentOrderStatus || order.orderStatus || order.status}
                </td>
                <td className="px-6 py-4 text-center">{order.paymentMethod}</td>
                <td className="px-6 py-4 text-center">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => toggleExpandRow(order._id)}
                      className={`btn border-none p-3 text-gray-200 hover:bg-opacity-80 ${
                        expandedOrderId === order._id ? "bg-orange-500" : "bg-primary"
                      }`}
                      title={expandedOrderId === order._id ? "Hide Details" : "Quick View"}
                    >
                      <PreviewIcon />
                    </button>
                    <Link
                      href={`/orderDetails/${order._id}`}
                      className="btn border-none bg-blue-600 p-3 text-gray-200 hover:bg-blue-600/80"
                      title="Full Order Page"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => openDeleteModal(order)}
                      className="btn border-none bg-red-600 p-3 text-gray-200 hover:bg-red-600/80 disabled:opacity-50"
                      disabled={isDeleting}
                      title="Delete Order"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h5 className="mb-3 font-bold text-black dark:text-white">
                          Shipping Details
                        </h5>
                        {(() => {
                          // Determine which shipping object has the data
                          const s =
                            order.shippingInfo?.address || order.shippingInfo?.phoneNo
                              ? order.shippingInfo
                              : order.shippingAddress;

                          if (!s || (!s.address && !s.fullName))
                            return <p className="text-gray-500">No shipping info available</p>;
                          return (
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-semibold">Full Name:</span>{" "}
                                {s.fullName}
                              </p>
                              <p>
                                <span className="font-semibold">Phone:</span>{" "}
                                {s.phoneNo || s.phone}
                              </p>
                              <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {s.email || "N/A"}
                              </p>
                              <p>
                                <span className="font-semibold">Address:</span>{" "}
                                {s.address}
                                {s.address2 && `, ${s.address2}`}
                              </p>
                              <p>
                                <span className="font-semibold">Location:</span>{" "}
                                {s.city}, {s.state}, {s.zipCode || s.pinCode}
                              </p>
                              {order.orderNotes && (
                                <p className="mt-2 text-orange-600 dark:text-orange-400">
                                  <span className="font-bold">Notes:</span>{" "}
                                  {order.orderNotes}
                                </p>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Order Items */}
                      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h5 className="mb-3 font-bold text-black dark:text-white">
                          Order Items
                        </h5>
                        <div className="max-h-60 overflow-y-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-2 text-left">Product</th>
                                <th className="py-2 text-center">Qty</th>
                                <th className="py-2 text-right">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const items =
                                  order.orderItems && order.orderItems.length > 0
                                    ? order.orderItems
                                    : order.items || [];
                                return items.map((item: any, idx: number) => (
                                  <tr
                                    key={idx}
                                    className="border-b border-gray-100 dark:border-gray-700/50"
                                  >
                                    <td className="py-2">
                                      <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {item.name}
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        {typeof item.variant === "object"
                                          ? item.variant.size || ""
                                          : item.variant || item.size || ""}
                                      </div>
                                    </td>
                                    <td className="py-2 text-center">
                                      {item.quantity}
                                    </td>
                                    <td className="py-2 text-right font-medium">
                                      ₹{item.price}
                                    </td>
                                  </tr>
                                ));
                              })()}
                            </tbody>
                            <tfoot>
                              <tr className="font-bold">
                                <td colSpan={2} className="pt-3 text-right">Total:</td>
                                <td className="pt-3 text-right text-primary">₹{order.totalAmount}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {(!filteredOrders || filteredOrders.length === 0) && (
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <p className="text-center text-gray-500 dark:text-gray-400">
              {filterOptions?.search
                ? "No orders match your search."
                : "No orders found."}
            </p>
          </div>
        )}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / itemsPerPage)}
        onPageChange={handlePageChange}
      />

      {isDeleteModalOpen && currentOrder && (
        <ReusableAlert
          title="Confirm Deletion"
          content={`Are you sure you want to delete order "${currentOrder._id.slice(-6).toUpperCase()}"?`}
          func={handleDelete}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          functionTitle="Delete"
          buttonStyle="bg-red-600"
        />
      )}

      <Offcanvas isOpen={isFilterOffCanvasOpen} onClose={closeFilterOffCanvas}>
        <FilterForm onApply={handleApplyFilters} />
      </Offcanvas>
      {isFilterOffCanvasOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={closeFilterOffCanvas}
        />
      )}
    </div>
  );
};

export default OrderTable;
