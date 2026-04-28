import fs from "fs";
import path from "path";
import { parseDate, sanitize, validateAppliance, validateCost, validateDates, validateEircode, validateEmail, validateLength, validateMobile, validateModel, validateSerial } from "@/app/shared/utils/utils";

const filePath = path.join(process.cwd(), "data", "inventory.json");
const temp = path.join(process.cwd(), "data", "temp.json");



export async function POST(req) {
    try {
        const body = await req.json();

        // sanitize
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


        /*
         * Checking for errors first to return API error response
         * Inner condition was an initial idea I had about "sticky behavior".
         * Valid input was to be saved to temp file, which would be used to "populate" fields like our assignment said.
         * Similar to sites using localStorage for user prefs 
         */
        if (Object.keys(errors).length > 0) {
            /* if (Object.keys(values).length > 0) {
                fs.writeFileSync(temp, JSON.stringify(values, null, 2));
            }  */

            return Response.json(
                { values, errors, message: "Error" },
                { status: 400 }
            );
        }


        // Reading inventory file from disk and storing into array
        let parsedContent; // Temporary for saftey, if we passed the value directly to data, an incorrectly formatted inventory file would cause crash
        let data = [];

        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            parsedContent = JSON.parse(fileContent);
        }

        if (!Array.isArray(parsedContent)) parsedContent = []; // If the inventory file we mentioned above is there, we clear the input essentially

        // Validated entry ready for writing
        const newAppliance = {
            eircode: values.eircode,
            appliance: values.appliance,
            brand: values.brand,
            modelNumber: values.modelNumber,
            serialNumber: values.serialNumber,
            purchaseDate: values.purchaseDate,
            warrantyExpiryDate: values.warrantyExpiryDate
        };

        data = parsedContent;
        data.push(newAppliance);
        const tempInv = [newAppliance];

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        fs.writeFileSync(temp, JSON.stringify(tempInv, null, 2)); //Used for part c, didn't want both endpoints using 1 file

        return Response.json(
            { values, errors, message: "Appliance successfully registered" },
            { status: 200 }
        );

    }
    catch (e) {
        console.error(e);
        console.error("Route======================================================");
        
        return Response.json(
            { message: "Server error", error: e.message },
            { status: 500 }
        );

    }
}


