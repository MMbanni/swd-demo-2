
import pool from "@/lib/db";
import {
  sanitize,
  validateAppliance,
  validateCost,
  validateEircode,
  validateEmail,
  validateLength,
  validateMobile,
  validateModel,
  validateSerial
} from "@/app/shared/utils/utils";

/**
 * Flow
 * 1: Sanitize input 
 * 2: Build values and errors objects
 * 3: Check for errors
 * 4: Search db for appliance using SN
 * 5: Update user info
 * 6: Update appliance info
 * 
 * Errors: 400, 404, 500
 */
export async function PUT(req) {
  try {
    const body = await req.json();

    /**
     * 1
     * Sanitize input
     * We won't be dealing with the dates because of a format conflict
     * I'll fix by storing dates as VARCHAR or adding another parser in future
     */

    let eircode = sanitize(body.eircode);
    let appliance = sanitize(body.appliance);
    let brand = sanitize(body.brand);
    let modelNumber = sanitize(body.modelNumber);
    let serialNumber = sanitize(body.serialNumber);
    //let purchaseDate = sanitize(body.purchaseDate);
    //let warrantyExpiryDate = sanitize(body.warrantyExpiryDate);
    let cost = sanitize(body.cost);

    let firstName = sanitize(body.firstName);
    let lastName = sanitize(body.lastName);
    let address = sanitize(body.address);
    let mobile = sanitize(body.mobile);
    let email = sanitize(body.email);


    /**
     * 2
     * Using result of validators to populate values and errors.
     * Validators return same value if valid,
     * or object like {error: ...} if invalid
     * We use these to send the server response to the client which we then store
     */

    const values = {}; // Valid inputs
    const errors = {}; // invalid inputs

    eircode = validateEircode(eircode);
    eircode.error ? errors.eircode = eircode.error : values.eircode = eircode

    serialNumber = validateSerial(serialNumber);
    serialNumber.error ? errors.serialNumber = serialNumber.error : values.serialNumber = serialNumber;

    modelNumber = validateModel(modelNumber);
    modelNumber.error ? errors.modelNumber = modelNumber.error : values.modelNumber = modelNumber;

    brand = validateLength(brand, "brand");
    brand.error ? errors.brand = brand.error : values.brand = brand;

    appliance = validateAppliance(appliance);
    appliance.error ? errors.appliance = appliance.error : values.appliance = appliance;

    cost = validateCost(cost);
    cost.error ? errors.cost = cost.error : values.cost = cost;

    firstName = validateLength(firstName, "first name");
    firstName.error ? errors.firstName = firstName.error : values.firstName = firstName;

    lastName = validateLength(lastName, "last name");
    lastName.error ? errors.lastName = lastName.error : values.lastName = lastName;

    address = validateLength(address, "address");
    address.error ? errors.address = address.error : values.address = address;

    mobile = validateMobile(mobile);
    mobile.error ? errors.mobile = mobile.error : values.mobile = mobile;

    email = validateEmail(email);
    email.error ? errors.email = email.error : values.email = email;

    /**
     * 3
     * Checking for errors
     * Error: 400 (generic API error) 
     */


    if (Object.keys(errors).length > 0) {
      return Response.json(
        { values, errors, message: "Error" },
        { status: 400 }
      );
    } 

    /**
     * 4
     * Search db for appliance and user info related to that appliance
     * 
     * Error: 404 (Not found)
     */

    const [rows] = await pool.query(
      `
      SELECT 
      appliances.applianceId,
      appliances.userId
      
      FROM appliances
      WHERE serialNumber = ?
      `,
      [values.serialNumber]
    );

    if (rows.length == 0) {
      return Response.json(
        {
          values,
          errors: {},
          message: "No matching appliance",
          appliance: null
        },
        { status: 404 }
      );
    }

    const userId = rows[0].userId;

    /**
     * 5
     * Update user info in db
     */

    await pool.query(
      
      `
        UPDATE users
        SET firstName = ?, lastName = ?, eircode = ?, address = ?, mobile = ?, email = ?
        WHERE userId = ?          
            
      ` ,
      [
        values.firstName,
        values.lastName,
        values.eircode,
        values.address,
        values.mobile,
        values.email,
        userId
      ]
    );

    /**
     * 6
     * Update appliance info in db
     */

    await pool.query(
      ` 
        UPDATE appliances
        SET modelNumber = ?, brand = ?, appliance = ?, cost = ?
        WHERE serialNumber = ?
        ` ,
      [
        values.modelNumber,
        values.brand,
        values.appliance,
        values.cost,
        values.serialNumber
      ]
    );

    return Response.json(
      { values, errors, message: "Appliance successfully updated" },
      { status: 200 }
    );

  }
  catch (e) {
    console.error(e);
    console.error("Update route ======================================================");

    return Response.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );

  }
}


