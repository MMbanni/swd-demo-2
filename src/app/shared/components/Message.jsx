export default function Message({ text }) {
 
  if (!text) return null;
  if(typeof text === 'string') return <p>{text}</p>;
  
  // Based on pattern in our Arrays lecture,
  // Checks if prop is an object, if so it loops through it
  // If value is also an object it loops again 
  return (
  <ul>
    {Object.entries(text).map(([key, value]) => {
      if (typeof value === "object") {
        return Object.entries(value).map(([k, v]) => (
          <li key={k}>{v}</li>
        ));
      }

      return <li key={key}>{value}</li>;
    })}
  </ul>
);
}