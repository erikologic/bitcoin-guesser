# Bitcoin guesser 

## The problem
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

## The plan
I will use Bob Gregory's (my current manager) framework to analyse the architectural qualities required for this system, [MUSTAPO](https://www.codefiend.co.uk/mustapo-architecture-qualities-list/).

> MUSTAPO stands for:
> 
> - Modifiability
> - Usability
> - Security
> - Testability
> - Availability
> - Performance
> - Observability

For each point, I will try to analyse the system requirements in problem space, before moving to presenting the solution.

### Modifiability 
_What are the requirements for this system to be editable?_  

PROBLEM SPACE  
One of the first questions I'd ask to the relative stakeholders would be "is this a POC or are we 100% going to pivot the biz on this?".  
Some possible answers would be "we just need to drop something quick to test product market fit" or "we have plenty of evidence that we can base our business on top of this idea".  
Right now I would assume the former, and I would feel allowed to commit any sin in order to get a POC out ASAP.

SOLUTION SPACE  
Whatever the case, VCS is a must.  
I am going to base the project on GitHub using Codespaces, so that it should be very easy to pick this up and develop.  
Code will be mostly a copy & paste of examplers projects and blog posts found around the web, so quality will be low.  
I will use React (NextJs) deployed on AWS to adhere with "company standards", but also cause is likely the option with most ready-to-use examples available.  

### Usability
_Who are the user (humans/systems)? What's the likely scenario in which they would be using this service? Do they have special needs?_

PROBLEM SPACE  
Without much user research at hand, I'd speculate the likely scenario is a bored person looking for a quick dopamine kick.  
They would be either sitting on the sofa trying to kill some time, or keep a browser tab open on a side while attending a very boring meeting...........  
A11y would be a point of interest: we obviously wants every class of user have their share of fun.  

SOLUTION SPACE  
The requirements demands a web app.  
I will style in a mobile and ARIA first approach.  
I am aware of ARIA testing library, for sake of times I will probably skip on them.

### Security
_How an attacker could leverage on the CIA triad (confidentiality, integrity and availability)? What would be the consequences a breach?_ 

#### Confidentiality
_Would an attacker be able to obtain confidential informations in our possession?_  

PROBLEM SPACE  
This risk is relatively low: we might store the user login details, prob not their medical records nor credit card plain numbers. For now.  

SOLUTION SPACE  
Consider outsourcing the risk using a managed service for login purposes (Cognito or Firebase + SSO).  
Avoiding storing any type of PII - e.g. use IDs instead of email for connecting a score to a user...  

The ephemeral aspect of serverless is also a mitigation in general: a misconfigured web servers could allow for an access platform to a database; the same attack would be basically impossible to replicate on a Lambda timing out in 30s!  
Misconfiguration on the database could be an issue though, therefore follow a least privilege approach.

_Not an extremely strong concern in this case, but always keep an eye when developing web apps on [XSS, CSRF and MITM](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks)..._

#### Integrity
_Would an attacker be able to mess with the data in a way that would impede our system to operate?_  

PROBLEM SPACE  
The only risk I can think about is the ability of an attacker to mess up with the scoreboard.  
It has a relatively low impact.  

SOLUTION SPACE  
Even if some serverless technologies allow for client side direct database interactions, configure the DB to only accept writes from the server:
```
GIVEN the user bet the price went up
THEN their browser will send a POST /vote {price: up} request to the server
AND the server will update the price
AND the server will redirect the user to the score page
```

#### Availability
_Would an attacker be able to stop our systems from providing services? Typical example is DDOS_  

PROBLEM SPACE  
The only risks I can anticipate for this type of system is DDOS, and those associated with exposed ports with misconfigured services.  

SOLUTION SPACE  
Any serverless service provides usually enough protection for DDOS attacks, but keep an eye on it.
_Should we decide to go self-managed, we would need to consider a WAF, prevent public exposure of unnecessary ports, create admin bastions, etc..._

The only server attack vector I can anticipate is generating too many requests.  
Even without triggering a proper DDOS, an attacker could still impede the web app from running by hitting the account limits with a slow but constant and consistent volume. Or, worse, the app will stay up and will generate an astronomic bill.  
The initial mitigation plan would be to create some monitoring, manually finding and banning abusers. Also, will investigate on how to put account spending limits.  
ATM I don't have anything better and I need to invest some time in understanding how to implement a better mitigation plan that wouldn't require much manual intervention.  


### Testability
_Can we put the system in a certain state and observe its behaviour?_  

PROBLEM SPACE  
Complex systems are best tested in their independent "verticals".  
In this case, given the symplicity, could we just test E2E?  
How would we control the behaviour of third parties (the BTC/USD price service) and times (the 60 secs rule) while testing E2E?  
Should we prevent broken code to land on prod? How could we tell the web app is working after a prod deployment?

SOLUTION SPACE  
Given the strict time box, I will just do some E2E testing on a local environment, mocking the cryptocurrency service.  
Consider adding some after-deployment smoke testing.

### Availability
_What are the availability requirements of the system? e.g. 24x7, nightly batch jobs, office hours..._  

PROBLEM SPACE  
We want the web app to be always available.

SOLUTION SPACE  
This app screams serverless to me.  
_If there would be a need to go self-managed we should particularly consider redundancy (e.g. 2 AZs at least)._


### Performance
_What are the needs in terms of throughput, latency, and scalability?_  

PROBLEM SPACE  
_Throughput is usually a decider for serverless vs service-based - although I worked on a AWS Lambda + NextJS web app that scaled up to 1M/hour hits, and the costs of the service was still far less then the cost of developing other ECS-based solution I took part in..._  
_When considering latency and web apps, we should consider things like geographical distributions of services (users vs CDN vs web server vs database), cache configurations, web app rendering performances (e.g. Lighthouse scores, waterfall renders, content jumping, image loading strategies, etc)._  
_Scalability in a self-managed service would require strategies such as an ASG rule based on CPU consumption..._

Given the POC nature, the requirements of this web app are quite limited on the performance POV.  

SOLUTION SPACE  
Any serverless solution would be vastly sufficient for this delivery.  
However, we would still need to take into consideration the costs of scaling the system - or e.g. be at risk of finding us with a [96k/weekly bill](https://www.reddit.com/r/sveltejs/comments/1da5ywp/caras_96k_wk_vercel_bill_has_shook_me/)...

---
How about the interaction with the BTC/USD price service?  
Do we need to have 1 req/customer/min? Or could we be smarter and just update the price on our BE every minute?

---
What about the scalability of 3rd party services e.g. monitoring?
Will leave for now...

### Observability
_Can we understand what the system is internally doing? Can we monitor its outputs consistently?_ 

PROBLEM SPACE  
At a bare minimum, we should be able to tell that the app is live and usable - e.g. some Synthetic or Client side Error Monitoring.  
"Would be goods":
- Alarms when 3rd parties are down: e.g. the Bitcoin price service
- Do we need to care about e.g. DDOS or is it going to be completely filtered by the various 3rd party service providers?
- Analytics on the web app usage
- RUM maybe? After all, the app is very simple...
- Backend O11y: although using a serverless system, we need to ensure we can understand loads and errors, how far we are from account limits... we should add the relative alarms...
- Can we tell if a limited number of clients are experiencing issues and can we observe their problems?

SOLUTION SPACE  
Depending on time, I'll add Sentry.

## The solution
