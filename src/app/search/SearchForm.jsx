// app/part-b-c/form.jsx

"use client";

import { useState } from "react";
import { searchAppliance } from "./search.service";
import { Input, Button, Message } from "@/app/shared/components"


export default function SearchForm() {
  const [serialNumber, setSerialNumber] = useState("");
  const [state, setState] = useState({
    message: "",
    errors: {},
    appliance: null
  });

  function renderDetails() {
    if (!state.appliance) {
      return null;
    } else  {
      return (
        <div className="form-section">
          <h2>Appliance Details</h2>

          <p><strong>Appliance:</strong> {state.appliance.appliance}</p>
          <p><strong>Brand:</strong> {state.appliance.brand}</p>
          <p><strong>Model #:</strong> {state.appliance.modelNumber}</p>
          <p><strong>Serial #:</strong> {state.appliance.serialNumber}</p>
          <p><strong>Purchase Date:</strong> {state.appliance.purchaseDate}</p>
          <p><strong>Warranty Expires:</strong> {state.appliance.warrantyExpiryDate}</p>
          <p><strong>Cost:</strong> €{state.appliance.cost}</p>

          <h2>User Info</h2>

          <p><strong>First Name:</strong> {state.appliance.firstName}</p>
          <p><strong>Last Name:</strong> {state.appliance.lastName}</p>
          <p><strong>Address:</strong> {state.appliance.address}</p>
          <p><strong>Email:</strong> {state.appliance.email}</p>
          <p><strong>Mobile:</strong> {state.appliance.mobile}</p>
          <p><strong>Eircode:</strong> {state.appliance.eircode}</p>
        </div>
      )}
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await searchAppliance({ serialNumber });

    setState({
      message: result.message || "",
      errors: result.errors || {},
      appliance: result.appliance || null
    });
    
    console.log(result); // testing
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-row">
        <label>Serial #: </label>
        <Input
          name="serialNumber"
          value={serialNumber || ""}
          format="serial"
          onChange={(name, value) => setSerialNumber(value)}
          maxLength={14}
          placeholder="0000-0000-0000"
        />
      </div>

      <Button type="submit">Search</Button>

      <Message
        text={
          Object.keys(state.errors).length > 0
            ? state.errors
            : state.message
        }
      />
      {renderDetails()}
      
    </form>
  );
}