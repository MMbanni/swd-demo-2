import fs from "fs";
import path from "path";

const temp = path.join(process.cwd(), "data", "temp.json"); // Store temporary inventory for display

export async function GET() {
    let parsedContent;
    let inventory;
    
    /**
     * Check to see if file exists (ie if we have a registered appliance)
     * Then we return the data to the client
     */
    try {
        if (fs.existsSync(temp)) {
            const fileContent = fs.readFileSync(temp, "utf-8");
            parsedContent = JSON.parse(fileContent);
        }
        inventory = parsedContent[0]
        return Response.json({
            values: inventory,
            errors: {},
            message: "Load inventory successful"
        });
    }
    catch (e) {
        console.error(e);

        return Response.json({
            values: {},
            message: "Empty",
            errors: {}
        })

    }
}