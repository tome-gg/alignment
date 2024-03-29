# Tome.gg: Alignment Negotiation

This is the frontend web application for Tome.gg's proof-of-concept [Alignment Negotiation smart contract](https://github.com/tome-gg/negotiation-protocols). It allows non-developer users to interact with the smart contract.

## What is it?

 Alignment negotiation is a process in mentoring where one party proposes changes to the mentoring agreement, sets clear conditions for failure, outlines potential solutions, and defines the stakes for both parties. 

* Read more on our [FAQ](docs/faq.md). 
* If you're unfamiliar with the other Tome.gg terminologies, check out the [Definitions](docs/definitions.md) to understand what the concepts mean.

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

1. Fix Phantom wallet being unable to sign transactions.
2. Leverage [JSON Forms](https://jsonforms.io/) library for declarative form generation, given a negotiation protocol.
3. Add copyright attribution for used image content, lifted from Pexels.com.

## Contributing

I haven't set up contributing guidelines yet, but feel free to connect with me on Twitter @darrensapalo or [join my community on Discord](http://bit.ly/3yCdUiE).

## License

Apache License 2.0. See [LICENSE.md](LICENSE.md).
