
"use client";
import { useState } from "react";
import { appliances } from "@/app/part-b-c/data/appliances"
import { Select, Input, Button, Message } from "@/app/shared/components"
import { registerAppliance, getInventory } from "@/app/part-b-c/appliance.service";

/*
 * AI usage: Tutorial (?)
 * I initially misunderstood part c to require that the back-end repopulate the form after submission.
 * I asked AI how this is done in React, and it explained useActionState and server actions.
 * I later realised that this wasn't necessary so I will instead store the server response in client state. 
 */

/**
 * We store an object with valid inputs and another with errors
 * This is based onthe server's response
 */
export default function HouseApplianceForm() {
  const [state, setState] = useState({
    values: {}, // Valid input
    errors: {},
    message: ""
  });

  // Reusable way to do setState, replaces things like setNumber, etc
  // 
  function handleChange(name, value) {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values, // Spread operator means all the values from argument (prev)
        [name]: value // Order is important, otherwise this would be overwritten
      }
    }));
  }
  
  // Populates form from latest inventory addition
  // Data stored in temp.json
  async function handleGetInventory() {
    const result = await getInventory();
    setState({
      values: result.values || {},
      errors: result.errors || {},
      message: result.message
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Necessary step, FormData collects all inputs from the form
    // It's not a JS Object, so we convert it to one
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Calling service layer
    const result = await registerAppliance(data);
    setState({
      values: result.values || {},
      errors: result.errors || {},
      message: result.message
    })

  }

  return (
    <form onSubmit={handleSubmit} className="form">

      {/* Eircode */}
      <div>
        <label>Eircode: </label>
        <Input
          name="eircode"
          value={state.values.eircode || ""}
          format="eircode"
          onChange={handleChange}
          maxLength="8"
          placeholder="D00 0000"
        />
      </div>
      <div>
        <label>Appliance: </label>
        <Select
          name="appliance"
          value={state.values.appliance || ""}
          onChange={handleChange}
          options={appliances}
        />
      </div>
      <div>
        <label>Brand: </label>
        <Input
          name="brand"
          value={state.values.brand || ""}
          onChange={handleChange}
          maxLength={10}
          placeholder="Brand"

        />
      </div>

      <div>
        <label>Model #: </label>
        <Input
          name="modelNumber"
          value={state.values.modelNumber || ""}
          format="model"
          onChange={handleChange}
          maxLength={12}
          placeholder="000-000-0000"
        />
      </div>
      <div>
        <label>Serial #: </label>
        <Input
          name="serialNumber"
          value={state.values.serialNumber || ""}
          format="serial"
          onChange={handleChange}
          maxLength={14}
          placeholder="0000-0000-0000"
        />
      </div>
      <div>
        <label>Purchase date: </label>
        <Input
          name="purchaseDate"
          format="date"
          value={state.values.purchaseDate || ""}
          onChange={handleChange}
          placeholder="DD/MM/YYYY"
          maxLength={10}
        />
      </div>
      <div>
        <label>Warranty expires: </label>
        <Input
          name="warrantyExpiryDate"
          format="date"
          value={state.values.warrantyExpiryDate || ""}
          onChange={handleChange}
          maxLength={10}
          placeholder="DD/MM/YYYY"

        />
      </div>

      {/* Button */}
      <Button type="submit">Add to Inventory</Button>
      <Button type="button" onClick={handleGetInventory}>Check Inventory</Button>


      {/* Message */}
      <Message text={Object.keys(state.errors).length > 0 ? state.errors : state.message} />

    </form>
  );
}