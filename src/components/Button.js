export default function ({ children, ...args }) {
    return <button {...args}>{children}</button>
}