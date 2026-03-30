
import {
  Package,
  ChevronDown,
  Search,
  CheckCircle,
  Clock,
  Truck,AlertCircle,BadgeCheck,CalendarClock,PackageCheck,
  XCircle,
  RotateCcw,
  Star,
  Download,
  MessageCircle,XOctagon,ClipboardCheck,ClipboardX,BadgeDollarSign,RefreshCcw,CircleDollarSign,PackagePlus,
  MapPin,HelpCircle,
  Calendar,
  ShoppingBag,
  ArrowRight,AlertTriangle,
  RefreshCw,
  Filter,
  Tag,
  Coins,
  FileText,
  Navigation,
} from "lucide-react";



// ─── Password Strength ────────────────────────────────────────────────────────


export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-400' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-400' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
  return { score, label: 'Very Strong', color: 'bg-green-600' };
};

// ─── Mask OTP Target ──────────────────────────────────────────────────────────
export const maskOtpTarget = (target) => {
  if (!target) return '';
  if (target.startsWith('+91')) {
    const digits = target.replace('+91 ', '').replace(/\s/g, '');
    const masked = '•'.repeat(Math.max(digits.length - 4, 0)) + digits.slice(-4);
    return `+91 ${masked}`;
  }
  const [localPart, domain] = target.split('@');
  if (!domain) return target;
  const maskedLocal = localPart[0] + '•'.repeat(Math.max(localPart.length - 1, 3));
  return `${maskedLocal}@${domain}`;
};


export const getStatusConfig = (status) => {
  switch (status) {

    // ─── Order Progress ───────────────────────────────────────
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        dot: "bg-yellow-500",
      };

    case "verified":
      return {
        label: "Verified",
        icon: BadgeCheck,
        color: "text-teal-600",
        bg: "bg-teal-50",
        border: "border-teal-200",
        dot: "bg-teal-500",
      };

    case "low_stock":
      return {
        label: "Low Stock",
        icon: AlertTriangle,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        dot: "bg-orange-500",
      };

    case "packed":
      return {
        label: "Packed",
        icon: Package,
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        dot: "bg-cyan-500",
      };

    case "shipped":
      return {
        label: "Shipped",
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        dot: "bg-blue-500",
      };

    case "out_for_delivery":
      return {
        label: "Out for Delivery",
        icon: Navigation,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        dot: "bg-indigo-500",
      };

    case "delivered":
      return {
        label: "Delivered",
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        dot: "bg-green-500",
      };

    // ─── Cancellation Flow ────────────────────────────────────
    case "cancelled_requested":
      return {
        label: "Cancellation Requested",
        icon: AlertCircle,
        color: "text-red-400",
        bg: "bg-red-50",
        border: "border-red-100",
        dot: "bg-red-300",
      };

    case "cancelled_approved":
      return {
        label: "Cancellation Approved",
        icon: XOctagon,
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-400",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-500",
      };

    // ─── Return Flow ──────────────────────────────────────────
    case "returned_requested":
      return {
        label: "Return Requested",
        icon: RotateCcw,
        color: "text-purple-400",
        bg: "bg-purple-50",
        border: "border-purple-100",
        dot: "bg-purple-300",
      };

    case "returned_pickup_scheduled":
      return {
        label: "Return Pickup Scheduled",
        icon: CalendarClock,
        color: "text-purple-500",
        bg: "bg-purple-50",
        border: "border-purple-200",
        dot: "bg-purple-400",
      };

    case "returned_pickup_completed":
      return {
        label: "Return Pickup Completed",
        icon: PackageCheck,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
        dot: "bg-purple-500",
      };

    case "returned_inspected_approve":
      return {
        label: "Return Inspected — Approved",
        icon: ClipboardCheck,
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-200",
        dot: "bg-violet-500",
      };

    case "returned_inspected_reject":
      return {
        label: "Return Inspected — Rejected",
        icon: ClipboardX,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
        dot: "bg-rose-500",
      };

    // ─── Refund / Replace Initiation ──────────────────────────
    case "return_initiated_refund":
      return {
        label: "Refund Initiated",
        icon: BadgeDollarSign,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
      };

    case "return_initiated_replace":
      return {
        label: "Replacement Initiated",
        icon: RefreshCcw,
        color: "text-sky-600",
        bg: "bg-sky-50",
        border: "border-sky-200",
        dot: "bg-sky-500",
      };

    // ─── Refund / Replace Processed ───────────────────────────
    case "returned_processed_refund":
      return {
        label: "Refund Processed",
        icon: CircleDollarSign,
        color: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-300",
        dot: "bg-green-600",
      };

    case "returned_processed_replace":
      return {
        label: "Replacement Processed",
        icon: PackagePlus,
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-300",
        dot: "bg-blue-600",
      };

    // ─── Fallback ─────────────────────────────────────────────
    default:
      return {
        label: "Unknown",
        icon: HelpCircle,
        color: "text-gray-500",
        bg: "bg-gray-50",
        border: "border-gray-200",
        dot: "bg-gray-400",
      };
  }
};

export const getOrderStatusTimelineConfig = (status) => {
  switch (status) {

    // ─── Order Progress ───────────────────────────────────────
     case "initial":
      return {
        label: "Order Created",
        desc:"Order Created",
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        dot: "bg-yellow-500",
      };
    case "pending":
      return {
        label: "Order Paid",
        desc:"Waiting for order confirmation",
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        dot: "bg-yellow-500",
      };

    case "verified":
      return {
        label: "Verified",
        desc:"Order confirmed and accepted",
        icon: BadgeCheck,
        color: "text-teal-600",
        bg: "bg-teal-50",
        border: "border-teal-200",
        dot: "bg-teal-500",
      };

    case "low_stock":
      return {
        label: "Low Stock",
        desc:"Currently Sufficient Stock Not Available",
        icon: AlertTriangle,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        dot: "bg-orange-500",
      };

    case "packed":
      return {
        label: "Packed",
        desc:"Order packed and ready to dispatch",
        icon: Package,
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        dot: "bg-cyan-500",
      };

    case "shipped":
      return {
        label: "Shipped",
        desc:"Order dispatched and on its way",
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        dot: "bg-blue-500",
      };

    case "out_for_delivery":
      return {
        label: "Out for Delivery",
        desc:"Package is out for delivery today",
        icon: Navigation,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        dot: "bg-indigo-500",
      };

    case "delivered":
      return {
        label: "Delivered",
        desc:"Order Delivered Successfully",
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        dot: "bg-green-500",
      };

    // ─── Cancellation Flow ────────────────────────────────────
    case "cancelled_requested":
      return {
        label: "Cancellation Requested",
        desc:"Order Cancellation Requested",
        icon: AlertCircle,
        color: "text-red-400",
        bg: "bg-red-50",
        border: "border-red-100",
        dot: "bg-red-300",
      };

    case "cancelled_approved":
      return {
        label: "Cancellation Approved",
        desc:"Order Cancellation Approved And Refund Initiated",
        icon: XOctagon,
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-400",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        desc:"Order has been cancelled and Refund Credited",
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-500",
      };

    // ─── Return Flow ──────────────────────────────────────────
    case "returned_requested":
      return {
        label: "Return Requested",
        icon: RotateCcw,
        color: "text-purple-400",
        bg: "bg-purple-50",
        border: "border-purple-100",
        dot: "bg-purple-300",
      };

    case "returned_pickup_scheduled":
      return {
        label: "Return Pickup Scheduled",
        icon: CalendarClock,
        color: "text-purple-500",
        bg: "bg-purple-50",
        border: "border-purple-200",
        dot: "bg-purple-400",
      };

    case "returned_pickup_completed":
      return {
        label: "Return Pickup Completed",
        icon: PackageCheck,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
        dot: "bg-purple-500",
      };

    case "returned_inspected_approve":
      return {
        label: "Return Inspected — Approved",
        icon: ClipboardCheck,
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-200",
        dot: "bg-violet-500",
      };

    case "returned_inspected_reject":
      return {
        label: "Return Inspected — Rejected",
        icon: ClipboardX,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
        dot: "bg-rose-500",
      };

    // ─── Refund / Replace Initiation ──────────────────────────
    case "return_initiated_refund":
      return {
        label: "Refund Initiated",
        icon: BadgeDollarSign,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
      };

    case "return_initiated_replace":
      return {
        label: "Replacement Initiated",
        icon: RefreshCcw,
        color: "text-sky-600",
        bg: "bg-sky-50",
        border: "border-sky-200",
        dot: "bg-sky-500",
      };

    // ─── Refund / Replace Processed ───────────────────────────
    case "returned_processed_refund":
      return {
        label: "Refund Processed",
        icon: CircleDollarSign,
        color: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-300",
        dot: "bg-green-600",
      };

    case "returned_processed_replace":
      return {
        label: "Replacement Processed",
        icon: PackagePlus,
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-300",
        dot: "bg-blue-600",
      };

    // ─── Fallback ─────────────────────────────────────────────
    default:
      return {
        label: "Unknown",
        icon: HelpCircle,
        color: "text-gray-500",
        bg: "bg-gray-50",
        border: "border-gray-200",
        dot: "bg-gray-400",
      };
  }
};


