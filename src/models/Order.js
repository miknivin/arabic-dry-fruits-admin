import mongoose from "mongoose";

/**
 * Unified Order model — used by BOTH admin panel and client website.
 * This is the single source of truth for all order data.
 */
const orderSchema = new mongoose.Schema(
  {
    // Admin schema shipping fields
    shippingInfo: {
      fullName: { type: String, required: false },
      address: { type: String, required: false },
      address2: { type: String, required: false },
      email: { type: String, required: false },
      state: { type: String, required: false },
      city: { type: String, required: false },
      phoneNo: { type: String, required: false },
      zipCode: { type: String, required: false },
      country: { type: String, required: false, default: "India" },
    },
    // Storefront schema shipping fields
    shippingAddress: {
      fullName: { type: String, required: false },
      email: { type: String, required: false },
      phone: { type: String, required: false },
      address: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      pinCode: { type: String, required: false },
      country: { type: String, required: false, default: "India" },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    // Admin schema order items
    orderItems: [
      {
        name: { type: String, required: false },
        sku: { type: String, required: false },
        quantity: { type: Number, required: false },
        image: { type: String, required: false, default: "" },
        imageUrl: { type: String, required: false },
        variant: { type: mongoose.Schema.Types.Mixed, required: false },
        price: { type: mongoose.Schema.Types.Mixed, required: false },
        discountPrice: { type: String, required: false },
        productId: { type: String, required: false },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: "products",
        },
      },
    ],
    // Storefront schema order items
    items: { type: Array, required: false },
    paymentMethod: {
      type: String,
      required: false,
      enum: {
        values: ["COD", "Online", "cod", "online"],
        message: "Please select COD or Online Payments",
      },
    },
    paymentInfo: {
      id: String,
      status: String,
    },
    itemsPrice: { type: Number, required: false, default: 0 },
    taxAmount: { type: Number, required: false, default: 0 },
    shippingAmount: { type: Number, required: false, default: 0 },
    totalAmount: { type: Number, required: false },
    couponApplied: { type: String, required: false, default: "No" },
    couponAppliedRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    couponDiscount: { type: Number, default: 0 },
    // Storefront status field
    status: { type: String, required: false },
    orderStatus: {
      type: String,
      default: "Processing",
      enum: {
        values: [
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Return Requested",
          "Return Approved",
          "Return Rejected",
          "Returned",
          "Refunded",
        ],
        message: "Please select valid order status",
      },
    },
    orderNotes: { type: String, required: false },
    waybill: { type: String, required: false, unique: true, sparse: true },
    invoiceURL: { type: String, required: false },
    delhiveryCurrentOrderStatus: { type: String, required: false },
    cancelOrReturnReason: { type: String, required: false },
    cancelledAt: { type: Date, required: false },
    returnRequestedAt: { type: Date, required: false },
    returnedAt: { type: Date, required: false },
    refundedAt: { type: Date, required: false },
    refundAmount: { type: Number, required: false },
    refundInfo: { id: String, status: String },
    orderTracking: [
      {
        Status: { type: String, required: false },
        StatusDateTime: { type: Date, required: false },
        StatusType: { type: String, required: false },
        StatusLocation: { type: String, required: false },
        Instructions: { type: String, required: false },
      },
    ],
    deliveredAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
