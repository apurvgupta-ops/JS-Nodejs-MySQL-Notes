# OSI vs TCP/IP Model Comparison

| **OSI Model Layer**       | **TCP/IP Model Layer**   | **Data Name (PDU)**    | **Description**                                                                 |
|---------------------------|--------------------------|-------------------------|---------------------------------------------------------------------------------|
| **Application (Layer 7)** | **Application**          | **Data**               | Provides services for end-user applications like HTTP, FTP, DNS, SMTP.         |
| **Presentation (Layer 6)**| **Application**          | **Data**               | Handles data format translation, encryption, and compression.                  |
| **Session (Layer 5)**     | **Application**          | **Data**               | Manages sessions (establishment, maintenance, and termination).                |
| **Transport (Layer 4)**   | **Transport**            | **Segment (TCP)** / **Datagram (UDP)** | Ensures reliable or fast delivery with protocols like TCP or UDP.              |
| **Network (Layer 3)**     | **Internet**             | **Packet**             | Handles logical addressing (IP addresses) and routes data between networks.    |
| **Data Link (Layer 2)**   | **Network Access**       | **Frame**              | Structures packets into frames, adds MAC addresses, and manages error checking.|
| **Physical (Layer 1)**    | **Network Access**       | **Bits**               | Transmits raw binary data as electrical, optical, or radio signals.            |
