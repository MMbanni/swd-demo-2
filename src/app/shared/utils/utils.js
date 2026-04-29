// Used regex-generator by Olaf Neumann
// https://regex-generator.olafneumann.org/

import { appliances } from "@/app/add/data/appliances";

// Basic input sanitization, prevents adding html tags
export function sanitize(input) {
  // Undefined check to avoid returning string "undefined"
  if (input === undefined || input === null) {
    return undefined;
  }

  const cleaned = String(input)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();

  return cleaned === "" ? undefined : cleaned;
}

export function validateBooking(movie, time, mobile) {
  const errors = []
  if (!movies[movie]) {
    errors.push("Invalid movie");
  } else if (!movies[movie].includes(time)) {
    errors.push( "Invalid airtime for this movie");
  }
// Regex test for mobil number, only digits, between 6-15 digits 
  if(!/^[0-9]{6,15}$/.test(mobile)) errors.push("Please enter valid phone number");

  return errors.length > 0 ? {errors}: {movie, time, mobile};
}

export function buildMessage({movie, time, mobile, errors}) {
  
  if (errors) { return errors}
  return `Booking for ${movie} at ${time}. SMS sent to ${mobile}`;
}

export function validateEircode(eircode) {
  if (!/^D\d\d \d\d\d\d$/.test(eircode)) {
    return { error: "Invalid Eircode. Format is D00 0000" };
  }
  return eircode
}

export function validateModel(model) {
  if (!(/^\d\d\d-\d\d\d-\d\d\d\d$/.test(model))) {
    return { error: "Invalid Model No. Format is 000-000-0000" };
  }
  return model
}

export function validateSerial(serial) {
  if (!(/^\d\d\d\d-\d\d\d\d-\d\d\d\d$/.test(serial))) {
    return { error: "Invalid Serial No. Format is 0000-0000-0000" }
  }
  return serial
}

export function validateCost(cost) {
  if (!(/^\d+(\.\d+)?$/.test(cost))) {
    return { error: "Invalid price. Format is 0.00" };
  }
  if (/^\d{9,}$/.test(cost)) {
    return { error: "Invalid price. Format is 0.00" };
  }

  return cost;
}



export function parseDate(dateStr) {
  const parts = dateStr.split("/");

  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day); // -1 because JS months are 0 based

  /*
   * Googled after errors
   * Checks if JS has "corrected" my date
   */

  const isValid = 
    date.getFullYear() === year &&  
    date.getMonth() === month - 1 && 
    date.getDate() === day; 

  return isValid ? date : null; 
}

export function convertDateToMysql(dateStr) {
  const parts = dateStr.split("/");
  return parts[2] + "-" + parts[1] + "-" + parts[0];
}

export function validateDates([purchaseDate, warrantyExpiryDate]) {
  if (!purchaseDate || !warrantyExpiryDate) return { error: "Invalid date format" };
  if (purchaseDate > warrantyExpiryDate) return { error: "Invalid warranty" };
  if (purchaseDate > Date.now()) return { error: "Purchase date has not happened yet" };
  return {
    purchaseDate: purchaseDate,
    warrantyExpiryDate: warrantyExpiryDate
  };
}


export function validateAppliance(appliance) {
  
  if (!appliances.includes(appliance)) return { error: "Invalid appliance" };
  return appliance  
}


export function validateLength(input, message) {
  
  if (!input || input.trim() === "") return { error: `Please enter ${message}` }
  if(!(/^[A-Za-z]{1,50}$/.test(input))) return { error: `Invalid ${message} ` } ;
  return input
}

export function validateMobile(mobile) {
  // Regex test for mobil number, only digits, between 6-15 digits 
  if(!(/^[0-9]{6,15}$/.test(mobile))) return { error: "Please enter valid phone number"};
  return mobile
}

// Regex for email from geeksforgeeks.com
export function validateEmail(email) {
  // Regex test for mobil number, only digits, between 6-15 digits 
  if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) return { error: "Please enter valid email"};
  return email
}

