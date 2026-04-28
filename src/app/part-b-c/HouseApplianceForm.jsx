
"use client";
import { useState } from "react";
import Link from "next/link";
import { appliances } from "@/app/part-b-c/data/appliances"
import { Select, Input, Button, Message } from "@/app/shared/components"
import { registerAppliance } from "@/app/part-b-c/appliance.service";


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

  const hasErrors = Object.keys(state.errors).length > 0;
  const hasSubmitted = state.message || hasErrors;

  return (
    <form onSubmit={handleSubmit} className="form">

      <div className="form-sections">


        {/* User Info */}
        <div className="form-section">

          <h2>User Info</h2>

          <div className="field-row">
            <label>First name: </label>
            <Input
              name="firstName"
              value={state.values.firstName || ""}
              format="name"
              onChange={handleChange}
              maxLength={20}
              placeholder="First name"
            />
          </div>

          <div className="field-row">
            <label>Last name: </label>
            <Input
              name="lastName"
              value={state.values.lastName || ""}
              format="name"
              onChange={handleChange}
              maxLength={20}
              placeholder="Last name"
            />
          </div>
          <div className="field-row">
            <label>Address: </label>
            <Input
              name="address"
              value={state.values.address || ""}

              onChange={handleChange}
              maxLength={30}
              placeholder="Address"
            />
          </div>


          <div className="field-row">
            <label>Email: </label>
            <Input
              name="email"
              value={state.values.email || ""}
              format="email"
              onChange={handleChange}
              maxLength={50}
              placeholder="email@example.com"
            />
          </div>

          <div className="field-row">
            <label>Mobile: </label>
            <Input
              name="mobile"
              value={state.values.mobile || ""}
              format="mobile"
              onChange={handleChange}
              maxLength={12}
              placeholder="Mobile"
            />
          </div>
          {/* Eircode */}
          <div className="field-row">
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
        </div>

        {/* Appliance Info */}
        <div className="form-section split">
          <h2>Appliance Info</h2>
          <div className="field-row">
            <label>Appliance: </label>
            <Select
              name="appliance"
              value={state.values.appliance || ""}
              onChange={handleChange}
              options={appliances}
            />
          </div>
          <div className="field-row">
            <label>Brand: </label>
            <Input
              name="brand"
              value={state.values.brand || ""}
              onChange={handleChange}
              maxLength={10}
              placeholder="Brand"

            />
          </div>

          <div className="field-row">
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
          <div className="field-row">
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
          <div className="field-row">
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
          <div className="field-row">
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
          <div className="field-row">
            <label> Cost of Appliance: </label>
            <div className="cost">

              <span className="euro">€</span>
              <Input
                className="costInput"
                name="cost"
                format="cost"
                value={state.values.cost || ""}
                onChange={handleChange}
                maxLength={8}
                placeholder="0.00"

              />
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="button-row">
        <Button type="submit">Add Appliance</Button>
      </div>


      {/* Message */}
      <Message text={hasErrors ? state.errors : state.message} />

      {hasSubmitted? (
        <p>
          <Link href="/">Back to homepage</Link>
        </p>
      ): null}

    </form>
  );
}