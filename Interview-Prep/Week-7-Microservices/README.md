# Week 7: Microservices Architecture

## 🎯 Overview

Master microservices architecture patterns, communication strategies, and build production-ready distributed systems. Learn API Gateway, service discovery, event-driven architecture, inter-service authentication, and observability.

**Duration:** 7 days (Days 43-49)  
**Time Required:** 4-6 hours/day (weekdays), 6-8 hours (weekend)  
**Difficulty:** Advanced

---

## 📅 Week Schedule

| Day              | Topic                          | Duration | Key Focus                                          |
| ---------------- | ------------------------------ | -------- | -------------------------------------------------- |
| **MON (Day 43)** | Microservices Basics           | 4-6h     | Boundaries, communication patterns, service design |
| **TUE (Day 44)** | API Gateway & Service Registry | 4-6h     | Kong/Express Gateway, Consul, service discovery    |
| **WED (Day 45)** | Event-Driven Communication     | 4-6h     | RabbitMQ, Redis Streams, pub-sub patterns          |
| **THU (Day 46)** | Authentication Across Services | 4-6h     | JWT vs opaque tokens, service-to-service auth      |
| **FRI (Day 47)** | Observability                  | 4-6h     | Logging, monitoring, distributed tracing           |
| **SAT (Day 48)** | Mini Microservice System       | 6-8h     | Users + Orders services with RabbitMQ              |
| **SUN (Day 49)** | Revision & Mock Interview      | 6-8h     | 10 microservices questions, mock interview         |

---

## 🎓 Learning Outcomes

By the end of Week 7, you will:

✅ **Understand microservices architecture** - Benefits, challenges, when to use  
✅ **Design service boundaries** - Domain-driven design, bounded contexts  
✅ **Implement API Gateway** - Request routing, authentication, rate limiting  
✅ **Use service discovery** - Dynamic service registration and lookup  
✅ **Build event-driven systems** - RabbitMQ, Redis Streams, pub-sub patterns  
✅ **Handle distributed authentication** - JWT, opaque tokens, token validation  
✅ **Implement observability** - Centralized logging, metrics, distributed tracing  
✅ **Build complete microservice system** - Multiple services communicating via events  
✅ **Answer microservices interview questions** - 10+ questions with detailed answers  
✅ **Debug distributed systems** - Tracing requests across services  

---

## 📚 Daily Breakdown

### Day 43: Microservices Basics
- **Theory:** Monolith vs Microservices, benefits and challenges
- **Service Boundaries:** Domain-driven design, bounded contexts
- **Communication Patterns:** Synchronous (REST, gRPC) vs Asynchronous (events)
- **Data Management:** Database per service, saga pattern
- **Examples:** Basic microservice setup with Express
- **Tasks:** Design service boundaries for e-commerce system

### Day 44: API Gateway & Service Registry
- **API Gateway:** Request routing, authentication, rate limiting
- **Kong Gateway:** Setup and configuration
- **Express Gateway:** Lightweight alternative
- **Service Registry:** Consul, service registration/discovery
- **Load Balancing:** Client-side vs server-side
- **Examples:** API Gateway with multiple backend services
- **Tasks:** Implement API Gateway with 3 services

### Day 45: Event-Driven Communication
- **Message Queues:** RabbitMQ basics, exchanges, queues
- **Redis Streams:** Consumer groups, message acknowledgment
- **Pub-Sub Pattern:** Event publishing and subscription
- **Event Sourcing:** Event store, event replay
- **Saga Pattern:** Distributed transactions with events
- **Examples:** Order processing with RabbitMQ
- **Tasks:** Build event-driven notification system

### Day 46: Authentication Across Services
- **JWT Tokens:** Stateless authentication, token validation
- **Opaque Tokens:** Centralized token validation
- **Service-to-Service Auth:** API keys, mTLS
- **Token Refresh:** Refresh token strategy
- **Authorization:** Role-based access control across services
- **Examples:** Auth service with token validation
- **Tasks:** Implement distributed authentication system

### Day 47: Observability
- **Centralized Logging:** Winston, ELK stack (Elasticsearch, Logstash, Kibana)
- **Metrics:** Prometheus, Grafana, custom metrics
- **Distributed Tracing:** Jaeger, OpenTelemetry, trace context propagation
- **Health Checks:** Liveness and readiness probes
- **Alerting:** Setting up alerts for critical metrics
- **Examples:** Full observability setup
- **Tasks:** Add tracing to existing services

### Day 48: Mini Microservice System (Project Day)
- **Users Service:** User registration, authentication
- **Orders Service:** Order creation, order management
- **RabbitMQ:** Event communication between services
- **API Gateway:** Single entry point for all services
- **Database:** Separate databases for each service
- **Docker Compose:** Multi-container deployment
- **Observability:** Logging and tracing
- **Time:** 6-8 hours full implementation

### Day 49: Revision & Mock Interview
- **Quick Recap:** All Week 7 concepts summarized
- **10 Microservices Questions:** Design patterns, communication, observability
- **Mock Interview:** System design scenarios
- **Best Practices:** Production microservices checklist
- **Common Pitfalls:** What to avoid in microservices

---

## 📁 Folder Structure

```
Week-7-Microservices/
├── README.md (this file)
├── Day-43-Microservices-Basics/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-44-API-Gateway/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-45-Event-Driven/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-46-Authentication/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-47-Observability/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-48-Mini-Project/
│   ├── PROJECT-GUIDE.md
│   ├── users-service/
│   ├── orders-service/
│   ├── api-gateway/
│   └── docker-compose.yml
└── Day-49-Revision/
    └── REVISION-GUIDE.md
```

---

## 🛠️ Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose
- Basic understanding of REST APIs
- Week 1-3 completed (Node.js, Databases, System Design)
- PostgreSQL knowledge
- RabbitMQ basics (will be covered)

---

## 🎯 Success Criteria

- [ ] Can explain microservices benefits and challenges
- [ ] Designed service boundaries for complex domain
- [ ] Implemented API Gateway with routing and auth
- [ ] Set up service discovery with Consul
- [ ] Built event-driven communication with RabbitMQ
- [ ] Implemented distributed authentication
- [ ] Added observability (logging, metrics, tracing)
- [ ] Built complete microservice system (Users + Orders)
- [ ] Answered 10 microservices interview questions
- [ ] Completed mock microservices interview

---

## 📖 Resources

- [Microservices Patterns by Chris Richardson](https://microservices.io/patterns/index.html)
- [RabbitMQ Tutorial](https://www.rabbitmq.com/getstarted.html)
- [Kong Gateway Docs](https://docs.konghq.com/)
- [Consul Service Discovery](https://www.consul.io/docs)
- [OpenTelemetry](https://opentelemetry.io/)
- [Building Microservices by Sam Newman](https://samnewman.io/books/building_microservices_2nd_edition/)

---

**Ready to master microservices?** Start with [Day 43: Microservices Basics](./Day-43-Microservices-Basics/notes.md)

**Previous Week:** [Week 6 - AI + Agentic Systems](../Week-6-AI-Agentic-Systems/README.md)
