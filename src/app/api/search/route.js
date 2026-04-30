import pool from "@/lib/db";
import {
  sanitize,
  validateSerial
} from "@/app/shared/utils/utils";

/**
 * Flow
 * 1: Sanitize serial
 * 2: Build value & error object
 * 3: Search db for appliance using SN
 * 4: If succesful returns appliance object with info on appliance and user
 * 
 * Errors: 400, 404, 500
 */

export async function POST(req) {
  try {
    
    const body = await req.json();
    
    /**
     * 1
     * Sanitize input 
     */
    let serialNumber = sanitize(body.serialNumber);

    const values = {};
    const errors = {};

    serialNumber = validateSerial(serialNumber);
    serialNumber.error
      ? errors.serialNumber = serialNumber.error
      : values.serialNumber = serialNumber;
    
    /**
     * 2
     * Check for errors
     * Error: 400 (generic)
     */    

    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          values,
          errors,
          message: "Error"
        },
        { status: 400 }
      );
    }

    /**
     * 3
     * Search db for appliance and user info related to that appliance
     * 
     * Error: 404 (Not found)
     */

    const [rows] = await pool.query(
      `
        SELECT
        appliances.appliance,
        appliances.brand,
        appliances.modelNumber,
        appliances.serialNumber,
        appliances.purchaseDate,
        appliances.warrantyExpiryDate,
        appliances.cost,


        users.firstName,
        users.lastName,
        users.email,
        users.mobile,
        users.address,
        users.eircode

        FROM appliances
        JOIN Users ON appliances.userId = users.userId
        WHERE appliances.serialNumber = ?
      `,
      [values.serialNumber]
    );

    if (rows.length === 0) {
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

    return Response.json(
      {
        values,
        errors: {},
        message: "Appliance found",
        appliance: rows[0]
      },
      { status: 200 }
    );

  } catch (e) {
    console.error(e);
    console.error("Search route error ================================");

    return Response.json(
      {
        values: {},
        errors: {},
        message: "Server error",
        error: e.message
      },
      { status: 500 }
    );
  }
}