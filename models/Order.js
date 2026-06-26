const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    customerInfo: {
      fullName: {
        type: String,
        trim: true,
        default: ""
      },
      phone: {
        type: String,
        trim: true,
        default: ""
      },
      state: {
        type: String,
        trim: true,
        default: ""
      },
      city: {
        type: String,
        trim: true,
        default: ""
      },
      deliveryType: {
        type: String,
        enum: ["home", "office", ""],
        default: ""
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: String,
          required: true,
        },
        color: String,
      },
    ],
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    isAdminOrder: {
      type: Boolean,
      default: true
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const lastOrder = await mongoose.model("Order").findOne({}, {}, { sort: { orderNumber: -1 } });
    let nextNumber = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastNumberStr = lastOrder.orderNumber.replace('ORD', '');
      const lastNumber = parseInt(lastNumberStr, 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    this.orderNumber = `ORD${nextNumber.toString().padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);