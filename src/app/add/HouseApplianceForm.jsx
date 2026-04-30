
"use client";
import { useState } from "react";
import Link from "next/link";
import { appliances } from "@/app/add/data/appliances"
import { Select, Input, Button, Message } from "@/app/shared/components"
import { registerAppliance } from "@/app/add/appliance.service";


/**
 * Flow:
 * 1: Object state holds input
 * 2: All changes hange handled by generic handler
 * 3: Submit handler collects form data and sends calls service
 * 4: Service sends form data to route
 */

export default function HouseApplianceForm() {

  /**
   * 1
   * Object state has 3 keys
   * values: Object holding valid input, valid submissions are returned here as well
   * errors: Object holding invalid submissions for error message
   * message: Displays success message
   */
  const [state, setState] = useState({
    values: {}, // Valid input
    errors: {},
    message: ""
  });

  
   
  /**
   * 2 
   * setState takes 1 argument of 2 possible types:
   * Either a value replace the current state with OR
   * a callback that takes takes in a variable representing old state & returns new state 
   * 
   * This set up is to keep the valid values after submittion and avoid typing a new name for every change handler
   */
  function handleChange(name, value) {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values, // Spread operator means all the values from argument (prev)
        [name]: value // Order is important, otherwise this would be overwritten
      }
    }));
  }

  
  /**
   * 3
   * Submit handler calls the service layer
   * It sets the state based on the results
   * This is how valid input stays in the fields (Sticky beviour from assignment 1)  
   */
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
  
  // Just to clean the return
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