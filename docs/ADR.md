# Bitcoin Guesser

## The Problem

Build a web app that allows users to make guesses on whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute.

Rules:

- The player can at all times see their current score and the latest available BTC price in USD
- The player can choose to enter a guess of either “up” or “down“
- After a guess is entered the player cannot make new guesses until the existing guess is resolved
- The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
- If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
- Players can only make one guess at a time
- New players start with a score of 0

Solution requirements:

- The guesses should be resolved fairly using BTC price data from any available 3rd party API
- The score of each player should be persisted in a backend data store (AWS services preferred)
- Please provide us a link to your deployed solution.
- Optional: Players should be able to close their browser and return back to see their score and continue to make more guesses

## The Assessment

I will use Bob Gregory's framework to analyze the architectural qualities required for this system, [MUSTAPO](https://www.codefiend.co.uk/mustapo-architecture-qualities-list/).

> MUSTAPO stands for:
>
> - Modifiability
> - Usability
> - Security
> - Testability
> - Availability
> - Performance
> - Observability

For each point, I will analyze the system requirements in the problem space before presenting the solution. Finally, I will provide a retrospective on the implementation.

### Modifiability

_What are the requirements for this system to be editable?_

PROBLEM SPACE  
One of the first questions I would ask the stakeholders is whether this is a proof of concept (POC) or if we are fully committed to this idea.  
Depending on the answer, the development approach may differ. For now, I will assume it is a POC and prioritize speed over code quality.  

SOLUTION SPACE  
Version control is a must.  
I will develop the project on GitHub using Codespaces for easy collaboration.  
The code will be probably based on examples and blog posts found online, so the quality may be low.  
I will use React (Next.js) deployed on AWS, as it aligns with company standards and has many readily available examples.  

RETROSPECTIVE
Overall, this project is _too much_ editable IMO!  
I took some risks with the technologies used, which required extra effort to set up a predictable development environment.  
_e.g. I naively tested Server Components with Jest at some point, cause they are still new to me and I wanted to understand how they work, and I ended up spending some time in setting up an E2E testing environment with Playwright - so that I could observe the whole application (framework + code) behaviour._
Eventually, I found myself TDD'ing from the E2E tests, and that was a very interesting experience.  

A note, because of the way these tests are set up, it would be hard to extend them in a scalable way without some effort.  
ATM they are really intended to be run in a serial fashion, mainly because of the mocked CoinCap API server can't differentiate between one test run and the other.  

### Usability

_Who are the users (humans/systems)? What is the likely scenario in which they would be using this service? Do they have special needs?_

PROBLEM SPACE  
Without extensive user research, I will speculate that the likely scenario is a bored person looking for a quick dopamine kick.  
They may be using the web app to kill some time on a the sofa or as a distraction during a boring meeting......  
Accessibility (A11y) is an important consideration to ensure all users can enjoy the experience.  

SOLUTION SPACE  
The requirements call for a web app.  
I will prioritize a mobile-first design and consider ARIA (Accessible Rich Internet Applications) guidelines.  
Due to time constraints, I may skip using ARIA testing libraries.

RETROSPECTIVE
Due to time constraints, I only implemented the mobile design without adding CSS media queries for desktop screens.  
The app has been developed with a test-first approach using Playwright, and the queries are ARIA-based.  
Overall, the app should be usable by all users, Lighthouse reports a 94/100 A11y score, but further testing with tools like Axe would be beneficial.  

### Security

_How could an attacker leverage the CIA triad (confidentiality, integrity, and availability)? What would be the consequences of a breach?_

#### Confidentiality

_Could an attacker obtain confidential information in our possession?_

PROBLEM SPACE  
The risk of confidential information being compromised is relatively low.  
We may store user login details, but not sensitive personal information like medical records or credit card numbers.  

SOLUTION SPACE  
To mitigate the risk, consider using a managed service for login purposes (e.g., Cognito or Firebase + SSO).  
Avoid storing PII and use unique identifiers instead of email addresses to connect scores to users.  
Serverless architecture provides some inherent security benefits, but misconfigurations should still be avoided.

RETROSPECTIVE  
The app does not store any login information.  
At first load, it stores a cookie with an UUID, and that's used to identify the user.  
Potentially, an attacker could steal the cookie and impersonate the user, or self-assigning the ID of another customer by guessing an UUID v4 clash...
Because of the app nature, this is not a major concern.

#### Integrity

_Could an attacker tamper with the data in a way that would disrupt our system?_

PROBLEM SPACE  
The only significant risk to system integrity is an attacker manipulating the scoreboard, which has a relatively low impact.  

SOLUTION SPACE  
To mitigate this risk, configure the database to only accept writes from the server and validate client payloads and business logic on the server side.  

RETROSPECTIVE  
While there are ways an attacker could manipulate the scoreboard, the impact is low.  
For example, an attacker could send a POST request to update the guess, impersonating another user cookie by guessing their UUID.  
However, due to the nature of the app, this is not a major concern.  

#### Availability

_Could an attacker prevent our systems from providing services?_  

PROBLEM SPACE  
The main risks to availability are DDoS attacks and misconfigured services with exposed ports.  

SOLUTION SPACE  
Some serverless services provide some protection against DDoS attacks, but it is still important to monitor and mitigate these risks.  
If self-managed, consider implementing a web application firewall (WAF), preventing public exposure of unnecessary ports, and creating admin bastions. Throttling API Gateway can also help prevent abuse.  

The only server attack vector I can anticipate is generating too many requests.  
Even without triggering a proper DDoS, an attacker could still e.g. crete havoc with the service by a targeted constant flow of requests leading to an astronomic bill.  
The initial mitigation plan would be to create some monitoring, manually finding and banning abusers. Also, will investigate on how to put account spending limits.  
ATM I don't have anything better and I need to invest some time in understanding how to implement a better mitigation plan that wouldn't require much manual intervention.  

RETROSPECTIVE  
I just found out that this is a major concern.  
The app is deployed on AWS, with regional Lambdas being invoked by a CloudFront distribution.  
I could turn on the AWS WAF, but that's expensive.  
Without it, I cannot do any sorts of rate limiting, and I'm exposed to a potential DDoS attack - which could have an impact on bills.  
To properly mitigate this risk, I could use the CloudFlare free tier WAF/CDN, but that would require a lot of time to set up properly.  

### Testability

_Can we put the system in a certain state and observe its behavior?_  

PROBLEM SPACE  
For complex systems, it is best to test them in independent "verticals".  
In this case, due to the simplicity of the app, end-to-end (E2E) testing may be sufficient - although, controlling the behavior of third-party services and timing during E2E testing may be challenging.  
It is also important to prevent broken code from reaching production and ensure the web app is functioning correctly after deployment.  

SOLUTION SPACE  
Given the time constraints, I will focus on E2E testing in a local environment, mocking the cryptocurrency service. After deployment, consider adding smoke testing to ensure the app is working as expected.

RETROSPECTIVE  
Initially, I attempted to use a combination of E2E and inside-out TDD (Test-Driven Development) but encountered challenges with integrating these approaches with Server Components.  
Eventually, I settled on E2E testing the entire user journey, which proved valuable in understanding the behavior of the app (framework + custom code) and refactoring complex pieces (moving components between server and client, changing 2 DDB GetItems in 1 Query).  

### Availability

_What are the availability requirements of the system?_  

PROBLEM SPACE  
The web app should be available 24/7.

SOLUTION SPACE  
A serverless solution is well-suited for this requirement.  
If self-managed, consider redundancy with multiple availability zones (AZs) to ensure high availability.

RETROSPECTIVE  
The app is currently deployed as a serverless solution and is highly available.  

### Performance

_What are the needs in terms of throughput, latency, and scalability?_

PROBLEM SPACE  
_When it comes to latency and web apps, it is important to consider factors such as the geographical distribution of users and services (CDN, web server, database), cache configurations, web app rendering performance (e.g., Lighthouse scores, waterfall renders, content jumping, image loading strategies, etc.). 
For scalability in a self-managed service would require strategies for ASGs (70% CPU consumption) and LBs (round-robin)._  
Given the nature of this project as a PoC, the performance requirements are relatively limited.  


SOLUTION SPACE  
Any serverless solution would be sufficient for this delivery.  
However, it is important to consider the costs of scaling the system - or e.g. be at risk of finding us with a [96k/weekly bill](https://www.reddit.com/r/sveltejs/comments/1da5ywp/caras_96k_wk_vercel_bill_has_shook_me/)...  
The interaction with the BTC/USD price service should also be optimized to avoid unnecessary requests.

RETROSPECTIVE  
I'm quite happy with the performances.  

In terms of UI, is fairly lightweight, and because Server Components, the app is very performant:

![LightHouse score](./lighthouse.png)

I am not too much worried about the scalability of AWS services - more the costs...

The BTC price service offers 500 req/min in the free tier, which is quite generous.  
I didn't had time to investigate its performance properly.  
_Initially, I took an approach where every user connected would generate a GET to the BTC price service at the update rate._  
_Then, I found Next.Js (and OpenNext + SST) allow for caching the response of the fetch across all users `{next: {revalidate: REVALIDATE_RATE}}`._  
_This is nice and scary, there are a number of moving parts supporting this on AWS for which I have 0 experience, so something to keep an eye on._

### Observability

_Can we understand what the system is doing internally? Can we monitor its outputs consistently?_

PROBLEM SPACE  
At a minimum, we should be able to determine if the app is live and usable - e.g. some Synthetic or Client side Error Monitoring.  
Additional observability requirements include monitoring third-party services, detecting and mitigating attacks, analyzing web app usage quantitatively (metrics) and qualitatively (RUM), and observing backend performance and errors.  

SOLUTION SPACE  
Because of the PoC nature, I will just add Sentry if I have time

RETROSPECTIVE  
Due to time constraints, I did not have the opportunity to investigate adding Sentry to this project.  

