export default function Select({ options, onChange, name, ...props }) {

  const handle = (e) => {
    if (onChange) {
      onChange(name, e.target.value)

    }
  }

  // Loop that makes html options from an array
  return (
    <select {...props} name={name} onChange={handle}>
      <option value="">Select</option>

      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  );
}