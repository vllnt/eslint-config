interface GreetingProps {
  readonly name: string
}

export function Greeting({ name }: GreetingProps): unknown {
  return <p>Hello {name}</p>
}
