import React, { useState } from 'react'
import isValidAddress from "../utils/isValidAddress"

const EthAddressInput = ({ value, onChange }) => {
  value = value || ""
  
  const handleChange = (e) => {
    const newValue = e.target.value.trim()
    onChange(newValue)
  }

  const inputStyle = {}
  const statusStyle = {}

  const shouldValidate = value && value.trim().length > 0
  const isValid = isValidAddress(value.trim())

  if (shouldValidate) {
    if (isValid) {
      inputStyle.borderColor = 'green'
      statusStyle.color = 'green'
    } else {
      inputStyle.borderColor = 'red'
      statusStyle.color = 'red'
    }
  }

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter token address"
        style={inputStyle}
      />
      {
        shouldValidate
        &&
        <p style={statusStyle}>
          {isValid ? 'Valid address' : 'Invalid address'}
        </p>
      }
    </div>
  )
}

export default EthAddressInput
