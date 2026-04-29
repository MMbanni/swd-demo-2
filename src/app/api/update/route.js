
import pool from "@/lib/db";
import {
  convertDateToMysql,
  parseDate,
  sanitize,
  validateAppliance,
  validateCost,
  validateDates,
  validateEircode,
  validateEmail,
  validateLength,
  validateMobile,
  validateModel,
  validateSerial
} from "@/app/shared/utils/utils";


export async function PUT(req) {
  try {
    const body = await req.json();

    // sanitize input
    let eircode = sanitize(body.eircode);
    let appliance = sanitize(body.appliance);
    let brand = sanitize(body.brand);
    let modelNumber = sanitize(body.modelNumber);
    let serialNumber = sanitize(body.serialNumber);
    let purchaseDate = sanitize(body.purchaseDate);
    let warrantyExpiryDate = sanitize(body.warrantyExpiryDate);
    let cost = sanitize(body.cost);

    let firstName = sanitize(body.firstName);
    let lastName = sanitize(body.lastName);
    let address = sanitize(body.address);
    let mobile = sanitize(body.mobile);
    let email = sanitize(body.email);


    /*
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

    const p = parseDate(purchaseDate);
    const w = parseDate(warrantyExpiryDate);
    const dates = validateDates([p, w]);
    if (dates.error) {
      errors.dates = dates.error
    } else {
      values.purchaseDate = purchaseDate;
      values.warrantyExpiryDate = warrantyExpiryDate;
    }

    //Checking for errors first to return API error response      
    if (Object.keys(errors).length > 0) {
      return Response.json(
        { values, errors, message: "Error" },
        { status: 400 }
      );
    }

    // Convert dates to MySQL format
    // Will be stored in String in future update
    purchaseDate = convertDateToMysql(values.purchaseDate);
    warrantyExpiryDate = convertDateToMysql(values.warrantyExpiryDate);

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

    // Insert appliance linked to that user
    await pool.query(
      `
            INSERT INTO Appliances
            (userId, appliance, brand, modelNumber, serialNumber, purchaseDate, warrantyExpiryDate, cost)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
      [
        userId,
        values.appliance,
        values.brand,
        values.modelNumber,
        values.serialNumber,
        purchaseDate,
        warrantyExpiryDate,
        values.cost
      ]
    );

    return Response.json(
      { values, errors, message: "Appliance successfully registered" },
      { status: 200 }
    );

  }
  catch (e) {
    console.error(e);
    console.error("Add route ======================================================");

    return Response.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );

  }
}


