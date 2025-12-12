"use client";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ModalComponent = ({
  showModal,
  handleClose,
  handleConfirm,
  title,
  message,
  form,
  type,
  handleOk,
  size,
  loading,
  bottom,
  buttonText,
}) => {
  const getSizeClass = (size) => {
    switch (size) {
      case "lg":
        return "w-full max-w-xl";

      case "lg2xl":
        return "w-full max-w-2xl";

      case "lg3xl":
        return "w-full max-w-3xl";

      case "lg4xl":
        return "w-full max-w-4xl";

      case "lg5xl":
        return "w-full max-w-5xl";
      case "lg6xl":
        return "w-full max-w-6xl";
      case "lg7xl":
        return "w-full max-w-7xl";
      case "lg8xl":
        return "w-full max-w-8xl";

      case "md":
        return "w-full max-w-md";

      case "sm":
        return "w-full max-w-sm";

      default:
        return "w-full max-w-md"; // default to md size
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={handleClose}>
      <DialogContent size={getSizeClass(size)}>
        <DialogHeader className="p-0">
          <DialogTitle className="text-base font-medium text-default-700">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* body */}
        <div className="my-4">
          {form}
          {message && (
            <div>
              <div className="mt-2">{message}</div>
              <hr className="my-6 border-gray-200" /> {/* Divider */}
            </div>
          )}
        </div>

        {/* //footer */}
        {bottom !== "false" && (
          <>
            {type === "single" ? (
              <Button onClick={handleOk}>
                <span>{buttonText ? buttonText : "Okay"}</span>
              </Button>
            ) : (
              <DialogFooter className="mt-8 gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" color="warning">
                    Close
                  </Button>
                </DialogClose>

                <Button
                  onClick={handleConfirm}
                  className={`${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  <span>{buttonText ? buttonText : "Yes"}</span>
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { ModalComponent };
