import React from 'react'
import { removeOnTimeout } from "../components/Timeout"
import './Reward.scss'

export default function Reward({ left, top, children, className }) {
  const style = {
    left: `${left}px`,
    top: `${top}px`,
  }
  return <div style={style} className={`reward ${className}`}>{children}</div>
}


export async function floatReward({ left, top, value, container, timeout, className }) {
  removeOnTimeout(
    <Reward left={left} top={top} className={className}>
      {value}
    </Reward>,
    timeout,
    container,
  )
}