
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
          message: "Error"
        },
        { status: 400 }
      );
    }

    // Check if appliance already exists by serial number
    const [existingAppliances] = await pool.query(
      "SELECT * FROM appliances WHERE serialNumber = ?",
      [values.serialNumber]
    );

    if (existingAppliances.length == 0) {
      return Response.json(
        {
          success: false,
          message: "Appliance already exists.",
        },
        { status: 404 }
      );
    }
    
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
    console.error("Update route ======================================================");

    return Response.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );

  }
}


