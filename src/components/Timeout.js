import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'


export default function Timeout({ children, timeout, onTimeout }) {
    useEffect(() => {
        const timer = setTimeout(onTimeout, timeout)
        return () => clearTimeout(timer)
    }, [timeout, onTimeout])

    return children
}

export async function removeOnTimeout(el, timeout, container = document.body) {
    const wrapper = document.createElement('div')
    container.appendChild(wrapper)

    const root = createRoot(wrapper)

    const remove = () => {
        root.unmount()
        container.removeChild(wrapper)
    }

    root.render(
        <Timeout timeout={timeout} onTimeout={remove}>
            {el}
        </Timeout>
    )
}
