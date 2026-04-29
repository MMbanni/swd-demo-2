import pool from "@/lib/db";
import {
    sanitize,
    validateSerial
} from "@/app/shared/utils/utils";

export async function POST(req) {
    try {
       
        const body = await req.json();

        console.error(body);
        

        let serialNumber = sanitize(body.serialNumber);
        console.error("serialNumber--------------");
        console.error(serialNumber);
        
        

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