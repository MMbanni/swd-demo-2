/*
 * Custom input to imporve UX
 * Acts like forms that add the dashes and spaces for you
 * On input it checks the field and if enough characters are there it adds in whatever separator format requires
*/

export default function Input({ format, onChange, ...props }) {
  const formatAndForward = (e) => {
    let input = e.target.value;
    
    // Format eircode
    if (format === "eircode") {
      input = input.replace(/ /g, ""); // Replaces space with empty space
      const first = input.slice(0,3); 
      const second = input.slice(3,7); // 
      
      let eircode = first;
      if(second) eircode += " " + second;
      
      input = eircode;
    }
    
    // Format model number
    if (format === "model") {
      input = input.replace(/-/g, ""); // 
      const first = input.slice(0,3);
      const second = input.slice(3,6);
      const third = input.slice(6,10);

      let model = first;
      if(second) model += "-" + second;
      if(third) model += "-" + third;
      input = model;
    }
    
    // Format serial number
    if (format === "serial") {
      input = input.replace(/-/g, "");
      const first = input.slice(0,4); 
      const second = input.slice(4,8);
      const third = input.slice(8,12);

      let serial = first;
      if(second) serial += "-" + second;
      if(third) serial += "-" + third;
      input = serial;
    }
    
    // Format date
    if (format === "date") {
      input = input.replace(/\D/g, ""); 
      const day = input.slice(0,2);
      const month = input.slice(2,4); //
      const year = input.slice(4,8);

      let date = day;      
      if(month) date += "/" + month;
      if(year) date += "/" + year;
      input = date;
    }

    if (format === "cost") {
      
    }
    
    // Condition just to demonstrate reusability,
    // Calls parents onChange handler to ipdate state
    if (onChange) {
      onChange(e.target.name, input);
    }
  };

  return <input {...props} onChange={formatAndForward} />;
}