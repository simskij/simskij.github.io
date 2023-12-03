---
title: Introduction to Behavior Driven Development
---

Behavior specifications are one of the key concepts of the behaviour-driven development process - BDD for short. These specifications are produced in writing, as a collaboration between business stakeholders and the development team.

The goal of these specifications  is to, as early as possible - ideally before development has even started, reduce ambiguity and risk of defects by creating written, agreed upon, requirements understood by everyone attending the session.

Working with requirements in a software development project is often a lot like playing the popular children’s game Telephone:

* Business stakeholders communicate their requirements to a product owner.
* The product owner in turn tries to formulate acceptance criteria, understandable by the the development team.
* The development team in turn produces features corresponding with *their* understanding of the acceptance criteria.
* The development team then continue to write tests to validate that the actual behaviour matches their interpretation, often in a language that is not suitable for non-developers to consume

What is the actual output after a process like this is completed? If we’re really lucky, the implementation actually reflects what the stakeholders asked for. More often than not, however, we get caught in multiple iterations of adjustment and evaluation until the user finally is satisfied with the result.

This time consuming process, is what BDD and behaviour specifications aim to solve.
## Building blocks
While there are no formal requirements for exactly how behaviour specifications must be written down, the founder of the method - Dan North, have suggested that a typical behaviour specification should consist of two parts, a user story and use case scenarios.

### User stories
Describes the reason for the requirement, formulated as a short user story. These user stories consists of three parts:

* Who
* What
* Why

Meaning:
* Who the primary stakeholder of the story is
* What effect they want to achieve, and
* The actual business value of the achieved effect.

Let’s write one:

> Carrie from finance wants to streamline the billing procedure. Currently, each batch of invoices produced requires her to open them in the accounting system and then press print, one by one for each individual invoice. Carrie feels that this task is both menial and time consuming.

Let’s translate this to a user story:

*As a* financial administrator
*In order to* reduce the amount of manual labor required while billing
*I want to* be able to print invoices as a batch

### Scenarios
We then proceed by describing each specific case of this story in the form of a scenario using the following format:

* Given
* When
* Then
	
*Given*, a certain context or initial condition
*When*, a certain state trigger the scenario
*Then*, we expect one or more outcome

Let’s create a scenario for Carries story:

*Given* ten invoices waiting to be printed
*When* I select all of them in invoice list and press print
*Then* they should all be printed as a batch

However, this does not really capture what Carrie wants to achieve. Let’s add a couple of more expected outcomes to narrow it down further:

*Given* ten invoices waiting to be printed
*When* I select all of them in invoice list and press print
*Then* all of the selected invoices gets printed 
*Then* they should no longer be listed as “waiting to be printed”
*Then* they should be flagged as “Printed”

After discussing this a bit further, one of the participants ask what the intended outcome would be if someone where to select only a subset of the invoices - or, for that matter, none at all.

Carrie explains that if only a subset is selected, then only that subset should be printed. This is of course obvious to her, but not necessarily for everyone else participating in the session.

We’ll go ahead and write a scenario for that as well:

*Given* ten invoices waiting to be printed
*When* I select two of them in the invoice list and press print
*Then*  only the selected invoices should be processed and printed

And in the case of no invoices having been selected at all:

*Given* ten invoices waiting to be printed
*When* no invoices have been selected in the invoice list
*Then* printing should be disabled

This semi-formal form of writing requirements is fairly easy to understand, both for developers and business stakeholders. By making sure all participants understand what they aim to describe before concluding the writing session, we then have created a behaviour specification that leaves very little room for interpretation. These may later be used as the base for our actual test cases, as well as serving as the acceptance criteria for the stories created to fulfil the user story.

### So, to summarize:

* Behaviour specifications consist of two parts; a user story and one or more scenarios.
* These are created during a writing session, attended by both business stakeholders and developers.
* Writing behaviour specifications will help you and your team create requirements with very little room for interpretation.
* Writing these specifications early in the development process, ideally before development has even started, will help you gain a common understanding of the requirements while the cost of change is still low.
