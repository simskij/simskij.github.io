---
title: Performance testing with generated data
canonical_url: https://dev.to/k6/performance-testing-with-generated-data-using-k6-and-faker-2e
---

While performance testing, it might not be a huge issue if the data you submit as part of your tests only vary slightly. In some cases, however, you might find yourself in a position where you'd like to keep not only the user interactions but also the data, as realistic as possible. How do we accomplish this without having to maintain long data tables? In this article, we'll explore how we may utilize [fakerjs]() and k6 to perform load tests using realistic generated data.

<!--more-->

### What is k6?

k6 is an open-source performance testing tool written and maintained by the team at [k6](https://k6.io/). One of the main goals of the project is to provide users with a developer-centered, code-first approach to performance testing.

> ### 🤓 Completely new to k6?
>
> Then it might be a good idea to start out with this [Beginners guide to k6](https://dev.to/mostafa/beginner-s-guide-to-load-testing-with-k6-1od2), written by [Mostafa Moradian](https://dev.to/mostafa).

### What is Faker?

Faker is a tool used for generating realistic data. It's available for a lot of different languages - [python](https://github.com/joke2k/faker), [ruby](https://github.com/faker-ruby/faker), [php](https://github.com/fzaninotto/Faker) and [java](https://github.com/DiUS/java-faker) to name a few.

In this particular case, we'll use the javascript implementation, fakerjs, as it allows us to use it from within our test script, rather than generating the data before execution.

## Goals

Historically performance testing, to a large extent, has been performed by running your test and then manually analyzing the result to spot performance degradation or deviations. k6 uses a different approach, utilizing goal-oriented performance thresholds to create pass/fail tollgates. Let's formulate a scenario (or use case if you prefer) for this test and what it tries to measure.

### The Acme Corp Scenario

Acme Corp is about to release a submission form, allowing users to sign up for their newsletter. As they plan to release this form during Black Friday, they want to make sure that it can withstand the pressure of a lot of simultaneous registrations. After all, they are a company in the business of making everything, so they expect a surge of traffic Friday morning.

### Our test goals

While we could very well set up complex custom thresholds, it's usually more than enough to stick with the basics. In this case, we'll measure the number of requests where we don't receive an HTTP OK (200) status code in the response, as well as the total duration of each request.

We'll also perform the test with 300 virtual users, which will all perform these requests simultaneously.

#### Configuration

In k6, we express this as:

```js
const formFailRate = new Rate('failed form fetches');
const submitFailRate = new Rate('failed form submits');

export const options = {
  // ...
  vus: 300,
  thresholds: {
    'failed form submits': ['rate<0.1'],
    'failed form fetches': ['rate<0.1'],
    http_req_duration: ['p(95)<400'],
  },
};
```

#### What does this mean?

So, let's go through what we've done here. With 300 virtual users trying to fetch and submit the subscription form every second, we've set up the following performance goals:

- Less than 10% are allowed to fail in retrieving the form
- Less than 10% are allowed to fail in submitting the form data
- Only 5% or less are permitted to have a request duration longer than 400ms

---

## The actual test

Now, let's get on to the actual test code. The test code, which is executed by each VU once for each iteration, is put inside an anonymous function. We then expose this function as a default export.

### The sleep test 😴

To make sure our environment is working, I usually start by setting up a test that does nothing except sleeping for a second and execute it once.

```js
import { sleep } from 'k6';

export default function () {
  sleep(1);
}
```

Which, when run, produces output similar to this:

![Running a k6 script with just sleep](https://dev-to-uploads.s3.amazonaws.com/i/mck8bbbkeyhe659a7k4i.png)

### Adding our thresholds

```js
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';

const formFailRate = new Rate('failed form fetches');
const submitFailRate = new Rate('failed form submits');

export const options = {
  // ...
  vus: 300,
  duration: '10s',
  thresholds: {
    'failed form submits': ['rate<0.1'],
    'failed form fetches': ['rate<0.1'],
    http_req_duration: ['p(95)<400'],
  },
};

export default function () {
  formFailRate.add(0);
  submitFailRate.add(0);
  sleep(1);
}
```

Notice the two new lines in the default function? For each iteration, we're now adding data points to our [threshold](https://k6.io/docs/using-k6/thresholds) metrics, telling it that our requests did not fail. We'll hook these up to do something meaningful as we proceed. We also added a duration to make the script run for more than one iteration.

For now, running the script should give you the following output:

![Running a k6 script with sleep and rates](https://dev-to-uploads.s3.amazonaws.com/i/tofe0dhv86f4pcfesjnk.png)

Yay, it passes! Two green checks!

### Adding requests

To be able to measure anything useful, we also need to add some actual requests. In this example, we'll use https://httpbin.test.loadimpact.com/ as our API, which is our mirror of the popular tool [HTTPBin](https://httpbin.org/). Feel free to use whatever HTTP Request sink you prefer!

```js
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';
import http from 'k6/http';

const baseUrl = 'https://httpbin.test.loadimpact.com/anything';
const urls = {
  form: `${baseUrl}/form`,
  submit: `${baseUrl}/form/subscribe`,
};

const formFailRate = new Rate('failed form fetches');
const submitFailRate = new Rate('failed form submits');

export const options = {
  vus: 300,
  duration: '10s',
  thresholds: {
    'failed form submits': ['rate<0.1'],
    'failed form fetches': ['rate<0.1'],
    http_req_duration: ['p(95)<400'],
  },
};

const getForm = () => {
  const formResult = http.get(urls.form);
  formFailRate.add(formResult.status !== 200);
};

const submitForm = () => {
  const submitResult = http.post(urls.submit, {});
  submitFailRate.add(submitResult.status !== 200);
};

export default function () {
  getForm();
  submitForm();
  sleep(1);
}
```

And once again:

![Running k6 with requests](https://dev-to-uploads.s3.amazonaws.com/i/zhtf4sdrgpqzrnxxq569.png)

The output now also includes metrics around our HTTP requests, as well as a little green check next to the duration.

### Adding Bundling and Transpiling

Now that we've got our script to work, it's almost time to add faker. Before we do that, we need to make sure that k6 can use the faker library.

As k6 does not run in a NodeJS environment, but rather in a goja VM, it needs a little help. Thankfully, it's not that complex. We'll use webpack and babel to achieve this, but any bundler compatible with babel would likely work.

Let's start by initializing an npm package and add all the dependencies we'll need:

```bash
$ yarn init -y && yarn add \
    @babel/core \
    @babel/preset-env \
    babel-loader \
    core-js \
    webpack \
    webpack-cli
```

We'll then create our webpack config. The details of webpack and babel are outside the scope of this article, but there are plenty of great resources out there on how it works.

```js
// webpack.config.js

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'test.[name].js',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }],
  },
  stats: {
    colors: true,
  },
  target: 'web',
  externals: /k6(\/.*)?/,
  devtool: 'source-map',
};
```

and the `.babelrc` file:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

We'll also modify our package.json so that we can launch our tests using yarn:

```diff
{
  "name": "k6-faker",
  "scripts": {
+   "pretest": "webpack",
+   "test": "k6 run ./dist/test.main.js"
  },
  ...
}
```

> ### 🧠 Did you know?
>
> Using `pre` or `post` at the beginning of a script name, results in that script running before/after the script you're invoking. In this case, the `pretest` script ensures that every time we run our test, webpack first creates a new, fresh bundle from the source code. - Sweet, huh? 👍🏻

---

## Enter Faker!

Let's get right into it then! The first step is to add faker to our dependencies:

```bash
$ yarn add faker
```

Faker has a quite extensive library of data that it's able to generate, ranging from company details to catchphrases and profile pictures. While these are all handy to have, we'll only use a tiny subset of what faker has to offer. Our object follows this structure:

```json
{
  "name": "jane doe",
  "title": "intergalactic empress",
  "company": "Worldeaters Inc",
  "email": "jane@doe.example",
  "country": "N/A"
}
```

We'll now go ahead and create a service that we may use to generate said persons:

```js
// subscriber.js

import * as faker from 'faker/locale/en_US';

export const generateSubscriber = () => ({
  name: `SUBSCRIPTION_TEST - ${faker.name.firstName()} ${faker.name.lastName()}`,
  title: faker.name.jobTitle(),
  company: faker.company.companyName(),
  email: faker.internet.email(),
  country: faker.address.country(),
});
```

> ### 👿 Possible performance issues ahead!
>
> All dependencies added tend to balloon the memory consumption to some extent, especially when they scale up to 300 concurrent instances. Because of this, it's crucial that we only import the locale(s) we are using in our test case.
>
> While putting together the example repository for this article, I noticed that using faker adds about 2.3MB of memory per VU, which for 300 VUs resulted in a total memory footprint of around 1.5GB.
>
> You can read more about the javascript performance in k6 and how to tune it [here](https://k6.io/docs/using-k6/javascript-compatibility-mode).

You might have noticed that we prepend the name of the generated user with `SUBSCRIPTION_TEST`. Adding a unique identifier for your test data is just something I find convenient to be able to quickly filter out all dummy data I've created as part of a test. While optional, this is usually a good idea - especially if you test against an environment that you can't easily prune.

---

## Final assembly

Now, let's put it all together!

```js
// index.js

import { sleep } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';

import { generateSubscriber } from './subscriber';

const baseUrl = 'https://httpbin.test.loadimpact.com/anything';
const urls = {
  form: `${baseUrl}/form`,
  submit: `${baseUrl}/form/subscribe`,
};

const formFailRate = new Rate('failed form fetches');
const submitFailRate = new Rate('failed form submits');

export const options = {
  vus: 300,
  duration: '10s',
  thresholds: {
    'failed form submits': ['rate<0.1'],
    'failed form fetches': ['rate<0.1'],
    http_req_duration: ['p(95)<400'],
  },
};

const getForm = () => {
  const formResult = http.get(urls.form);
  formFailRate.add(formResult.status !== 200);
};

const submitForm = () => {
  const person = generateSubscriber();
  const payload = JSON.stringify(person);

  const submitResult = http.post(urls.submit, payload);
  submitFailRate.add(submitResult.status !== 200);
};

export default function () {
  getForm();
  submitForm();
  sleep(1);
}
```

```js
// subscriber.js

import * as faker from 'faker/locale/en_US';

export const generateSubscriber = () => ({
  name: `SUBSCRIPTION_TEST - ${faker.name.firstName()} ${faker.name.lastName()}`,
  title: faker.name.jobTitle(),
  company: faker.company.companyName(),
  email: faker.internet.email(),
  country: faker.address.country(),
});
```

And with that, we're ready to go:

![Running k6 with faker, thresholds and http requests](https://dev-to-uploads.s3.amazonaws.com/i/g89wqlleq9867qw8ce7r.png)

---

## Closing thoughts

While the flexibility you get by combining the javascript engine used in k6 with webpack and babel is near endless, it's essential to keep track of the memory consumption and performance of the actual test. After all, getting false positives due to our load generator being out of resources is not particularly helpful.

All the code from this article is available as an example repository on
[GitHub](https://github.com/k6io/example-data-generation), which I try to keep up to date with new versions of k6 and faker.

I'd love to hear your thoughts, so please hit me up with questions and comments in the field below. 👇🏼
