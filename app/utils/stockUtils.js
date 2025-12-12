import "server-only";


// utils/stockUtils.js

/**
 * ─── Handle Purchase Orders ──────────────────────────────────────
 * Updates the main stock details with purchase order data.
 */
export const processPurchaseOrders = (purchaseOrders, product, main) => {
    purchaseOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.itemCode === product.productCode) {
          const { receivedQuantity, rate } = item;
  
          // Update stock information
          main.quantity += receivedQuantity;
          main.amount += receivedQuantity * rate;
          main.rate = main.quantity > 0 ? main.amount / main.quantity : 0;
  
          // Add order to the list
          main.orders.push({
            quantity: receivedQuantity,
            returnQuantity: 0,
            rate,
            effect: "+",                 // Purchase increases stock
            effectQuantity: receivedQuantity,
            amount: receivedQuantity * rate,
            orderId: order._id.toString(),
            type: "purchase",
          });
        }
      });
    });
  };
  
  
  /**
   * ─── Handle Sales Orders ──────────────────────────────────────
   * Updates the main stock details with sales order data.
   */
  export const processSalesOrders = (salesOrders, product, main) => {
    salesOrders.forEach((order) => {
      order.initial.data.items.forEach((item) => {
        if (item.productCode === product.productCode) {
          const { quantitySelected, rate } = item;
  
          // Update stock for sales (reduce quantity)
          main.quantity -= quantitySelected;
          main.amount -= quantitySelected * rate;
          main.rate = main.quantity > 0 ? main.amount / main.quantity : 0;
  
          // Add sales order details
          main.orders.push({
            quantity: quantitySelected,
            returnQuantity: 0,
            rate,
            effect: "-",                 // Sales reduces stock
            effectQuantity: quantitySelected,
            amount: quantitySelected * rate,
            orderId: order._id.toString(),
            type: "sales",
          });
        }
      });
    });
  };
  
  
  /**
   * ─── Handle Return Orders ──────────────────────────────────────
   * Updates the main and return stock details with return order data.
   */
  export const processReturnOrders = (salesOrders, product, main, returns) => {
    salesOrders.forEach((order) => {
      if (!order.return || !order.return.data || !order.return.data.items) return;
      order.return.data.items.forEach((item) => {
        if (item.productCode === product.productCode) {
          const {
            quantitySelected,  // Original sales quantity
            rate,              // Original sales rate
            returnQuantity,    // Quantity returned
            restockRate,       // Rate at which returned stock is restocked
            restockAmount      // Amount of the restocked items
          } = item;
  
          // Adjust main stock for returned items
          main.quantity += returnQuantity;
          main.amount += returnQuantity * rate;
          main.rate = main.quantity > 0 ? main.amount / main.quantity : 0;
  
          // Update previous sales order for net effect of returns
          main.orders.forEach((oldItem) => {
            if (oldItem.orderId === order._id.toString()) {
              oldItem.returnQuantity += returnQuantity;
              oldItem.effectQuantity = quantitySelected - returnQuantity;
              oldItem.amount = oldItem.effectQuantity * rate;
              oldItem.rate = oldItem.effectQuantity > 0
                ? oldItem.amount / oldItem.effectQuantity
                : 0;
              oldItem.type = "sales-return";
            }
          });
  
          // Update returns object with return details
          returns.quantity += returnQuantity;
          returns.amount += returnQuantity * restockRate;
          returns.rate = returns.quantity > 0 ? returns.amount / returns.quantity : 0;
  
          // Add return order details
          returns.orders.push({
            quantity: quantitySelected,
            returnQuantity,
            rate,
            restockRate,
            effect: "+",                 // Return increases stock
            effectQuantity: returnQuantity,
            restockAmount,
            amount: returnQuantity * rate,
            orderId: order._id.toString(),
            type: "sales-return",
          });
        }
      });
    });
  };
  