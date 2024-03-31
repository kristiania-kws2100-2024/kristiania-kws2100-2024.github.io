# Goal: Create a realtime application showing buses moving on a map

- [ ] Create a basic React application
- [ ] Create gtfs-realtime bindings for protobuf
- [ ] Fetch and visualise vehicle data
- [ ] Save and aggregate information
- [ ] Display basic map
- [ ] Show points and lines in map

## How it works:

1. Download [`protoc`](https://github.com/protocolbuffers/protobuf/releases) and store it locally (but `.gitignored`
   - it's pretty big)
2. `npm install ts-proto` for TypeScript bindings
3. Download the [gtfs-realtime.proto spec](https://github.com/google/transit/blob/master/gtfs-realtime/proto/gtfs-realtime.proto)

## Resources

- [ENTUR devloper portal](https://developer.entur.org/pages-real-time-api)
- [Protobuf specification](https://protobuf.dev/)
- [protoc tool installation](https://grpc.io/docs/protoc-installation/)
  - [protoc releases](https://github.com/protocolbuffers/protobuf/releases)
- [ts-proto project](https://github.com/stephenh/ts-proto)
  - [Using protobuf with TypeScript](https://dev.to/icarossio/using-protobuf-with-typescript-2gdj)
- [gtfs-realtime specification](https://github.com/google/transit/blob/master/gtfs-realtime/proto/gtfs-realtime.proto)
- [General Transit Feed Specification](https://gtfs.org/)
