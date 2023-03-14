## Tome.gg Showcase: Alignment Negotiation

This is the frontend web application for Tome.gg's proof-of-concept [Alignment Negotiation smart contract](https://github.com/tome-gg/negotiation-protocols).

For more clarity, check out the [Definitions](docs/definitions.md) to understand what the concepts discussed below mean.

### Capabilities

This web app allows non-developer users to interact with the smart contract.

### Limitations

- 📝 This only a proof-of-concept that focuses on Alignment Negotiation.
- ❌ This makes the assumption that the Mentoring Engagement smart contract between the two parties already exists.
- ❌ The Mentoring Engagement smart contract itself is not yet designed nor implemented.

## Installation

### Requirements

1. Angular CLI `15.2.2`
2. Node.js `v16.14.0`
3. Typescript `4.9.4`

### Development instructions

To run this project locally, serve it on a local development server using:

```
ng serve
```

It will then be accessible at http://localhost:4200 which will automatically reload upon file changes.

## Roadmap

### Tasks ahead

1. Integrate Alignment Negotiation via web3 libraries.
2. Leverage [JSON Forms](https://jsonforms.io/) library for declarative form generation, given a negotiation protocol.

## Contributing

I haven't set up contributing guidelines yet, but feel free to connect with me on Twitter @darrensapalo or [join my community on Discord](http://bit.ly/3yCdUiE).

## License

Apache License 2.0. See [LICENSE.md](LICENSE.md).
