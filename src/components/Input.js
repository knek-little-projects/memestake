export default function ({ children, ...args }) {
    return <input {...args}>{children}</input>
}