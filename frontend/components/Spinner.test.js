// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.

import React from "react"
import Spinner from "./Spinner";
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('sanity', () => {
  expect(true).toBe(true)
})

test('spinner is on', () => {
  render(<Spinner on={true} />)
  expect(screen.getByText(/Please wait.../i)).toBeInTheDocument();
})

// test('spinner is off', () => {
//   render(<Spinner on={false} />)
//   expect(screen.getByText(/Please wait.../i)).not.toBeInTheDocument();
// })