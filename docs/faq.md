# Frequently asked questions

1. **What is Alignment Negotiation? As an apprentice, when do I use it?**

Once a mentoring agreement has already been established with a mentor, you can
initiate an Alignment Negotiation. This allows both of you to discuss and change
some terms about the mentoring agreement.

In production, these data will be lifted from your growth journal which
contains data about your growth, and metadata about your mentorship engagement.

2. **What does it do exactly?**

This alignment negotiation tool allows you to keep your mentoring engagement, to find
acceptable compromises when negotiating with your mentor/apprentice, and to discern 
if the mentoring engagement is still suitable for both of you.

Your reputation in both performance and negotiation is recorded publicly on the Solana blockchain.
This goes the same way for your mentor.

By clearly stating your expectations, enforcing your boundaries, and negotiating respectfully and
collaboratively you both grow your reputation as apprentice and a mentor.

3. **What happens when someone defaults on their responsibilities?**

The negotiation stake placed by the person that defaulted, will be transferred to the other person.

If you fail in your commitments as an apprentice, your stake gets transferred to your mentor.

If your mentor fails to perform their duties (i.e. attend and facilitate the mentoring sessions), then his stake gets transferred to you.

4. **What are reset options?**

Reset options are ways to allow you and your mentor to clean each other's slate, as if 
neither of you made any mistakes. These reset options give you and your mentor the flexibility to 'cleanse' your records.

This can be useful if for example, as an apprentice, you have had a successful growth streak and your mentor is quite happy
with your progress, they might want to reset the records of your mistakes.

Or if your mentor did extra effort in teaching you, extending even beyond the session,
then you can reset the records of their mistakes.

5. **Why isn't the negotiation parameters and negotiation stakes loaded for an already completed alignment negotiation?**

See MVP limitations 7 and 8 below.

7. **I'm unfamiliar with the terminologies you're using. Where can I read about that?**

Check the [definitions](definitions.md).

8. **What is a growth journal? Where can I see an example of a growth journal?**

Your growth journal content and metacontent is stored in YAML format in a public GitHub repository owned by you, where you have full authority to grant and revoke read/write access to past, present, and future mentors that you will engage with. This growth journal, along with a DSU repository, is what the smart contract interacts with automatically to evaluate your performance.

Check out our growth journal's generated public template to see how Tome.gg mentors are in involved in guiding you in your direction setting and growth- personalized specifically for you.

See an [example of a growth journal](https://www.tome.gg/assets/growth-report.pdf).

7. **I have questions that you haven't answered. Where do I ask them?**

File a GitHub issue:

- If it is a question about the frontend web app: https://github.com/tome-gg/alignment
- If it is a question about the smart contract, or the negotiation protocols: https://github.com/tome-gg/negotiation-protocols
- If it is a question about the Tome.gg platform and community: https://github.com/tome-gg/whitepaper
- If you want to be more informal and just drop by and say hello, or ask a random question: https://bit.ly/3yCdUiE

## MVP limitations

1. 📝 This only a proof-of-concept that focuses on Alignment Negotiation, not establishing a new Mentorship Engagement.

2. ❌ We have an assumption that the Mentoring Engagement smart contract between the two parties already exists.

3. ❌ We have an assumption that the existing mocked "Mentoring Engagement" has the Session Frequency term set to 'Twice a month'.

4. 📝 Usage - the current demo presents a way for you as an apprentice/mentor to negotiate on the Session Frequency mentoring term.
   This lets you agree on a how frequently you and your mentor will meet.

5. ❌ Temporarily, a dummy Solana account is used to represent the Negotiation Term and Protocol.

6. 📝 The 'parameters' of the negotiation is stored as 32 numbers (u8 bytes). Different Negotiation Protocols can utilize 
these 32 numbers to define the parameters of their negotiation.

7. ❌ Currently, TNP 1.0 does not yet have a data definition for its negotiation parameters, and so the 
`parameters` data is left as garbage data. This is why the parameter data on the page does not get loaded.

8. ❌ Currently, TNP 1.0 does not yet have a data definition for staking between mentor and apprentice, such that it fits
a `u64` Rust data type. This is why the staking data on the page does not get loaded.

9. ❌ Currently, TNP 1.0 does not have a proposal design document yet. It's still in my head 😉.

### On proposal, design, and implementation statuses

1. ❌ The Mentoring Engagement smart contract itself is not yet designed nor implemented.

2. ❌ The Tome Negotiation Protocols (e.g. DSU Transparency) are currently undergoing proposal, have some minor designs, 
   but have not yet been implemented. 





## References

- [Alignment Negotiation smart contract](https://github.com/tome-gg/negotiation-protocols)
- [Alignment Negotiation](https://github.com/tome-gg/alignment) Angular web application/client interface