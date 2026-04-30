
import pool from "@/lib/db";
import {
  sanitize,
  validateSerial
} from "@/app/shared/utils/utils";

/**
 * Flow
 * 1: Sanitize input & check errors
 * 2: Search db for appliance
 * 3: Delete from db 
 * 
 * Errors: 400, 404, 500
 */

export async function DELETE(req) {
  try {
    const body = await req.json();

    let serialNumber = sanitize(body.serialNumber);

    const values = {};
    const errors = {};

    serialNumber = validateSerial(serialNumber);
    serialNumber.error
      ? errors.serialNumber = serialNumber.error
      : values.serialNumber = serialNumber;

    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          values,
          errors,
          message: "Bad request"
        },
        { status: 400 }
      );
    }

    /**
     * 2
     * Search db for appliance by SN    
     * Errors: 404 (Not found)
     */

    const [existingAppliances] = await pool.query(
      "SELECT * FROM appliances WHERE serialNumber = ?",
      [values.serialNumber]
    );

    if (existingAppliances.length == 0) {
      return Response.json(
        { message: "Appliance already exists."},
        { status: 404 }
      );
    }
    
    /**
     * 3
     * Delete appliance from db
     */

    await pool.query(
      `
      DELETE FROM appliances
      WHERE serialNumber = ?
      `,
      [values.serialNumber]
    );

    return Response.json(
      { values, errors, message: "Appliance successfully deleted" },
      { status: 200 }
    );

  }
  catch (e) {
    console.error(e);
    console.error("Delete route ======================================================");

    return Response.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );

  }
}


