# Database Map

> Generated by [`prisma-markdown`](https://github.com/samchon/prisma-markdown)

- [default](#default)

## default

```mermaid
erDiagram
"user" {
  String id PK
  String name
  String email UK
  Boolean emailVerified
  String image "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"session" {
  String id PK
  DateTime expiresAt
  String token UK
  DateTime createdAt
  DateTime updatedAt
  String ipAddress "nullable"
  String userAgent "nullable"
  String userId FK
}
"account" {
  String id PK
  String accountId
  String providerId
  String userId FK
  String accessToken "nullable"
  String refreshToken "nullable"
  String idToken "nullable"
  DateTime accessTokenExpiresAt "nullable"
  DateTime refreshTokenExpiresAt "nullable"
  String scope "nullable"
  String password "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"verification" {
  String id PK
  String identifier
  String value
  DateTime expiresAt
  DateTime createdAt "nullable"
  DateTime updatedAt "nullable"
}
"Project" {
  String id PK
  String name
  DateTime createdAt
  DateTime updatedAt
  String userId FK
}
"Message" {
  String id PK
  String content
  MessageRole role
  MessageType type
  DateTime createdAt
  DateTime updatedAt
  String projectId FK
}
"Fragment" {
  String id PK
  String messageId FK,UK
  String sandboxUrl
  String title
  Json files
  DateTime createdAt
  DateTime updatedAt
}
"session" }o--|| "user" : user
"account" }o--|| "user" : user
"Project" }o--|| "user" : user
"Message" }o--|| "Project" : project
"Fragment" |o--|| "Message" : message
```

### `user`

Properties as follows:

- `id`:
- `name`:
- `email`:
- `emailVerified`:
- `image`:
- `createdAt`:
- `updatedAt`:

### `session`

Properties as follows:

- `id`:
- `expiresAt`:
- `token`:
- `createdAt`:
- `updatedAt`:
- `ipAddress`:
- `userAgent`:
- `userId`:

### `account`

Properties as follows:

- `id`:
- `accountId`:
- `providerId`:
- `userId`:
- `accessToken`:
- `refreshToken`:
- `idToken`:
- `accessTokenExpiresAt`:
- `refreshTokenExpiresAt`:
- `scope`:
- `password`:
- `createdAt`:
- `updatedAt`:

### `verification`

Properties as follows:

- `id`:
- `identifier`:
- `value`:
- `expiresAt`:
- `createdAt`:
- `updatedAt`:

### `Project`

Properties as follows:

- `id`:
- `name`:
- `createdAt`:
- `updatedAt`:
- `userId`:

### `Message`

Properties as follows:

- `id`:
- `content`:
- `role`:
- `type`:
- `createdAt`:
- `updatedAt`:
- `projectId`:

### `Fragment`

Properties as follows:

- `id`:
- `messageId`:
- `sandboxUrl`:
- `title`:
- `files`:
- `createdAt`:
- `updatedAt`:
