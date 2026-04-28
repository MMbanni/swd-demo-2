"use client";
import { useState } from "react";
import { movies } from "./data/movies";
import { validateBooking, buildMessage } from "../shared/utils/utils"
import { Select, Input, Button, Message } from "../shared/components/";
import { dialCodes } from "./data/dialCodes";

export default function BookingForm() {
  const [state, setState] = useState({
    movie: "",
    time: "",
    mobile: "",
    dialCode: ""
  });
  
  // This i written in a more verbose way than handleChange in part b-c, to demonstrate understanding of the code
  // otherwise we would use ...(name === "movie" && { time: "" }) to make it cleaner
  function handleChange(name, value) {
    setState(prev => {
      const updated = { 
        ...prev, [name]: value
      };
      if (name === "movie") {
        updated.time = "";
      }
      return updated;
    });
  }
  const [message, setMessage] = useState("");

  // Handlers
  function handleSubmit(e) {
    e.preventDefault(); // Stops page from reloading
    const {movie, time, mobile, dialCode} = state; // Destructuring

    // Input validation using utils
    const validationResult = validateBooking(movie, time, mobile);

    // Error first to avoid an issues with dial codes
    if (validationResult.errors) {
      setMessage(buildMessage(validationResult));
    } else {
      const fullNumber = dialCode ? dialCodes[dialCode].dial_code + mobile : mobile;
      setMessage(buildMessage({ movie, time, mobile: fullNumber })); // Build success message using utility fn
    }

  }


  return (
    <form onSubmit={handleSubmit} className="form">

      {/* Movie */}
      <Select
        name="movie"
        value={state.movie}
        onChange={handleChange}
        options={Object.keys(movies)}
      />

      <Select
        name="time"
        value={state.time}
        onChange={handleChange}
        options={state.movie ? movies[state.movie] : []} // If movie is defined, return its airing times
        disabled={!state.movie} // Keep disabled until movie is selected
      />

      <div className="phone-row">
        <Select
          name="dialCode"
          value={state.dialCode}
          onChange={handleChange}
          options={Object.keys(dialCodes)}
        />
        <div className="phone-code">
          {state.dialCode ? dialCodes[state.dialCode].dial_code : ""}
        </div>

        <Input
          name="mobile"
          value={state.mobile}
          onChange={handleChange}
          placeholder="Mobile"
        />
      </div>

      <Button type="submit">Book</Button>

      <Message text={message} />

    </form>
  );
}