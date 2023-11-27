---
title: Behavior Driven Testing in Go Using Ginkgo
---

### Test automation
Test automation is the practice of taking tests that traditionally have been executed manually and instead implement them programmatically. By making your tests part of the code you also allow yourself to run the tests continuously every time you make a change in the code while adding little to no additional cost.

A high amount of relevant, high-quality and automated tests is one of the most important factors in maintaining high software quality while keeping the cost of change as low as possible.

### The problem

A common problem while practicing test-driven development, or writing unit tests at all for that matter, is that the tests tend to be very centered around the technical implementation.

Example:
```go
func TestApprovePurchaseOrder_ShouldCallTheApprovalService(t *t.Testing)
{
  service := &MockApprovalService{}
  order := &PurchaseOrder{
    ApprovalService: service,
    // ...
  }
  order.Approve()
  Expect(service.HasBeenCalled).To(Equal(true))
}
```

While ensuring that the code does what we expect it to, this approach has a couple of downsides.

* For someone not fluent in reading code, it might be hard to tell what this test helps ensure.

* If someone were to refactor, or change, the code under test; they would be likely to have to spend time rewriting the test - even though the business behavior might not even have changed.

#### Describing tests through behavior

This is where using ginkgo and practicing behavior-driven testing really makes a difference. Consider the following test:

```
the function for approving a purchase order
should call the approval service
```

Now let’s rewrite it into a BDD-style test:

```
given a purchase order
 when it's pending approval
  and we approve it
 then it should become approved once 
```

At least to me, this test title is a lot clearer. Bu using this format, a product stakeholder, even with no coding experience what so ever, will be able to understand what this test case proves and under what circumstances.

Let's go through each of the building blocks that make up this test description:

**Given**, a certain context or initial condition
**When**, a certain state trigger the scenario
**Then**, we expect one or more outcome

This semi-formal form of writing requirements is fairly easy to understand, for developers and business stakeholders alike. By making sure all participants understand what they aim to describe, we have created a behavior specification, or behavior test, that leaves very little room for interpretation. 

#### A possible solution

Let’s write the whole thing:

```go
  var _ = Describe("a purchase order", func() {
    When("pending approval", func() {
      When("we approve it", func() {
        It("should become approved once we approve it", func() {
          service := &MockApprovalService{}
          order := &PurchaseOrder{
            ApprovalService: service,
            // ...
          }
          Expect(order.IsApproved).ToNot(Equal(true))
          order.Approve()
          Expect(order.IsApproved).To(Equal(true))
        })
      })
    })
  })
```

And that was it! We've now written our first behavior-driven unit test using ginkgo! 👏🏼


---

### So, to summarize:

* Using [ginkgo](https://github.com/onsi/ginkgo), or [goconvey](https://github.com/smartystreets/goconvey/) if you prefer, allows you to easily formulate tests that are decoupled from the actual implementation.
* Using common written English to describe our tests allows us to generate test reports readable and understandable by anyone on the product team.

Thanks for reading! 🙏🏼