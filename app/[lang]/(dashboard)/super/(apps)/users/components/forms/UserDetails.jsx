import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserDetails = ({ handleInputChange, name, description, lable, type }) => {
  return (
    <form className="space-y-6">
      <div className="w-full mt-6">
        <Label htmlFor={name} className="mb-3">{lable}:</Label>
        <Input
          type={type}
          id={name}
          name={name}
          placeholder={description}
          onChange={(data) =>
            handleInputChange(
              name,
              data.target.value,
              "input"
            )
          }
         
        />
      </div>
    </form>
  );
};

export default UserDetails;
