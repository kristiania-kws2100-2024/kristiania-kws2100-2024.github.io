/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "transit_realtime";

/**
 * The contents of a feed message.
 * A feed is a continuous stream of feed messages. Each message in the stream is
 * obtained as a response to an appropriate HTTP GET request.
 * A realtime feed is always defined with relation to an existing GTFS feed.
 * All the entity ids are resolved with respect to the GTFS feed.
 * Note that "required" and "optional" as stated in this file refer to Protocol
 * Buffer cardinality, not semantic cardinality.  See reference.md at
 * https://github.com/google/transit/tree/master/gtfs-realtime for field
 * semantic cardinality.
 */
export interface FeedMessage {
  /** Metadata about this feed and feed message. */
  header:
    | FeedHeader
    | undefined;
  /** Contents of the feed. */
  entity: FeedEntity[];
}

/** Metadata about a feed, included in feed messages. */
export interface FeedHeader {
  /**
   * Version of the feed specification.
   * The current version is 2.0.  Valid versions are "2.0", "1.0".
   */
  gtfsRealtimeVersion: string;
  incrementality?:
    | FeedHeader_Incrementality
    | undefined;
  /**
   * This timestamp identifies the moment when the content of this feed has been
   * created (in server time). In POSIX time (i.e., number of seconds since
   * January 1st 1970 00:00:00 UTC).
   */
  timestamp?: number | undefined;
}

/**
 * Determines whether the current fetch is incremental.  Currently,
 * DIFFERENTIAL mode is unsupported and behavior is unspecified for feeds
 * that use this mode.  There are discussions on the GTFS Realtime mailing
 * list around fully specifying the behavior of DIFFERENTIAL mode and the
 * documentation will be updated when those discussions are finalized.
 */
export enum FeedHeader_Incrementality {
  FULL_DATASET = 0,
  DIFFERENTIAL = 1,
  UNRECOGNIZED = -1,
}

export function feedHeader_IncrementalityFromJSON(object: any): FeedHeader_Incrementality {
  switch (object) {
    case 0:
    case "FULL_DATASET":
      return FeedHeader_Incrementality.FULL_DATASET;
    case 1:
    case "DIFFERENTIAL":
      return FeedHeader_Incrementality.DIFFERENTIAL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return FeedHeader_Incrementality.UNRECOGNIZED;
  }
}

export function feedHeader_IncrementalityToJSON(object: FeedHeader_Incrementality): string {
  switch (object) {
    case FeedHeader_Incrementality.FULL_DATASET:
      return "FULL_DATASET";
    case FeedHeader_Incrementality.DIFFERENTIAL:
      return "DIFFERENTIAL";
    case FeedHeader_Incrementality.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** A definition (or update) of an entity in the transit feed. */
export interface FeedEntity {
  /**
   * The ids are used only to provide incrementality support. The id should be
   * unique within a FeedMessage. Consequent FeedMessages may contain
   * FeedEntities with the same id. In case of a DIFFERENTIAL update the new
   * FeedEntity with some id will replace the old FeedEntity with the same id
   * (or delete it - see is_deleted below).
   * The actual GTFS entities (e.g. stations, routes, trips) referenced by the
   * feed must be specified by explicit selectors (see EntitySelector below for
   * more info).
   */
  id: string;
  /**
   * Whether this entity is to be deleted. Relevant only for incremental
   * fetches.
   */
  isDeleted?:
    | boolean
    | undefined;
  /**
   * Data about the entity itself. Exactly one of the following fields must be
   * present (unless the entity is being deleted).
   */
  tripUpdate?: TripUpdate | undefined;
  vehicle?: VehiclePosition | undefined;
  alert?:
    | Alert
    | undefined;
  /** NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future. */
  shape?: Shape | undefined;
  stop?: Stop | undefined;
  tripModifications?: TripModifications | undefined;
}

/**
 * Realtime update of the progress of a vehicle along a trip.
 * Depending on the value of ScheduleRelationship, a TripUpdate can specify:
 * - A trip that proceeds along the schedule.
 * - A trip that proceeds along a route but has no fixed schedule.
 * - A trip that have been added or removed with regard to schedule.
 *
 * The updates can be for future, predicted arrival/departure events, or for
 * past events that already occurred.
 * Normally, updates should get more precise and more certain (see
 * uncertainty below) as the events gets closer to current time.
 * Even if that is not possible, the information for past events should be
 * precise and certain. In particular, if an update points to time in the past
 * but its update's uncertainty is not 0, the client should conclude that the
 * update is a (wrong) prediction and that the trip has not completed yet.
 *
 * Note that the update can describe a trip that is already completed.
 * To this end, it is enough to provide an update for the last stop of the trip.
 * If the time of that is in the past, the client will conclude from that that
 * the whole trip is in the past (it is possible, although inconsequential, to
 * also provide updates for preceding stops).
 * This option is most relevant for a trip that has completed ahead of schedule,
 * but according to the schedule, the trip is still proceeding at the current
 * time. Removing the updates for this trip could make the client assume
 * that the trip is still proceeding.
 * Note that the feed provider is allowed, but not required, to purge past
 * updates - this is one case where this would be practically useful.
 */
export interface TripUpdate {
  /**
   * The Trip that this message applies to. There can be at most one
   * TripUpdate entity for each actual trip instance.
   * If there is none, that means there is no prediction information available.
   * It does *not* mean that the trip is progressing according to schedule.
   */
  trip:
    | TripDescriptor
    | undefined;
  /** Additional information on the vehicle that is serving this trip. */
  vehicle?:
    | VehicleDescriptor
    | undefined;
  /**
   * Updates to StopTimes for the trip (both future, i.e., predictions, and in
   * some cases, past ones, i.e., those that already happened).
   * The updates must be sorted by stop_sequence, and apply for all the
   * following stops of the trip up to the next specified one.
   *
   * Example 1:
   * For a trip with 20 stops, a StopTimeUpdate with arrival delay and departure
   * delay of 0 for stop_sequence of the current stop means that the trip is
   * exactly on time.
   *
   * Example 2:
   * For the same trip instance, 3 StopTimeUpdates are provided:
   * - delay of 5 min for stop_sequence 3
   * - delay of 1 min for stop_sequence 8
   * - delay of unspecified duration for stop_sequence 10
   * This will be interpreted as:
   * - stop_sequences 3,4,5,6,7 have delay of 5 min.
   * - stop_sequences 8,9 have delay of 1 min.
   * - stop_sequences 10,... have unknown delay.
   */
  stopTimeUpdate: TripUpdate_StopTimeUpdate[];
  /**
   * The most recent moment at which the vehicle's real-time progress was measured
   * to estimate StopTimes in the future. When StopTimes in the past are provided,
   * arrival/departure times may be earlier than this value. In POSIX
   * time (i.e., the number of seconds since January 1st 1970 00:00:00 UTC).
   */
  timestamp?:
    | number
    | undefined;
  /**
   * The current schedule deviation for the trip.  Delay should only be
   * specified when the prediction is given relative to some existing schedule
   * in GTFS.
   *
   * Delay (in seconds) can be positive (meaning that the vehicle is late) or
   * negative (meaning that the vehicle is ahead of schedule). Delay of 0
   * means that the vehicle is exactly on time.
   *
   * Delay information in StopTimeUpdates take precedent of trip-level delay
   * information, such that trip-level delay is only propagated until the next
   * stop along the trip with a StopTimeUpdate delay value specified.
   *
   * Feed providers are strongly encouraged to provide a TripUpdate.timestamp
   * value indicating when the delay value was last updated, in order to
   * evaluate the freshness of the data.
   *
   * NOTE: This field is still experimental, and subject to change. It may be
   * formally adopted in the future.
   */
  delay?: number | undefined;
  tripProperties?: TripUpdate_TripProperties | undefined;
}

/**
 * Timing information for a single predicted event (either arrival or
 * departure).
 * Timing consists of delay and/or estimated time, and uncertainty.
 * - delay should be used when the prediction is given relative to some
 *   existing schedule in GTFS.
 * - time should be given whether there is a predicted schedule or not. If
 *   both time and delay are specified, time will take precedence
 *   (although normally, time, if given for a scheduled trip, should be
 *   equal to scheduled time in GTFS + delay).
 *
 * Uncertainty applies equally to both time and delay.
 * The uncertainty roughly specifies the expected error in true delay (but
 * note, we don't yet define its precise statistical meaning). It's possible
 * for the uncertainty to be 0, for example for trains that are driven under
 * computer timing control.
 */
export interface TripUpdate_StopTimeEvent {
  /**
   * Delay (in seconds) can be positive (meaning that the vehicle is late) or
   * negative (meaning that the vehicle is ahead of schedule). Delay of 0
   * means that the vehicle is exactly on time.
   */
  delay?:
    | number
    | undefined;
  /**
   * Event as absolute time.
   * In Unix time (i.e., number of seconds since January 1st 1970 00:00:00
   * UTC).
   */
  time?:
    | number
    | undefined;
  /**
   * If uncertainty is omitted, it is interpreted as unknown.
   * If the prediction is unknown or too uncertain, the delay (or time) field
   * should be empty. In such case, the uncertainty field is ignored.
   * To specify a completely certain prediction, set its uncertainty to 0.
   */
  uncertainty?: number | undefined;
}

/**
 * Realtime update for arrival and/or departure events for a given stop on a
 * trip. Updates can be supplied for both past and future events.
 * The producer is allowed, although not required, to drop past events.
 */
export interface TripUpdate_StopTimeUpdate {
  /** Must be the same as in stop_times.txt in the corresponding GTFS feed. */
  stopSequence?:
    | number
    | undefined;
  /** Must be the same as in stops.txt in the corresponding GTFS feed. */
  stopId?: string | undefined;
  arrival?: TripUpdate_StopTimeEvent | undefined;
  departure?:
    | TripUpdate_StopTimeEvent
    | undefined;
  /**
   * Expected occupancy after departure from the given stop.
   * Should be provided only for future stops.
   * In order to provide departure_occupancy_status without either arrival or
   * departure StopTimeEvents, ScheduleRelationship should be set to NO_DATA.
   */
  departureOccupancyStatus?: VehiclePosition_OccupancyStatus | undefined;
  scheduleRelationship?:
    | TripUpdate_StopTimeUpdate_ScheduleRelationship
    | undefined;
  /**
   * Realtime updates for certain properties defined within GTFS stop_times.txt
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  stopTimeProperties?: TripUpdate_StopTimeUpdate_StopTimeProperties | undefined;
}

/** The relation between the StopTimeEvents and the static schedule. */
export enum TripUpdate_StopTimeUpdate_ScheduleRelationship {
  /**
   * SCHEDULED - The vehicle is proceeding in accordance with its static schedule of
   * stops, although not necessarily according to the times of the schedule.
   * At least one of arrival and departure must be provided. If the schedule
   * for this stop contains both arrival and departure times then so must
   * this update. Frequency-based trips (GTFS frequencies.txt with exact_times = 0)
   * should not have a SCHEDULED value and should use UNSCHEDULED instead.
   */
  SCHEDULED = 0,
  /**
   * SKIPPED - The stop is skipped, i.e., the vehicle will not stop at this stop.
   * Arrival and departure are optional.
   */
  SKIPPED = 1,
  /**
   * NO_DATA - No StopTimeEvents are given for this stop.
   * The main intention for this value is to give time predictions only for
   * part of a trip, i.e., if the last update for a trip has a NO_DATA
   * specifier, then StopTimeEvents for the rest of the stops in the trip
   * are considered to be unspecified as well.
   * Neither arrival nor departure should be supplied.
   */
  NO_DATA = 2,
  /**
   * UNSCHEDULED - The vehicle is operating a trip defined in GTFS frequencies.txt with exact_times = 0.
   * This value should not be used for trips that are not defined in GTFS frequencies.txt,
   * or trips in GTFS frequencies.txt with exact_times = 1. Trips containing StopTimeUpdates
   * with ScheduleRelationship=UNSCHEDULED must also set TripDescriptor.ScheduleRelationship=UNSCHEDULED.
   * NOTE: This field is still experimental, and subject to change. It may be
   * formally adopted in the future.
   */
  UNSCHEDULED = 3,
  UNRECOGNIZED = -1,
}

export function tripUpdate_StopTimeUpdate_ScheduleRelationshipFromJSON(
  object: any,
): TripUpdate_StopTimeUpdate_ScheduleRelationship {
  switch (object) {
    case 0:
    case "SCHEDULED":
      return TripUpdate_StopTimeUpdate_ScheduleRelationship.SCHEDULED;
    case 1:
    case "SKIPPED":
      return TripUpdate_StopTimeUpdate_ScheduleRelationship.SKIPPED;
    case 2:
    case "NO_DATA":
      return TripUpdate_StopTimeUpdate_ScheduleRelationship.NO_DATA;
    case 3:
    case "UNSCHEDULED":
      return TripUpdate_StopTimeUpdate_ScheduleRelationship.UNSCHEDULED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TripUpdate_StopTimeUpdate_ScheduleRelationship.UNRECOGNIZED;
  }
}

export function tripUpdate_StopTimeUpdate_ScheduleRelationshipToJSON(
  object: TripUpdate_StopTimeUpdate_ScheduleRelationship,
): string {
  switch (object) {
    case TripUpdate_StopTimeUpdate_ScheduleRelationship.SCHEDULED:
      return "SCHEDULED";
    case TripUpdate_StopTimeUpdate_ScheduleRelationship.SKIPPED:
      return "SKIPPED";
    case TripUpdate_StopTimeUpdate_ScheduleRelationship.NO_DATA:
      return "NO_DATA";
    case TripUpdate_StopTimeUpdate_ScheduleRelationship.UNSCHEDULED:
      return "UNSCHEDULED";
    case TripUpdate_StopTimeUpdate_ScheduleRelationship.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * Provides the updated values for the stop time.
 * NOTE: This message is still experimental, and subject to change. It may be formally adopted in the future.
 */
export interface TripUpdate_StopTimeUpdate_StopTimeProperties {
  /**
   * Supports real-time stop assignments. Refers to a stop_id defined in the GTFS stops.txt.
   * The new assigned_stop_id should not result in a significantly different trip experience for the end user than
   * the stop_id defined in GTFS stop_times.txt. In other words, the end user should not view this new stop_id as an
   * "unusual change" if the new stop was presented within an app without any additional context.
   * For example, this field is intended to be used for platform assignments by using a stop_id that belongs to the
   * same station as the stop originally defined in GTFS stop_times.txt.
   * To assign a stop without providing any real-time arrival or departure predictions, populate this field and set
   * StopTimeUpdate.schedule_relationship = NO_DATA.
   * If this field is populated, it is preferred to omit `StopTimeUpdate.stop_id` and use only `StopTimeUpdate.stop_sequence`. If
   * `StopTimeProperties.assigned_stop_id` and `StopTimeUpdate.stop_id` are populated, `StopTimeUpdate.stop_id` must match `assigned_stop_id`.
   * Platform assignments should be reflected in other GTFS-realtime fields as well
   * (e.g., `VehiclePosition.stop_id`).
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  assignedStopId?: string | undefined;
}

/**
 * Defines updated properties of the trip, such as a new shape_id when there is a detour. Or defines the
 * trip_id, start_date, and start_time of a DUPLICATED trip.
 * NOTE: This message is still experimental, and subject to change. It may be formally adopted in the future.
 */
export interface TripUpdate_TripProperties {
  /**
   * Defines the identifier of a new trip that is a duplicate of an existing trip defined in (CSV) GTFS trips.txt
   * but will start at a different service date and/or time (defined using the TripProperties.start_date and
   * TripProperties.start_time fields). See definition of trips.trip_id in (CSV) GTFS. Its value must be different
   * than the ones used in the (CSV) GTFS. Required if schedule_relationship=DUPLICATED, otherwise this field must not
   * be populated and will be ignored by consumers.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  tripId?:
    | string
    | undefined;
  /**
   * Service date on which the DUPLICATED trip will be run, in YYYYMMDD format. Required if
   * schedule_relationship=DUPLICATED, otherwise this field must not be populated and will be ignored by consumers.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  startDate?:
    | string
    | undefined;
  /**
   * Defines the departure start time of the trip when it’s duplicated. See definition of stop_times.departure_time
   * in (CSV) GTFS. Scheduled arrival and departure times for the duplicated trip are calculated based on the offset
   * between the original trip departure_time and this field. For example, if a GTFS trip has stop A with a
   * departure_time of 10:00:00 and stop B with departure_time of 10:01:00, and this field is populated with the value
   * of 10:30:00, stop B on the duplicated trip will have a scheduled departure_time of 10:31:00. Real-time prediction
   * delay values are applied to this calculated schedule time to determine the predicted time. For example, if a
   * departure delay of 30 is provided for stop B, then the predicted departure time is 10:31:30. Real-time
   * prediction time values do not have any offset applied to them and indicate the predicted time as provided.
   * For example, if a departure time representing 10:31:30 is provided for stop B, then the predicted departure time
   * is 10:31:30. This field is required if schedule_relationship is DUPLICATED, otherwise this field must not be
   * populated and will be ignored by consumers.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  startTime?:
    | string
    | undefined;
  /**
   * Specifies the shape of the vehicle travel path when the trip shape differs from the shape specified in
   * (CSV) GTFS or to specify it in real-time when it's not provided by (CSV) GTFS, such as a vehicle that takes differing
   * paths based on rider demand. See definition of trips.shape_id in (CSV) GTFS. If a shape is neither defined in (CSV) GTFS
   * nor in real-time, the shape is considered unknown. This field can refer to a shape defined in the (CSV) GTFS in shapes.txt
   * or a Shape in the (protobuf) real-time feed. The order of stops (stop sequences) for this trip must remain the same as
   * (CSV) GTFS. Stops that are a part of the original trip but will no longer be made, such as when a detour occurs, should
   * be marked as schedule_relationship=SKIPPED.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  shapeId?: string | undefined;
}

/** Realtime positioning information for a given vehicle. */
export interface VehiclePosition {
  /**
   * The Trip that this vehicle is serving.
   * Can be empty or partial if the vehicle can not be identified with a given
   * trip instance.
   */
  trip?:
    | TripDescriptor
    | undefined;
  /** Additional information on the vehicle that is serving this trip. */
  vehicle?:
    | VehicleDescriptor
    | undefined;
  /** Current position of this vehicle. */
  position?:
    | Position
    | undefined;
  /**
   * The stop sequence index of the current stop. The meaning of
   * current_stop_sequence (i.e., the stop that it refers to) is determined by
   * current_status.
   * If current_status is missing IN_TRANSIT_TO is assumed.
   */
  currentStopSequence?:
    | number
    | undefined;
  /**
   * Identifies the current stop. The value must be the same as in stops.txt in
   * the corresponding GTFS feed.
   */
  stopId?:
    | string
    | undefined;
  /**
   * The exact status of the vehicle with respect to the current stop.
   * Ignored if current_stop_sequence is missing.
   */
  currentStatus?:
    | VehiclePosition_VehicleStopStatus
    | undefined;
  /**
   * Moment at which the vehicle's position was measured. In POSIX time
   * (i.e., number of seconds since January 1st 1970 00:00:00 UTC).
   */
  timestamp?: number | undefined;
  congestionLevel?:
    | VehiclePosition_CongestionLevel
    | undefined;
  /**
   * If multi_carriage_status is populated with per-carriage OccupancyStatus,
   * then this field should describe the entire vehicle with all carriages accepting passengers considered.
   */
  occupancyStatus?:
    | VehiclePosition_OccupancyStatus
    | undefined;
  /**
   * A percentage value indicating the degree of passenger occupancy in the vehicle.
   * The values are represented as an integer without decimals. 0 means 0% and 100 means 100%.
   * The value 100 should represent the total maximum occupancy the vehicle was designed for,
   * including both seated and standing capacity, and current operating regulations allow.
   * The value may exceed 100 if there are more passengers than the maximum designed capacity.
   * The precision of occupancy_percentage should be low enough that individual passengers cannot be tracked boarding or alighting the vehicle.
   * If multi_carriage_status is populated with per-carriage occupancy_percentage,
   * then this field should describe the entire vehicle with all carriages accepting passengers considered.
   * This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  occupancyPercentage?:
    | number
    | undefined;
  /**
   * Details of the multiple carriages of this given vehicle.
   * The first occurrence represents the first carriage of the vehicle,
   * given the current direction of travel.
   * The number of occurrences of the multi_carriage_details
   * field represents the number of carriages of the vehicle.
   * It also includes non boardable carriages,
   * like engines, maintenance carriages, etc… as they provide valuable
   * information to passengers about where to stand on a platform.
   * This message/field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  multiCarriageDetails: VehiclePosition_CarriageDetails[];
}

export enum VehiclePosition_VehicleStopStatus {
  /**
   * INCOMING_AT - The vehicle is just about to arrive at the stop (on a stop
   * display, the vehicle symbol typically flashes).
   */
  INCOMING_AT = 0,
  /** STOPPED_AT - The vehicle is standing at the stop. */
  STOPPED_AT = 1,
  /** IN_TRANSIT_TO - The vehicle has departed and is in transit to the next stop. */
  IN_TRANSIT_TO = 2,
  UNRECOGNIZED = -1,
}

export function vehiclePosition_VehicleStopStatusFromJSON(object: any): VehiclePosition_VehicleStopStatus {
  switch (object) {
    case 0:
    case "INCOMING_AT":
      return VehiclePosition_VehicleStopStatus.INCOMING_AT;
    case 1:
    case "STOPPED_AT":
      return VehiclePosition_VehicleStopStatus.STOPPED_AT;
    case 2:
    case "IN_TRANSIT_TO":
      return VehiclePosition_VehicleStopStatus.IN_TRANSIT_TO;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VehiclePosition_VehicleStopStatus.UNRECOGNIZED;
  }
}

export function vehiclePosition_VehicleStopStatusToJSON(object: VehiclePosition_VehicleStopStatus): string {
  switch (object) {
    case VehiclePosition_VehicleStopStatus.INCOMING_AT:
      return "INCOMING_AT";
    case VehiclePosition_VehicleStopStatus.STOPPED_AT:
      return "STOPPED_AT";
    case VehiclePosition_VehicleStopStatus.IN_TRANSIT_TO:
      return "IN_TRANSIT_TO";
    case VehiclePosition_VehicleStopStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Congestion level that is affecting this vehicle. */
export enum VehiclePosition_CongestionLevel {
  UNKNOWN_CONGESTION_LEVEL = 0,
  RUNNING_SMOOTHLY = 1,
  STOP_AND_GO = 2,
  CONGESTION = 3,
  /** SEVERE_CONGESTION - People leaving their cars. */
  SEVERE_CONGESTION = 4,
  UNRECOGNIZED = -1,
}

export function vehiclePosition_CongestionLevelFromJSON(object: any): VehiclePosition_CongestionLevel {
  switch (object) {
    case 0:
    case "UNKNOWN_CONGESTION_LEVEL":
      return VehiclePosition_CongestionLevel.UNKNOWN_CONGESTION_LEVEL;
    case 1:
    case "RUNNING_SMOOTHLY":
      return VehiclePosition_CongestionLevel.RUNNING_SMOOTHLY;
    case 2:
    case "STOP_AND_GO":
      return VehiclePosition_CongestionLevel.STOP_AND_GO;
    case 3:
    case "CONGESTION":
      return VehiclePosition_CongestionLevel.CONGESTION;
    case 4:
    case "SEVERE_CONGESTION":
      return VehiclePosition_CongestionLevel.SEVERE_CONGESTION;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VehiclePosition_CongestionLevel.UNRECOGNIZED;
  }
}

export function vehiclePosition_CongestionLevelToJSON(object: VehiclePosition_CongestionLevel): string {
  switch (object) {
    case VehiclePosition_CongestionLevel.UNKNOWN_CONGESTION_LEVEL:
      return "UNKNOWN_CONGESTION_LEVEL";
    case VehiclePosition_CongestionLevel.RUNNING_SMOOTHLY:
      return "RUNNING_SMOOTHLY";
    case VehiclePosition_CongestionLevel.STOP_AND_GO:
      return "STOP_AND_GO";
    case VehiclePosition_CongestionLevel.CONGESTION:
      return "CONGESTION";
    case VehiclePosition_CongestionLevel.SEVERE_CONGESTION:
      return "SEVERE_CONGESTION";
    case VehiclePosition_CongestionLevel.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * The state of passenger occupancy for the vehicle or carriage.
 * Individual producers may not publish all OccupancyStatus values. Therefore, consumers
 * must not assume that the OccupancyStatus values follow a linear scale.
 * Consumers should represent OccupancyStatus values as the state indicated
 * and intended by the producer. Likewise, producers must use OccupancyStatus values that
 * correspond to actual vehicle occupancy states.
 * For describing passenger occupancy levels on a linear scale, see `occupancy_percentage`.
 * This field is still experimental, and subject to change. It may be formally adopted in the future.
 */
export enum VehiclePosition_OccupancyStatus {
  /**
   * EMPTY - The vehicle or carriage is considered empty by most measures, and has few or no
   * passengers onboard, but is still accepting passengers.
   */
  EMPTY = 0,
  /**
   * MANY_SEATS_AVAILABLE - The vehicle or carriage has a large number of seats available.
   * The amount of free seats out of the total seats available to be
   * considered large enough to fall into this category is determined at the
   * discretion of the producer.
   */
  MANY_SEATS_AVAILABLE = 1,
  /**
   * FEW_SEATS_AVAILABLE - The vehicle or carriage has a relatively small number of seats available.
   * The amount of free seats out of the total seats available to be
   * considered small enough to fall into this category is determined at the
   * discretion of the feed producer.
   */
  FEW_SEATS_AVAILABLE = 2,
  /** STANDING_ROOM_ONLY - The vehicle or carriage can currently accommodate only standing passengers. */
  STANDING_ROOM_ONLY = 3,
  /**
   * CRUSHED_STANDING_ROOM_ONLY - The vehicle or carriage can currently accommodate only standing passengers
   * and has limited space for them.
   */
  CRUSHED_STANDING_ROOM_ONLY = 4,
  /**
   * FULL - The vehicle or carriage is considered full by most measures, but may still be
   * allowing passengers to board.
   */
  FULL = 5,
  /** NOT_ACCEPTING_PASSENGERS - The vehicle or carriage is not accepting passengers, but usually accepts passengers for boarding. */
  NOT_ACCEPTING_PASSENGERS = 6,
  /** NO_DATA_AVAILABLE - The vehicle or carriage doesn't have any occupancy data available at that time. */
  NO_DATA_AVAILABLE = 7,
  /**
   * NOT_BOARDABLE - The vehicle or carriage is not boardable and never accepts passengers.
   * Useful for special vehicles or carriages (engine, maintenance carriage, etc…).
   */
  NOT_BOARDABLE = 8,
  UNRECOGNIZED = -1,
}

export function vehiclePosition_OccupancyStatusFromJSON(object: any): VehiclePosition_OccupancyStatus {
  switch (object) {
    case 0:
    case "EMPTY":
      return VehiclePosition_OccupancyStatus.EMPTY;
    case 1:
    case "MANY_SEATS_AVAILABLE":
      return VehiclePosition_OccupancyStatus.MANY_SEATS_AVAILABLE;
    case 2:
    case "FEW_SEATS_AVAILABLE":
      return VehiclePosition_OccupancyStatus.FEW_SEATS_AVAILABLE;
    case 3:
    case "STANDING_ROOM_ONLY":
      return VehiclePosition_OccupancyStatus.STANDING_ROOM_ONLY;
    case 4:
    case "CRUSHED_STANDING_ROOM_ONLY":
      return VehiclePosition_OccupancyStatus.CRUSHED_STANDING_ROOM_ONLY;
    case 5:
    case "FULL":
      return VehiclePosition_OccupancyStatus.FULL;
    case 6:
    case "NOT_ACCEPTING_PASSENGERS":
      return VehiclePosition_OccupancyStatus.NOT_ACCEPTING_PASSENGERS;
    case 7:
    case "NO_DATA_AVAILABLE":
      return VehiclePosition_OccupancyStatus.NO_DATA_AVAILABLE;
    case 8:
    case "NOT_BOARDABLE":
      return VehiclePosition_OccupancyStatus.NOT_BOARDABLE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VehiclePosition_OccupancyStatus.UNRECOGNIZED;
  }
}

export function vehiclePosition_OccupancyStatusToJSON(object: VehiclePosition_OccupancyStatus): string {
  switch (object) {
    case VehiclePosition_OccupancyStatus.EMPTY:
      return "EMPTY";
    case VehiclePosition_OccupancyStatus.MANY_SEATS_AVAILABLE:
      return "MANY_SEATS_AVAILABLE";
    case VehiclePosition_OccupancyStatus.FEW_SEATS_AVAILABLE:
      return "FEW_SEATS_AVAILABLE";
    case VehiclePosition_OccupancyStatus.STANDING_ROOM_ONLY:
      return "STANDING_ROOM_ONLY";
    case VehiclePosition_OccupancyStatus.CRUSHED_STANDING_ROOM_ONLY:
      return "CRUSHED_STANDING_ROOM_ONLY";
    case VehiclePosition_OccupancyStatus.FULL:
      return "FULL";
    case VehiclePosition_OccupancyStatus.NOT_ACCEPTING_PASSENGERS:
      return "NOT_ACCEPTING_PASSENGERS";
    case VehiclePosition_OccupancyStatus.NO_DATA_AVAILABLE:
      return "NO_DATA_AVAILABLE";
    case VehiclePosition_OccupancyStatus.NOT_BOARDABLE:
      return "NOT_BOARDABLE";
    case VehiclePosition_OccupancyStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * Carriage specific details, used for vehicles composed of several carriages
 * This message/field is still experimental, and subject to change. It may be formally adopted in the future.
 */
export interface VehiclePosition_CarriageDetails {
  /** Identification of the carriage. Should be unique per vehicle. */
  id?:
    | string
    | undefined;
  /**
   * User visible label that may be shown to the passenger to help identify
   * the carriage. Example: "7712", "Car ABC-32", etc...
   * This message/field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  label?:
    | string
    | undefined;
  /**
   * Occupancy status for this given carriage, in this vehicle
   * This message/field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  occupancyStatus?:
    | VehiclePosition_OccupancyStatus
    | undefined;
  /**
   * Occupancy percentage for this given carriage, in this vehicle.
   * Follows the same rules as "VehiclePosition.occupancy_percentage"
   * -1 in case data is not available for this given carriage (as protobuf defaults to 0 otherwise)
   * This message/field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  occupancyPercentage?:
    | number
    | undefined;
  /**
   * Identifies the order of this carriage with respect to the other
   * carriages in the vehicle's list of CarriageDetails.
   * The first carriage in the direction of travel must have a value of 1.
   * The second value corresponds to the second carriage in the direction
   * of travel and must have a value of 2, and so forth.
   * For example, the first carriage in the direction of travel has a value of 1.
   * If the second carriage in the direction of travel has a value of 3,
   * consumers will discard data for all carriages (i.e., the multi_carriage_details field).
   * Carriages without data must be represented with a valid carriage_sequence number and the fields
   * without data should be omitted (alternately, those fields could also be included and set to the "no data" values).
   * This message/field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  carriageSequence?: number | undefined;
}

/** An alert, indicating some sort of incident in the public transit network. */
export interface Alert {
  /**
   * Time when the alert should be shown to the user. If missing, the
   * alert will be shown as long as it appears in the feed.
   * If multiple ranges are given, the alert will be shown during all of them.
   */
  activePeriod: TimeRange[];
  /** Entities whose users we should notify of this alert. */
  informedEntity: EntitySelector[];
  cause?: Alert_Cause | undefined;
  effect?:
    | Alert_Effect
    | undefined;
  /** The URL which provides additional information about the alert. */
  url?:
    | TranslatedString
    | undefined;
  /** Alert header. Contains a short summary of the alert text as plain-text. */
  headerText?:
    | TranslatedString
    | undefined;
  /**
   * Full description for the alert as plain-text. The information in the
   * description should add to the information of the header.
   */
  descriptionText?:
    | TranslatedString
    | undefined;
  /** Text for alert header to be used in text-to-speech implementations. This field is the text-to-speech version of header_text. */
  ttsHeaderText?:
    | TranslatedString
    | undefined;
  /** Text for full description for the alert to be used in text-to-speech implementations. This field is the text-to-speech version of description_text. */
  ttsDescriptionText?: TranslatedString | undefined;
  severityLevel?:
    | Alert_SeverityLevel
    | undefined;
  /**
   * TranslatedImage to be displayed along the alert text. Used to explain visually the alert effect of a detour, station closure, etc. The image must enhance the understanding of the alert. Any essential information communicated within the image must also be contained in the alert text.
   * The following types of images are discouraged : image containing mainly text, marketing or branded images that add no additional information.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  image?:
    | TranslatedImage
    | undefined;
  /**
   * Text describing the appearance of the linked image in the `image` field (e.g., in case the image can't be displayed
   * or the user can't see the image for accessibility reasons). See the HTML spec for alt image text - https://html.spec.whatwg.org/#alt.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  imageAlternativeText?:
    | TranslatedString
    | undefined;
  /**
   * Description of the cause of the alert that allows for agency-specific language; more specific than the Cause. If cause_detail is included, then Cause must also be included.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  causeDetail?:
    | TranslatedString
    | undefined;
  /**
   * Description of the effect of the alert that allows for agency-specific language; more specific than the Effect. If effect_detail is included, then Effect must also be included.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  effectDetail?: TranslatedString | undefined;
}

/** Cause of this alert. If cause_detail is included, then Cause must also be included. */
export enum Alert_Cause {
  UNKNOWN_CAUSE = 1,
  /** OTHER_CAUSE - Not machine-representable. */
  OTHER_CAUSE = 2,
  TECHNICAL_PROBLEM = 3,
  /** STRIKE - Public transit agency employees stopped working. */
  STRIKE = 4,
  /** DEMONSTRATION - People are blocking the streets. */
  DEMONSTRATION = 5,
  ACCIDENT = 6,
  HOLIDAY = 7,
  WEATHER = 8,
  MAINTENANCE = 9,
  CONSTRUCTION = 10,
  POLICE_ACTIVITY = 11,
  MEDICAL_EMERGENCY = 12,
  UNRECOGNIZED = -1,
}

export function alert_CauseFromJSON(object: any): Alert_Cause {
  switch (object) {
    case 1:
    case "UNKNOWN_CAUSE":
      return Alert_Cause.UNKNOWN_CAUSE;
    case 2:
    case "OTHER_CAUSE":
      return Alert_Cause.OTHER_CAUSE;
    case 3:
    case "TECHNICAL_PROBLEM":
      return Alert_Cause.TECHNICAL_PROBLEM;
    case 4:
    case "STRIKE":
      return Alert_Cause.STRIKE;
    case 5:
    case "DEMONSTRATION":
      return Alert_Cause.DEMONSTRATION;
    case 6:
    case "ACCIDENT":
      return Alert_Cause.ACCIDENT;
    case 7:
    case "HOLIDAY":
      return Alert_Cause.HOLIDAY;
    case 8:
    case "WEATHER":
      return Alert_Cause.WEATHER;
    case 9:
    case "MAINTENANCE":
      return Alert_Cause.MAINTENANCE;
    case 10:
    case "CONSTRUCTION":
      return Alert_Cause.CONSTRUCTION;
    case 11:
    case "POLICE_ACTIVITY":
      return Alert_Cause.POLICE_ACTIVITY;
    case 12:
    case "MEDICAL_EMERGENCY":
      return Alert_Cause.MEDICAL_EMERGENCY;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Alert_Cause.UNRECOGNIZED;
  }
}

export function alert_CauseToJSON(object: Alert_Cause): string {
  switch (object) {
    case Alert_Cause.UNKNOWN_CAUSE:
      return "UNKNOWN_CAUSE";
    case Alert_Cause.OTHER_CAUSE:
      return "OTHER_CAUSE";
    case Alert_Cause.TECHNICAL_PROBLEM:
      return "TECHNICAL_PROBLEM";
    case Alert_Cause.STRIKE:
      return "STRIKE";
    case Alert_Cause.DEMONSTRATION:
      return "DEMONSTRATION";
    case Alert_Cause.ACCIDENT:
      return "ACCIDENT";
    case Alert_Cause.HOLIDAY:
      return "HOLIDAY";
    case Alert_Cause.WEATHER:
      return "WEATHER";
    case Alert_Cause.MAINTENANCE:
      return "MAINTENANCE";
    case Alert_Cause.CONSTRUCTION:
      return "CONSTRUCTION";
    case Alert_Cause.POLICE_ACTIVITY:
      return "POLICE_ACTIVITY";
    case Alert_Cause.MEDICAL_EMERGENCY:
      return "MEDICAL_EMERGENCY";
    case Alert_Cause.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** What is the effect of this problem on the affected entity. If effect_detail is included, then Effect must also be included. */
export enum Alert_Effect {
  NO_SERVICE = 1,
  REDUCED_SERVICE = 2,
  /**
   * SIGNIFICANT_DELAYS - We don't care about INsignificant delays: they are hard to detect, have
   * little impact on the user, and would clutter the results as they are too
   * frequent.
   */
  SIGNIFICANT_DELAYS = 3,
  DETOUR = 4,
  ADDITIONAL_SERVICE = 5,
  MODIFIED_SERVICE = 6,
  OTHER_EFFECT = 7,
  UNKNOWN_EFFECT = 8,
  STOP_MOVED = 9,
  NO_EFFECT = 10,
  ACCESSIBILITY_ISSUE = 11,
  UNRECOGNIZED = -1,
}

export function alert_EffectFromJSON(object: any): Alert_Effect {
  switch (object) {
    case 1:
    case "NO_SERVICE":
      return Alert_Effect.NO_SERVICE;
    case 2:
    case "REDUCED_SERVICE":
      return Alert_Effect.REDUCED_SERVICE;
    case 3:
    case "SIGNIFICANT_DELAYS":
      return Alert_Effect.SIGNIFICANT_DELAYS;
    case 4:
    case "DETOUR":
      return Alert_Effect.DETOUR;
    case 5:
    case "ADDITIONAL_SERVICE":
      return Alert_Effect.ADDITIONAL_SERVICE;
    case 6:
    case "MODIFIED_SERVICE":
      return Alert_Effect.MODIFIED_SERVICE;
    case 7:
    case "OTHER_EFFECT":
      return Alert_Effect.OTHER_EFFECT;
    case 8:
    case "UNKNOWN_EFFECT":
      return Alert_Effect.UNKNOWN_EFFECT;
    case 9:
    case "STOP_MOVED":
      return Alert_Effect.STOP_MOVED;
    case 10:
    case "NO_EFFECT":
      return Alert_Effect.NO_EFFECT;
    case 11:
    case "ACCESSIBILITY_ISSUE":
      return Alert_Effect.ACCESSIBILITY_ISSUE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Alert_Effect.UNRECOGNIZED;
  }
}

export function alert_EffectToJSON(object: Alert_Effect): string {
  switch (object) {
    case Alert_Effect.NO_SERVICE:
      return "NO_SERVICE";
    case Alert_Effect.REDUCED_SERVICE:
      return "REDUCED_SERVICE";
    case Alert_Effect.SIGNIFICANT_DELAYS:
      return "SIGNIFICANT_DELAYS";
    case Alert_Effect.DETOUR:
      return "DETOUR";
    case Alert_Effect.ADDITIONAL_SERVICE:
      return "ADDITIONAL_SERVICE";
    case Alert_Effect.MODIFIED_SERVICE:
      return "MODIFIED_SERVICE";
    case Alert_Effect.OTHER_EFFECT:
      return "OTHER_EFFECT";
    case Alert_Effect.UNKNOWN_EFFECT:
      return "UNKNOWN_EFFECT";
    case Alert_Effect.STOP_MOVED:
      return "STOP_MOVED";
    case Alert_Effect.NO_EFFECT:
      return "NO_EFFECT";
    case Alert_Effect.ACCESSIBILITY_ISSUE:
      return "ACCESSIBILITY_ISSUE";
    case Alert_Effect.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Severity of this alert. */
export enum Alert_SeverityLevel {
  UNKNOWN_SEVERITY = 1,
  INFO = 2,
  WARNING = 3,
  SEVERE = 4,
  UNRECOGNIZED = -1,
}

export function alert_SeverityLevelFromJSON(object: any): Alert_SeverityLevel {
  switch (object) {
    case 1:
    case "UNKNOWN_SEVERITY":
      return Alert_SeverityLevel.UNKNOWN_SEVERITY;
    case 2:
    case "INFO":
      return Alert_SeverityLevel.INFO;
    case 3:
    case "WARNING":
      return Alert_SeverityLevel.WARNING;
    case 4:
    case "SEVERE":
      return Alert_SeverityLevel.SEVERE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Alert_SeverityLevel.UNRECOGNIZED;
  }
}

export function alert_SeverityLevelToJSON(object: Alert_SeverityLevel): string {
  switch (object) {
    case Alert_SeverityLevel.UNKNOWN_SEVERITY:
      return "UNKNOWN_SEVERITY";
    case Alert_SeverityLevel.INFO:
      return "INFO";
    case Alert_SeverityLevel.WARNING:
      return "WARNING";
    case Alert_SeverityLevel.SEVERE:
      return "SEVERE";
    case Alert_SeverityLevel.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * A time interval. The interval is considered active at time 't' if 't' is
 * greater than or equal to the start time and less than the end time.
 */
export interface TimeRange {
  /**
   * Start time, in POSIX time (i.e., number of seconds since January 1st 1970
   * 00:00:00 UTC).
   * If missing, the interval starts at minus infinity.
   */
  start?:
    | number
    | undefined;
  /**
   * End time, in POSIX time (i.e., number of seconds since January 1st 1970
   * 00:00:00 UTC).
   * If missing, the interval ends at plus infinity.
   */
  end?: number | undefined;
}

/** A position. */
export interface Position {
  /** Degrees North, in the WGS-84 coordinate system. */
  latitude: number;
  /** Degrees East, in the WGS-84 coordinate system. */
  longitude: number;
  /**
   * Bearing, in degrees, clockwise from North, i.e., 0 is North and 90 is East.
   * This can be the compass bearing, or the direction towards the next stop
   * or intermediate location.
   * This should not be direction deduced from the sequence of previous
   * positions, which can be computed from previous data.
   */
  bearing?:
    | number
    | undefined;
  /** Odometer value, in meters. */
  odometer?:
    | number
    | undefined;
  /** Momentary speed measured by the vehicle, in meters per second. */
  speed?: number | undefined;
}

/**
 * A descriptor that identifies an instance of a GTFS trip, or all instances of
 * a trip along a route.
 * - To specify a single trip instance, the trip_id (and if necessary,
 *   start_time) is set. If route_id is also set, then it should be same as one
 *   that the given trip corresponds to.
 * - To specify all the trips along a given route, only the route_id should be
 *   set. Note that if the trip_id is not known, then stop sequence ids in
 *   TripUpdate are not sufficient, and stop_ids must be provided as well. In
 *   addition, absolute arrival/departure times must be provided.
 */
export interface TripDescriptor {
  /**
   * The trip_id from the GTFS feed that this selector refers to.
   * For non frequency-based trips, this field is enough to uniquely identify
   * the trip. For frequency-based trip, start_time and start_date might also be
   * necessary. When schedule_relationship is DUPLICATED within a TripUpdate, the trip_id identifies the trip from
   * static GTFS to be duplicated. When schedule_relationship is DUPLICATED within a VehiclePosition, the trip_id
   * identifies the new duplicate trip and must contain the value for the corresponding TripUpdate.TripProperties.trip_id.
   */
  tripId?:
    | string
    | undefined;
  /** The route_id from the GTFS that this selector refers to. */
  routeId?:
    | string
    | undefined;
  /**
   * The direction_id from the GTFS feed trips.txt file, indicating the
   * direction of travel for trips this selector refers to.
   */
  directionId?:
    | number
    | undefined;
  /**
   * The initially scheduled start time of this trip instance.
   * When the trip_id corresponds to a non-frequency-based trip, this field
   * should either be omitted or be equal to the value in the GTFS feed. When
   * the trip_id correponds to a frequency-based trip, the start_time must be
   * specified for trip updates and vehicle positions. If the trip corresponds
   * to exact_times=1 GTFS record, then start_time must be some multiple
   * (including zero) of headway_secs later than frequencies.txt start_time for
   * the corresponding time period. If the trip corresponds to exact_times=0,
   * then its start_time may be arbitrary, and is initially expected to be the
   * first departure of the trip. Once established, the start_time of this
   * frequency-based trip should be considered immutable, even if the first
   * departure time changes -- that time change may instead be reflected in a
   * StopTimeUpdate.
   * Format and semantics of the field is same as that of
   * GTFS/frequencies.txt/start_time, e.g., 11:15:35 or 25:15:35.
   */
  startTime?:
    | string
    | undefined;
  /**
   * The scheduled start date of this trip instance.
   * Must be provided to disambiguate trips that are so late as to collide with
   * a scheduled trip on a next day. For example, for a train that departs 8:00
   * and 20:00 every day, and is 12 hours late, there would be two distinct
   * trips on the same time.
   * This field can be provided but is not mandatory for schedules in which such
   * collisions are impossible - for example, a service running on hourly
   * schedule where a vehicle that is one hour late is not considered to be
   * related to schedule anymore.
   * In YYYYMMDD format.
   */
  startDate?: string | undefined;
  scheduleRelationship?: TripDescriptor_ScheduleRelationship | undefined;
  modifiedTrip?: TripDescriptor_ModifiedTripSelector | undefined;
}

/**
 * The relation between this trip and the static schedule. If a trip is done
 * in accordance with temporary schedule, not reflected in GTFS, then it
 * shouldn't be marked as SCHEDULED, but likely as ADDED.
 */
export enum TripDescriptor_ScheduleRelationship {
  /**
   * SCHEDULED - Trip that is running in accordance with its GTFS schedule, or is close
   * enough to the scheduled trip to be associated with it.
   */
  SCHEDULED = 0,
  /**
   * ADDED - An extra trip that was added in addition to a running schedule, for
   * example, to replace a broken vehicle or to respond to sudden passenger
   * load.
   * NOTE: Currently, behavior is unspecified for feeds that use this mode. There are discussions on the GTFS GitHub
   * [(1)](https://github.com/google/transit/issues/106) [(2)](https://github.com/google/transit/pull/221)
   * [(3)](https://github.com/google/transit/pull/219) around fully specifying or deprecating ADDED trips and the
   * documentation will be updated when those discussions are finalized.
   */
  ADDED = 1,
  /**
   * UNSCHEDULED - A trip that is running with no schedule associated to it (GTFS frequencies.txt exact_times=0).
   * Trips with ScheduleRelationship=UNSCHEDULED must also set all StopTimeUpdates.ScheduleRelationship=UNSCHEDULED.
   */
  UNSCHEDULED = 2,
  /** CANCELED - A trip that existed in the schedule but was removed. */
  CANCELED = 3,
  /**
   * REPLACEMENT - Should not be used - for backwards-compatibility only.
   *
   * @deprecated
   */
  REPLACEMENT = 5,
  /**
   * DUPLICATED - An extra trip that was added in addition to a running schedule, for example, to replace a broken vehicle or to
   * respond to sudden passenger load. Used with TripUpdate.TripProperties.trip_id, TripUpdate.TripProperties.start_date,
   * and TripUpdate.TripProperties.start_time to copy an existing trip from static GTFS but start at a different service
   * date and/or time. Duplicating a trip is allowed if the service related to the original trip in (CSV) GTFS
   * (in calendar.txt or calendar_dates.txt) is operating within the next 30 days. The trip to be duplicated is
   * identified via TripUpdate.TripDescriptor.trip_id. This enumeration does not modify the existing trip referenced by
   * TripUpdate.TripDescriptor.trip_id - if a producer wants to cancel the original trip, it must publish a separate
   * TripUpdate with the value of CANCELED or DELETED. Trips defined in GTFS frequencies.txt with exact_times that is
   * empty or equal to 0 cannot be duplicated. The VehiclePosition.TripDescriptor.trip_id for the new trip must contain
   * the matching value from TripUpdate.TripProperties.trip_id and VehiclePosition.TripDescriptor.ScheduleRelationship
   * must also be set to DUPLICATED.
   * Existing producers and consumers that were using the ADDED enumeration to represent duplicated trips must follow
   * the migration guide (https://github.com/google/transit/tree/master/gtfs-realtime/spec/en/examples/migration-duplicated.md)
   * to transition to the DUPLICATED enumeration.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  DUPLICATED = 6,
  /**
   * DELETED - A trip that existed in the schedule but was removed and must not be shown to users.
   * DELETED should be used instead of CANCELED to indicate that a transit provider would like to entirely remove
   * information about the corresponding trip from consuming applications, so the trip is not shown as cancelled to
   * riders, e.g. a trip that is entirely being replaced by another trip.
   * This designation becomes particularly important if several trips are cancelled and replaced with substitute service.
   * If consumers were to show explicit information about the cancellations it would distract from the more important
   * real-time predictions.
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  DELETED = 7,
  UNRECOGNIZED = -1,
}

export function tripDescriptor_ScheduleRelationshipFromJSON(object: any): TripDescriptor_ScheduleRelationship {
  switch (object) {
    case 0:
    case "SCHEDULED":
      return TripDescriptor_ScheduleRelationship.SCHEDULED;
    case 1:
    case "ADDED":
      return TripDescriptor_ScheduleRelationship.ADDED;
    case 2:
    case "UNSCHEDULED":
      return TripDescriptor_ScheduleRelationship.UNSCHEDULED;
    case 3:
    case "CANCELED":
      return TripDescriptor_ScheduleRelationship.CANCELED;
    case 5:
    case "REPLACEMENT":
      return TripDescriptor_ScheduleRelationship.REPLACEMENT;
    case 6:
    case "DUPLICATED":
      return TripDescriptor_ScheduleRelationship.DUPLICATED;
    case 7:
    case "DELETED":
      return TripDescriptor_ScheduleRelationship.DELETED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TripDescriptor_ScheduleRelationship.UNRECOGNIZED;
  }
}

export function tripDescriptor_ScheduleRelationshipToJSON(object: TripDescriptor_ScheduleRelationship): string {
  switch (object) {
    case TripDescriptor_ScheduleRelationship.SCHEDULED:
      return "SCHEDULED";
    case TripDescriptor_ScheduleRelationship.ADDED:
      return "ADDED";
    case TripDescriptor_ScheduleRelationship.UNSCHEDULED:
      return "UNSCHEDULED";
    case TripDescriptor_ScheduleRelationship.CANCELED:
      return "CANCELED";
    case TripDescriptor_ScheduleRelationship.REPLACEMENT:
      return "REPLACEMENT";
    case TripDescriptor_ScheduleRelationship.DUPLICATED:
      return "DUPLICATED";
    case TripDescriptor_ScheduleRelationship.DELETED:
      return "DELETED";
    case TripDescriptor_ScheduleRelationship.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface TripDescriptor_ModifiedTripSelector {
  /** The 'id' from the FeedEntity in which the contained TripModifications object affects this trip. */
  modificationsId?:
    | string
    | undefined;
  /** The trip_id from the GTFS feed that is modified by the modifications_id */
  affectedTripId?: string | undefined;
}

/** Identification information for the vehicle performing the trip. */
export interface VehicleDescriptor {
  /**
   * Internal system identification of the vehicle. Should be unique per
   * vehicle, and can be used for tracking the vehicle as it proceeds through
   * the system.
   */
  id?:
    | string
    | undefined;
  /**
   * User visible label, i.e., something that must be shown to the passenger to
   * help identify the correct vehicle.
   */
  label?:
    | string
    | undefined;
  /** The license plate of the vehicle. */
  licensePlate?: string | undefined;
  wheelchairAccessible?: VehicleDescriptor_WheelchairAccessible | undefined;
}

export enum VehicleDescriptor_WheelchairAccessible {
  /**
   * NO_VALUE - The trip doesn't have information about wheelchair accessibility.
   * This is the **default** behavior. If the static GTFS contains a
   * _wheelchair_accessible_ value, it won't be overwritten.
   */
  NO_VALUE = 0,
  /**
   * UNKNOWN - The trip has no accessibility value present.
   * This value will overwrite the value from the GTFS.
   */
  UNKNOWN = 1,
  /**
   * WHEELCHAIR_ACCESSIBLE - The trip is wheelchair accessible.
   * This value will overwrite the value from the GTFS.
   */
  WHEELCHAIR_ACCESSIBLE = 2,
  /**
   * WHEELCHAIR_INACCESSIBLE - The trip is **not** wheelchair accessible.
   * This value will overwrite the value from the GTFS.
   */
  WHEELCHAIR_INACCESSIBLE = 3,
  UNRECOGNIZED = -1,
}

export function vehicleDescriptor_WheelchairAccessibleFromJSON(object: any): VehicleDescriptor_WheelchairAccessible {
  switch (object) {
    case 0:
    case "NO_VALUE":
      return VehicleDescriptor_WheelchairAccessible.NO_VALUE;
    case 1:
    case "UNKNOWN":
      return VehicleDescriptor_WheelchairAccessible.UNKNOWN;
    case 2:
    case "WHEELCHAIR_ACCESSIBLE":
      return VehicleDescriptor_WheelchairAccessible.WHEELCHAIR_ACCESSIBLE;
    case 3:
    case "WHEELCHAIR_INACCESSIBLE":
      return VehicleDescriptor_WheelchairAccessible.WHEELCHAIR_INACCESSIBLE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return VehicleDescriptor_WheelchairAccessible.UNRECOGNIZED;
  }
}

export function vehicleDescriptor_WheelchairAccessibleToJSON(object: VehicleDescriptor_WheelchairAccessible): string {
  switch (object) {
    case VehicleDescriptor_WheelchairAccessible.NO_VALUE:
      return "NO_VALUE";
    case VehicleDescriptor_WheelchairAccessible.UNKNOWN:
      return "UNKNOWN";
    case VehicleDescriptor_WheelchairAccessible.WHEELCHAIR_ACCESSIBLE:
      return "WHEELCHAIR_ACCESSIBLE";
    case VehicleDescriptor_WheelchairAccessible.WHEELCHAIR_INACCESSIBLE:
      return "WHEELCHAIR_INACCESSIBLE";
    case VehicleDescriptor_WheelchairAccessible.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** A selector for an entity in a GTFS feed. */
export interface EntitySelector {
  /**
   * The values of the fields should correspond to the appropriate fields in the
   * GTFS feed.
   * At least one specifier must be given. If several are given, then the
   * matching has to apply to all the given specifiers.
   */
  agencyId?: string | undefined;
  routeId?:
    | string
    | undefined;
  /** corresponds to route_type in GTFS. */
  routeType?: number | undefined;
  trip?: TripDescriptor | undefined;
  stopId?:
    | string
    | undefined;
  /**
   * Corresponds to trip direction_id in GTFS trips.txt. If provided the
   * route_id must also be provided.
   */
  directionId?: number | undefined;
}

/**
 * An internationalized message containing per-language versions of a snippet of
 * text or a URL.
 * One of the strings from a message will be picked up. The resolution proceeds
 * as follows:
 * 1. If the UI language matches the language code of a translation,
 *    the first matching translation is picked.
 * 2. If a default UI language (e.g., English) matches the language code of a
 *    translation, the first matching translation is picked.
 * 3. If some translation has an unspecified language code, that translation is
 *    picked.
 */
export interface TranslatedString {
  /** At least one translation must be provided. */
  translation: TranslatedString_Translation[];
}

export interface TranslatedString_Translation {
  /** A UTF-8 string containing the message. */
  text: string;
  /**
   * BCP-47 language code. Can be omitted if the language is unknown or if
   * no i18n is done at all for the feed. At most one translation is
   * allowed to have an unspecified language tag.
   */
  language?: string | undefined;
}

/**
 * An internationalized image containing per-language versions of a URL linking to an image
 * along with meta information
 * Only one of the images from a message will be retained by consumers. The resolution proceeds
 * as follows:
 * 1. If the UI language matches the language code of a translation,
 *    the first matching translation is picked.
 * 2. If a default UI language (e.g., English) matches the language code of a
 *    translation, the first matching translation is picked.
 * 3. If some translation has an unspecified language code, that translation is
 *    picked.
 * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
 */
export interface TranslatedImage {
  /** At least one localized image must be provided. */
  localizedImage: TranslatedImage_LocalizedImage[];
}

export interface TranslatedImage_LocalizedImage {
  /**
   * String containing an URL linking to an image
   * The image linked must be less than 2MB.
   * If an image changes in a significant enough way that an update is required on the consumer side, the producer must update the URL to a new one.
   * The URL should be a fully qualified URL that includes http:// or https://, and any special characters in the URL must be correctly escaped. See the following http://www.w3.org/Addressing/URL/4_URI_Recommentations.html for a description of how to create fully qualified URL values.
   */
  url: string;
  /**
   * IANA media type as to specify the type of image to be displayed.
   * The type must start with "image/"
   */
  mediaType: string;
  /**
   * BCP-47 language code. Can be omitted if the language is unknown or if
   * no i18n is done at all for the feed. At most one translation is
   * allowed to have an unspecified language tag.
   */
  language?: string | undefined;
}

/**
 * Describes the physical path that a vehicle takes when it's not part of the (CSV) GTFS,
 * such as for a detour. Shapes belong to Trips, and consist of a sequence of shape points.
 * Tracing the points in order provides the path of the vehicle.  Shapes do not need to intercept
 * the location of Stops exactly, but all Stops on a trip should lie within a small distance of
 * the shape for that trip, i.e. close to straight line segments connecting the shape points
 * NOTE: This message is still experimental, and subject to change. It may be formally adopted in the future.
 */
export interface Shape {
  /**
   * Identifier of the shape. Must be different than any shape_id defined in the (CSV) GTFS.
   * This field is required as per reference.md, but needs to be specified here optional because "Required is Forever"
   * See https://developers.google.com/protocol-buffers/docs/proto#specifying_field_rules
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  shapeId?:
    | string
    | undefined;
  /**
   * Encoded polyline representation of the shape. This polyline must contain at least two points.
   * For more information about encoded polylines, see https://developers.google.com/maps/documentation/utilities/polylinealgorithm
   * This field is required as per reference.md, but needs to be specified here optional because "Required is Forever"
   * See https://developers.google.com/protocol-buffers/docs/proto#specifying_field_rules
   * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
   */
  encodedPolyline?: string | undefined;
}

/**
 * Describes a stop which is served by trips. All fields are as described in the GTFS-Static specification.
 * NOTE: This message is still experimental, and subject to change. It may be formally adopted in the future.
 */
export interface Stop {
  stopId?: string | undefined;
  stopCode?: TranslatedString | undefined;
  stopName?: TranslatedString | undefined;
  ttsStopName?: TranslatedString | undefined;
  stopDesc?: TranslatedString | undefined;
  stopLat?: number | undefined;
  stopLon?: number | undefined;
  zoneId?: string | undefined;
  stopUrl?: TranslatedString | undefined;
  parentStation?: string | undefined;
  stopTimezone?: string | undefined;
  wheelchairBoarding?: Stop_WheelchairBoarding | undefined;
  levelId?: string | undefined;
  platformCode?: TranslatedString | undefined;
}

export enum Stop_WheelchairBoarding {
  UNKNOWN = 0,
  AVAILABLE = 1,
  NOT_AVAILABLE = 2,
  UNRECOGNIZED = -1,
}

export function stop_WheelchairBoardingFromJSON(object: any): Stop_WheelchairBoarding {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return Stop_WheelchairBoarding.UNKNOWN;
    case 1:
    case "AVAILABLE":
      return Stop_WheelchairBoarding.AVAILABLE;
    case 2:
    case "NOT_AVAILABLE":
      return Stop_WheelchairBoarding.NOT_AVAILABLE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Stop_WheelchairBoarding.UNRECOGNIZED;
  }
}

export function stop_WheelchairBoardingToJSON(object: Stop_WheelchairBoarding): string {
  switch (object) {
    case Stop_WheelchairBoarding.UNKNOWN:
      return "UNKNOWN";
    case Stop_WheelchairBoarding.AVAILABLE:
      return "AVAILABLE";
    case Stop_WheelchairBoarding.NOT_AVAILABLE:
      return "NOT_AVAILABLE";
    case Stop_WheelchairBoarding.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future. */
export interface TripModifications {
  /** A list of selected trips affected by this TripModifications. */
  selectedTrips: TripModifications_SelectedTrips[];
  /**
   * A list of start times in the real-time trip descriptor for the trip_id defined in trip_ids.
   * Useful to target multiple departures of a trip_id in a frequency-based trip.
   */
  startTimes: string[];
  /**
   * Dates on which the modifications occurs, in the YYYYMMDD format. Producers SHOULD only transmit detours occurring within the next week.
   * The dates provided should not be used as user-facing information, if a user-facing start and end date needs to be provided, they can be provided in the linked service alert with `service_alert_id`
   */
  serviceDates: string[];
  /** A list of modifications to apply to the affected trips. */
  modifications: TripModifications_Modification[];
}

/** A `Modification` message replaces a span of n stop times from each affected trip starting at `start_stop_selector`. */
export interface TripModifications_Modification {
  /**
   * The stop selector of the first stop_time of the original trip that is to be affected by this modification.
   * Used in conjuction with `end_stop_selector`.
   * `start_stop_selector` is required and is used to define the reference stop used with `travel_time_to_stop`.
   */
  startStopSelector?:
    | StopSelector
    | undefined;
  /**
   * The stop selector of the last stop of the original trip that is to be affected by this modification.
   * The selection is inclusive, so if only one stop_time is replaced by that modification, `start_stop_selector` and `end_stop_selector` must be equivalent.
   * If no stop_time is replaced, `end_stop_selector` must not be provided. It's otherwise required.
   */
  endStopSelector?:
    | StopSelector
    | undefined;
  /**
   * The number of seconds of delay to add to all departure and arrival times following the end of this modification.
   * If multiple modifications apply to the same trip, the delays accumulate as the trip advances.
   */
  propagatedModificationDelay?:
    | number
    | undefined;
  /**
   * A list of replacement stops, replacing those of the original trip.
   * The length of the new stop times may be less, the same, or greater than the number of replaced stop times.
   */
  replacementStops: ReplacementStop[];
  /** An `id` value from the `FeedEntity` message that contains the `Alert` describing this Modification for user-facing communication. */
  serviceAlertId?:
    | string
    | undefined;
  /**
   * This timestamp identifies the moment when the modification has last been changed.
   * In POSIX time (i.e., number of seconds since January 1st 1970 00:00:00 UTC).
   */
  lastModifiedTime?: number | undefined;
}

export interface TripModifications_SelectedTrips {
  /** A list of trips affected with this replacement that all have the same new `shape_id`. */
  tripIds: string[];
  /**
   * The ID of the new shape for the modified trips in this SelectedTrips.
   * May refer to a new shape added using a GTFS-RT Shape message, or to an existing shape defined in the GTFS-Static feed’s shapes.txt.
   */
  shapeId?: string | undefined;
}

/**
 * NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future.
 * Select a stop by stop sequence or by stop_id. At least one of the two values must be provided.
 */
export interface StopSelector {
  /** Must be the same as in stop_times.txt in the corresponding GTFS feed. */
  stopSequence?:
    | number
    | undefined;
  /** Must be the same as in stops.txt in the corresponding GTFS feed. */
  stopId?: string | undefined;
}

/** NOTE: This field is still experimental, and subject to change. It may be formally adopted in the future. */
export interface ReplacementStop {
  /**
   * The difference in seconds between the arrival time at this stop and the arrival time at the reference stop. The reference stop is the stop prior to start_stop_selector. If the modification begins at the first stop of the trip, then the first stop of the trip is the reference stop.
   * This value MUST be monotonically increasing and may only be a negative number if the first stop of the original trip is the reference stop.
   */
  travelTimeToStop?:
    | number
    | undefined;
  /** The replacement stop ID which will now be visited by the trip. May refer to a new stop added using a GTFS-RT Stop message, or to an existing stop defined in the GTFS-Static feed’s stops.txt. The stop MUST have location_type=0 (routable stops). */
  stopId?: string | undefined;
}

function createBaseFeedMessage(): FeedMessage {
  return { header: undefined, entity: [] };
}

export const FeedMessage = {
  encode(message: FeedMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined) {
      FeedHeader.encode(message.header, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.entity) {
      FeedEntity.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeedMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeedMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.header = FeedHeader.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.entity.push(FeedEntity.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FeedMessage {
    return {
      header: isSet(object.header) ? FeedHeader.fromJSON(object.header) : undefined,
      entity: globalThis.Array.isArray(object?.entity) ? object.entity.map((e: any) => FeedEntity.fromJSON(e)) : [],
    };
  },

  toJSON(message: FeedMessage): unknown {
    const obj: any = {};
    if (message.header !== undefined) {
      obj.header = FeedHeader.toJSON(message.header);
    }
    if (message.entity?.length) {
      obj.entity = message.entity.map((e) => FeedEntity.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FeedMessage>, I>>(base?: I): FeedMessage {
    return FeedMessage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FeedMessage>, I>>(object: I): FeedMessage {
    const message = createBaseFeedMessage();
    message.header = (object.header !== undefined && object.header !== null)
      ? FeedHeader.fromPartial(object.header)
      : undefined;
    message.entity = object.entity?.map((e) => FeedEntity.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFeedHeader(): FeedHeader {
  return { gtfsRealtimeVersion: "", incrementality: 0, timestamp: 0 };
}

export const FeedHeader = {
  encode(message: FeedHeader, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.gtfsRealtimeVersion !== "") {
      writer.uint32(10).string(message.gtfsRealtimeVersion);
    }
    if (message.incrementality !== undefined && message.incrementality !== 0) {
      writer.uint32(16).int32(message.incrementality);
    }
    if (message.timestamp !== undefined && message.timestamp !== 0) {
      writer.uint32(24).uint64(message.timestamp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeedHeader {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeedHeader();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.gtfsRealtimeVersion = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.incrementality = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.timestamp = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FeedHeader {
    return {
      gtfsRealtimeVersion: isSet(object.gtfsRealtimeVersion) ? globalThis.String(object.gtfsRealtimeVersion) : "",
      incrementality: isSet(object.incrementality) ? feedHeader_IncrementalityFromJSON(object.incrementality) : 0,
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
    };
  },

  toJSON(message: FeedHeader): unknown {
    const obj: any = {};
    if (message.gtfsRealtimeVersion !== "") {
      obj.gtfsRealtimeVersion = message.gtfsRealtimeVersion;
    }
    if (message.incrementality !== undefined && message.incrementality !== 0) {
      obj.incrementality = feedHeader_IncrementalityToJSON(message.incrementality);
    }
    if (message.timestamp !== undefined && message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FeedHeader>, I>>(base?: I): FeedHeader {
    return FeedHeader.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FeedHeader>, I>>(object: I): FeedHeader {
    const message = createBaseFeedHeader();
    message.gtfsRealtimeVersion = object.gtfsRealtimeVersion ?? "";
    message.incrementality = object.incrementality ?? 0;
    message.timestamp = object.timestamp ?? 0;
    return message;
  },
};

function createBaseFeedEntity(): FeedEntity {
  return {
    id: "",
    isDeleted: false,
    tripUpdate: undefined,
    vehicle: undefined,
    alert: undefined,
    shape: undefined,
    stop: undefined,
    tripModifications: undefined,
  };
}

export const FeedEntity = {
  encode(message: FeedEntity, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.isDeleted !== undefined && message.isDeleted !== false) {
      writer.uint32(16).bool(message.isDeleted);
    }
    if (message.tripUpdate !== undefined) {
      TripUpdate.encode(message.tripUpdate, writer.uint32(26).fork()).ldelim();
    }
    if (message.vehicle !== undefined) {
      VehiclePosition.encode(message.vehicle, writer.uint32(34).fork()).ldelim();
    }
    if (message.alert !== undefined) {
      Alert.encode(message.alert, writer.uint32(42).fork()).ldelim();
    }
    if (message.shape !== undefined) {
      Shape.encode(message.shape, writer.uint32(50).fork()).ldelim();
    }
    if (message.stop !== undefined) {
      Stop.encode(message.stop, writer.uint32(58).fork()).ldelim();
    }
    if (message.tripModifications !== undefined) {
      TripModifications.encode(message.tripModifications, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeedEntity {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeedEntity();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.isDeleted = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.tripUpdate = TripUpdate.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.vehicle = VehiclePosition.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.alert = Alert.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.shape = Shape.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.stop = Stop.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.tripModifications = TripModifications.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FeedEntity {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      isDeleted: isSet(object.isDeleted) ? globalThis.Boolean(object.isDeleted) : false,
      tripUpdate: isSet(object.tripUpdate) ? TripUpdate.fromJSON(object.tripUpdate) : undefined,
      vehicle: isSet(object.vehicle) ? VehiclePosition.fromJSON(object.vehicle) : undefined,
      alert: isSet(object.alert) ? Alert.fromJSON(object.alert) : undefined,
      shape: isSet(object.shape) ? Shape.fromJSON(object.shape) : undefined,
      stop: isSet(object.stop) ? Stop.fromJSON(object.stop) : undefined,
      tripModifications: isSet(object.tripModifications)
        ? TripModifications.fromJSON(object.tripModifications)
        : undefined,
    };
  },

  toJSON(message: FeedEntity): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.isDeleted !== undefined && message.isDeleted !== false) {
      obj.isDeleted = message.isDeleted;
    }
    if (message.tripUpdate !== undefined) {
      obj.tripUpdate = TripUpdate.toJSON(message.tripUpdate);
    }
    if (message.vehicle !== undefined) {
      obj.vehicle = VehiclePosition.toJSON(message.vehicle);
    }
    if (message.alert !== undefined) {
      obj.alert = Alert.toJSON(message.alert);
    }
    if (message.shape !== undefined) {
      obj.shape = Shape.toJSON(message.shape);
    }
    if (message.stop !== undefined) {
      obj.stop = Stop.toJSON(message.stop);
    }
    if (message.tripModifications !== undefined) {
      obj.tripModifications = TripModifications.toJSON(message.tripModifications);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FeedEntity>, I>>(base?: I): FeedEntity {
    return FeedEntity.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FeedEntity>, I>>(object: I): FeedEntity {
    const message = createBaseFeedEntity();
    message.id = object.id ?? "";
    message.isDeleted = object.isDeleted ?? false;
    message.tripUpdate = (object.tripUpdate !== undefined && object.tripUpdate !== null)
      ? TripUpdate.fromPartial(object.tripUpdate)
      : undefined;
    message.vehicle = (object.vehicle !== undefined && object.vehicle !== null)
      ? VehiclePosition.fromPartial(object.vehicle)
      : undefined;
    message.alert = (object.alert !== undefined && object.alert !== null) ? Alert.fromPartial(object.alert) : undefined;
    message.shape = (object.shape !== undefined && object.shape !== null) ? Shape.fromPartial(object.shape) : undefined;
    message.stop = (object.stop !== undefined && object.stop !== null) ? Stop.fromPartial(object.stop) : undefined;
    message.tripModifications = (object.tripModifications !== undefined && object.tripModifications !== null)
      ? TripModifications.fromPartial(object.tripModifications)
      : undefined;
    return message;
  },
};

function createBaseTripUpdate(): TripUpdate {
  return { trip: undefined, vehicle: undefined, stopTimeUpdate: [], timestamp: 0, delay: 0, tripProperties: undefined };
}

export const TripUpdate = {
  encode(message: TripUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.trip !== undefined) {
      TripDescriptor.encode(message.trip, writer.uint32(10).fork()).ldelim();
    }
    if (message.vehicle !== undefined) {
      VehicleDescriptor.encode(message.vehicle, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.stopTimeUpdate) {
      TripUpdate_StopTimeUpdate.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.timestamp !== undefined && message.timestamp !== 0) {
      writer.uint32(32).uint64(message.timestamp);
    }
    if (message.delay !== undefined && message.delay !== 0) {
      writer.uint32(40).int32(message.delay);
    }
    if (message.tripProperties !== undefined) {
      TripUpdate_TripProperties.encode(message.tripProperties, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.trip = TripDescriptor.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.vehicle = VehicleDescriptor.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.stopTimeUpdate.push(TripUpdate_StopTimeUpdate.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.timestamp = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.delay = reader.int32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.tripProperties = TripUpdate_TripProperties.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripUpdate {
    return {
      trip: isSet(object.trip) ? TripDescriptor.fromJSON(object.trip) : undefined,
      vehicle: isSet(object.vehicle) ? VehicleDescriptor.fromJSON(object.vehicle) : undefined,
      stopTimeUpdate: globalThis.Array.isArray(object?.stopTimeUpdate)
        ? object.stopTimeUpdate.map((e: any) => TripUpdate_StopTimeUpdate.fromJSON(e))
        : [],
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      delay: isSet(object.delay) ? globalThis.Number(object.delay) : 0,
      tripProperties: isSet(object.tripProperties)
        ? TripUpdate_TripProperties.fromJSON(object.tripProperties)
        : undefined,
    };
  },

  toJSON(message: TripUpdate): unknown {
    const obj: any = {};
    if (message.trip !== undefined) {
      obj.trip = TripDescriptor.toJSON(message.trip);
    }
    if (message.vehicle !== undefined) {
      obj.vehicle = VehicleDescriptor.toJSON(message.vehicle);
    }
    if (message.stopTimeUpdate?.length) {
      obj.stopTimeUpdate = message.stopTimeUpdate.map((e) => TripUpdate_StopTimeUpdate.toJSON(e));
    }
    if (message.timestamp !== undefined && message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.delay !== undefined && message.delay !== 0) {
      obj.delay = Math.round(message.delay);
    }
    if (message.tripProperties !== undefined) {
      obj.tripProperties = TripUpdate_TripProperties.toJSON(message.tripProperties);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripUpdate>, I>>(base?: I): TripUpdate {
    return TripUpdate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripUpdate>, I>>(object: I): TripUpdate {
    const message = createBaseTripUpdate();
    message.trip = (object.trip !== undefined && object.trip !== null)
      ? TripDescriptor.fromPartial(object.trip)
      : undefined;
    message.vehicle = (object.vehicle !== undefined && object.vehicle !== null)
      ? VehicleDescriptor.fromPartial(object.vehicle)
      : undefined;
    message.stopTimeUpdate = object.stopTimeUpdate?.map((e) => TripUpdate_StopTimeUpdate.fromPartial(e)) || [];
    message.timestamp = object.timestamp ?? 0;
    message.delay = object.delay ?? 0;
    message.tripProperties = (object.tripProperties !== undefined && object.tripProperties !== null)
      ? TripUpdate_TripProperties.fromPartial(object.tripProperties)
      : undefined;
    return message;
  },
};

function createBaseTripUpdate_StopTimeEvent(): TripUpdate_StopTimeEvent {
  return { delay: 0, time: 0, uncertainty: 0 };
}

export const TripUpdate_StopTimeEvent = {
  encode(message: TripUpdate_StopTimeEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.delay !== undefined && message.delay !== 0) {
      writer.uint32(8).int32(message.delay);
    }
    if (message.time !== undefined && message.time !== 0) {
      writer.uint32(16).int64(message.time);
    }
    if (message.uncertainty !== undefined && message.uncertainty !== 0) {
      writer.uint32(24).int32(message.uncertainty);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripUpdate_StopTimeEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripUpdate_StopTimeEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.delay = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.time = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.uncertainty = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripUpdate_StopTimeEvent {
    return {
      delay: isSet(object.delay) ? globalThis.Number(object.delay) : 0,
      time: isSet(object.time) ? globalThis.Number(object.time) : 0,
      uncertainty: isSet(object.uncertainty) ? globalThis.Number(object.uncertainty) : 0,
    };
  },

  toJSON(message: TripUpdate_StopTimeEvent): unknown {
    const obj: any = {};
    if (message.delay !== undefined && message.delay !== 0) {
      obj.delay = Math.round(message.delay);
    }
    if (message.time !== undefined && message.time !== 0) {
      obj.time = Math.round(message.time);
    }
    if (message.uncertainty !== undefined && message.uncertainty !== 0) {
      obj.uncertainty = Math.round(message.uncertainty);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripUpdate_StopTimeEvent>, I>>(base?: I): TripUpdate_StopTimeEvent {
    return TripUpdate_StopTimeEvent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripUpdate_StopTimeEvent>, I>>(object: I): TripUpdate_StopTimeEvent {
    const message = createBaseTripUpdate_StopTimeEvent();
    message.delay = object.delay ?? 0;
    message.time = object.time ?? 0;
    message.uncertainty = object.uncertainty ?? 0;
    return message;
  },
};

function createBaseTripUpdate_StopTimeUpdate(): TripUpdate_StopTimeUpdate {
  return {
    stopSequence: 0,
    stopId: "",
    arrival: undefined,
    departure: undefined,
    departureOccupancyStatus: 0,
    scheduleRelationship: 0,
    stopTimeProperties: undefined,
  };
}

export const TripUpdate_StopTimeUpdate = {
  encode(message: TripUpdate_StopTimeUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stopSequence !== undefined && message.stopSequence !== 0) {
      writer.uint32(8).uint32(message.stopSequence);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      writer.uint32(34).string(message.stopId);
    }
    if (message.arrival !== undefined) {
      TripUpdate_StopTimeEvent.encode(message.arrival, writer.uint32(18).fork()).ldelim();
    }
    if (message.departure !== undefined) {
      TripUpdate_StopTimeEvent.encode(message.departure, writer.uint32(26).fork()).ldelim();
    }
    if (message.departureOccupancyStatus !== undefined && message.departureOccupancyStatus !== 0) {
      writer.uint32(56).int32(message.departureOccupancyStatus);
    }
    if (message.scheduleRelationship !== undefined && message.scheduleRelationship !== 0) {
      writer.uint32(40).int32(message.scheduleRelationship);
    }
    if (message.stopTimeProperties !== undefined) {
      TripUpdate_StopTimeUpdate_StopTimeProperties.encode(message.stopTimeProperties, writer.uint32(50).fork())
        .ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripUpdate_StopTimeUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripUpdate_StopTimeUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.stopSequence = reader.uint32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.stopId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.arrival = TripUpdate_StopTimeEvent.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.departure = TripUpdate_StopTimeEvent.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.departureOccupancyStatus = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.scheduleRelationship = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.stopTimeProperties = TripUpdate_StopTimeUpdate_StopTimeProperties.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripUpdate_StopTimeUpdate {
    return {
      stopSequence: isSet(object.stopSequence) ? globalThis.Number(object.stopSequence) : 0,
      stopId: isSet(object.stopId) ? globalThis.String(object.stopId) : "",
      arrival: isSet(object.arrival) ? TripUpdate_StopTimeEvent.fromJSON(object.arrival) : undefined,
      departure: isSet(object.departure) ? TripUpdate_StopTimeEvent.fromJSON(object.departure) : undefined,
      departureOccupancyStatus: isSet(object.departureOccupancyStatus)
        ? vehiclePosition_OccupancyStatusFromJSON(object.departureOccupancyStatus)
        : 0,
      scheduleRelationship: isSet(object.scheduleRelationship)
        ? tripUpdate_StopTimeUpdate_ScheduleRelationshipFromJSON(object.scheduleRelationship)
        : 0,
      stopTimeProperties: isSet(object.stopTimeProperties)
        ? TripUpdate_StopTimeUpdate_StopTimeProperties.fromJSON(object.stopTimeProperties)
        : undefined,
    };
  },

  toJSON(message: TripUpdate_StopTimeUpdate): unknown {
    const obj: any = {};
    if (message.stopSequence !== undefined && message.stopSequence !== 0) {
      obj.stopSequence = Math.round(message.stopSequence);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      obj.stopId = message.stopId;
    }
    if (message.arrival !== undefined) {
      obj.arrival = TripUpdate_StopTimeEvent.toJSON(message.arrival);
    }
    if (message.departure !== undefined) {
      obj.departure = TripUpdate_StopTimeEvent.toJSON(message.departure);
    }
    if (message.departureOccupancyStatus !== undefined && message.departureOccupancyStatus !== 0) {
      obj.departureOccupancyStatus = vehiclePosition_OccupancyStatusToJSON(message.departureOccupancyStatus);
    }
    if (message.scheduleRelationship !== undefined && message.scheduleRelationship !== 0) {
      obj.scheduleRelationship = tripUpdate_StopTimeUpdate_ScheduleRelationshipToJSON(message.scheduleRelationship);
    }
    if (message.stopTimeProperties !== undefined) {
      obj.stopTimeProperties = TripUpdate_StopTimeUpdate_StopTimeProperties.toJSON(message.stopTimeProperties);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripUpdate_StopTimeUpdate>, I>>(base?: I): TripUpdate_StopTimeUpdate {
    return TripUpdate_StopTimeUpdate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripUpdate_StopTimeUpdate>, I>>(object: I): TripUpdate_StopTimeUpdate {
    const message = createBaseTripUpdate_StopTimeUpdate();
    message.stopSequence = object.stopSequence ?? 0;
    message.stopId = object.stopId ?? "";
    message.arrival = (object.arrival !== undefined && object.arrival !== null)
      ? TripUpdate_StopTimeEvent.fromPartial(object.arrival)
      : undefined;
    message.departure = (object.departure !== undefined && object.departure !== null)
      ? TripUpdate_StopTimeEvent.fromPartial(object.departure)
      : undefined;
    message.departureOccupancyStatus = object.departureOccupancyStatus ?? 0;
    message.scheduleRelationship = object.scheduleRelationship ?? 0;
    message.stopTimeProperties = (object.stopTimeProperties !== undefined && object.stopTimeProperties !== null)
      ? TripUpdate_StopTimeUpdate_StopTimeProperties.fromPartial(object.stopTimeProperties)
      : undefined;
    return message;
  },
};

function createBaseTripUpdate_StopTimeUpdate_StopTimeProperties(): TripUpdate_StopTimeUpdate_StopTimeProperties {
  return { assignedStopId: "" };
}

export const TripUpdate_StopTimeUpdate_StopTimeProperties = {
  encode(message: TripUpdate_StopTimeUpdate_StopTimeProperties, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.assignedStopId !== undefined && message.assignedStopId !== "") {
      writer.uint32(10).string(message.assignedStopId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripUpdate_StopTimeUpdate_StopTimeProperties {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripUpdate_StopTimeUpdate_StopTimeProperties();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.assignedStopId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripUpdate_StopTimeUpdate_StopTimeProperties {
    return { assignedStopId: isSet(object.assignedStopId) ? globalThis.String(object.assignedStopId) : "" };
  },

  toJSON(message: TripUpdate_StopTimeUpdate_StopTimeProperties): unknown {
    const obj: any = {};
    if (message.assignedStopId !== undefined && message.assignedStopId !== "") {
      obj.assignedStopId = message.assignedStopId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripUpdate_StopTimeUpdate_StopTimeProperties>, I>>(
    base?: I,
  ): TripUpdate_StopTimeUpdate_StopTimeProperties {
    return TripUpdate_StopTimeUpdate_StopTimeProperties.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripUpdate_StopTimeUpdate_StopTimeProperties>, I>>(
    object: I,
  ): TripUpdate_StopTimeUpdate_StopTimeProperties {
    const message = createBaseTripUpdate_StopTimeUpdate_StopTimeProperties();
    message.assignedStopId = object.assignedStopId ?? "";
    return message;
  },
};

function createBaseTripUpdate_TripProperties(): TripUpdate_TripProperties {
  return { tripId: "", startDate: "", startTime: "", shapeId: "" };
}

export const TripUpdate_TripProperties = {
  encode(message: TripUpdate_TripProperties, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tripId !== undefined && message.tripId !== "") {
      writer.uint32(10).string(message.tripId);
    }
    if (message.startDate !== undefined && message.startDate !== "") {
      writer.uint32(18).string(message.startDate);
    }
    if (message.startTime !== undefined && message.startTime !== "") {
      writer.uint32(26).string(message.startTime);
    }
    if (message.shapeId !== undefined && message.shapeId !== "") {
      writer.uint32(34).string(message.shapeId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripUpdate_TripProperties {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripUpdate_TripProperties();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tripId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.startDate = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.startTime = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.shapeId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripUpdate_TripProperties {
    return {
      tripId: isSet(object.tripId) ? globalThis.String(object.tripId) : "",
      startDate: isSet(object.startDate) ? globalThis.String(object.startDate) : "",
      startTime: isSet(object.startTime) ? globalThis.String(object.startTime) : "",
      shapeId: isSet(object.shapeId) ? globalThis.String(object.shapeId) : "",
    };
  },

  toJSON(message: TripUpdate_TripProperties): unknown {
    const obj: any = {};
    if (message.tripId !== undefined && message.tripId !== "") {
      obj.tripId = message.tripId;
    }
    if (message.startDate !== undefined && message.startDate !== "") {
      obj.startDate = message.startDate;
    }
    if (message.startTime !== undefined && message.startTime !== "") {
      obj.startTime = message.startTime;
    }
    if (message.shapeId !== undefined && message.shapeId !== "") {
      obj.shapeId = message.shapeId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripUpdate_TripProperties>, I>>(base?: I): TripUpdate_TripProperties {
    return TripUpdate_TripProperties.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripUpdate_TripProperties>, I>>(object: I): TripUpdate_TripProperties {
    const message = createBaseTripUpdate_TripProperties();
    message.tripId = object.tripId ?? "";
    message.startDate = object.startDate ?? "";
    message.startTime = object.startTime ?? "";
    message.shapeId = object.shapeId ?? "";
    return message;
  },
};

function createBaseVehiclePosition(): VehiclePosition {
  return {
    trip: undefined,
    vehicle: undefined,
    position: undefined,
    currentStopSequence: 0,
    stopId: "",
    currentStatus: 2,
    timestamp: 0,
    congestionLevel: 0,
    occupancyStatus: 0,
    occupancyPercentage: 0,
    multiCarriageDetails: [],
  };
}

export const VehiclePosition = {
  encode(message: VehiclePosition, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.trip !== undefined) {
      TripDescriptor.encode(message.trip, writer.uint32(10).fork()).ldelim();
    }
    if (message.vehicle !== undefined) {
      VehicleDescriptor.encode(message.vehicle, writer.uint32(66).fork()).ldelim();
    }
    if (message.position !== undefined) {
      Position.encode(message.position, writer.uint32(18).fork()).ldelim();
    }
    if (message.currentStopSequence !== undefined && message.currentStopSequence !== 0) {
      writer.uint32(24).uint32(message.currentStopSequence);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      writer.uint32(58).string(message.stopId);
    }
    if (message.currentStatus !== undefined && message.currentStatus !== 2) {
      writer.uint32(32).int32(message.currentStatus);
    }
    if (message.timestamp !== undefined && message.timestamp !== 0) {
      writer.uint32(40).uint64(message.timestamp);
    }
    if (message.congestionLevel !== undefined && message.congestionLevel !== 0) {
      writer.uint32(48).int32(message.congestionLevel);
    }
    if (message.occupancyStatus !== undefined && message.occupancyStatus !== 0) {
      writer.uint32(72).int32(message.occupancyStatus);
    }
    if (message.occupancyPercentage !== undefined && message.occupancyPercentage !== 0) {
      writer.uint32(80).uint32(message.occupancyPercentage);
    }
    for (const v of message.multiCarriageDetails) {
      VehiclePosition_CarriageDetails.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VehiclePosition {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVehiclePosition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.trip = TripDescriptor.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.vehicle = VehicleDescriptor.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.position = Position.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.currentStopSequence = reader.uint32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.stopId = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.currentStatus = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.timestamp = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.congestionLevel = reader.int32() as any;
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.occupancyStatus = reader.int32() as any;
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.occupancyPercentage = reader.uint32();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.multiCarriageDetails.push(VehiclePosition_CarriageDetails.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VehiclePosition {
    return {
      trip: isSet(object.trip) ? TripDescriptor.fromJSON(object.trip) : undefined,
      vehicle: isSet(object.vehicle) ? VehicleDescriptor.fromJSON(object.vehicle) : undefined,
      position: isSet(object.position) ? Position.fromJSON(object.position) : undefined,
      currentStopSequence: isSet(object.currentStopSequence) ? globalThis.Number(object.currentStopSequence) : 0,
      stopId: isSet(object.stopId) ? globalThis.String(object.stopId) : "",
      currentStatus: isSet(object.currentStatus) ? vehiclePosition_VehicleStopStatusFromJSON(object.currentStatus) : 2,
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      congestionLevel: isSet(object.congestionLevel)
        ? vehiclePosition_CongestionLevelFromJSON(object.congestionLevel)
        : 0,
      occupancyStatus: isSet(object.occupancyStatus)
        ? vehiclePosition_OccupancyStatusFromJSON(object.occupancyStatus)
        : 0,
      occupancyPercentage: isSet(object.occupancyPercentage) ? globalThis.Number(object.occupancyPercentage) : 0,
      multiCarriageDetails: globalThis.Array.isArray(object?.multiCarriageDetails)
        ? object.multiCarriageDetails.map((e: any) => VehiclePosition_CarriageDetails.fromJSON(e))
        : [],
    };
  },

  toJSON(message: VehiclePosition): unknown {
    const obj: any = {};
    if (message.trip !== undefined) {
      obj.trip = TripDescriptor.toJSON(message.trip);
    }
    if (message.vehicle !== undefined) {
      obj.vehicle = VehicleDescriptor.toJSON(message.vehicle);
    }
    if (message.position !== undefined) {
      obj.position = Position.toJSON(message.position);
    }
    if (message.currentStopSequence !== undefined && message.currentStopSequence !== 0) {
      obj.currentStopSequence = Math.round(message.currentStopSequence);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      obj.stopId = message.stopId;
    }
    if (message.currentStatus !== undefined && message.currentStatus !== 2) {
      obj.currentStatus = vehiclePosition_VehicleStopStatusToJSON(message.currentStatus);
    }
    if (message.timestamp !== undefined && message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.congestionLevel !== undefined && message.congestionLevel !== 0) {
      obj.congestionLevel = vehiclePosition_CongestionLevelToJSON(message.congestionLevel);
    }
    if (message.occupancyStatus !== undefined && message.occupancyStatus !== 0) {
      obj.occupancyStatus = vehiclePosition_OccupancyStatusToJSON(message.occupancyStatus);
    }
    if (message.occupancyPercentage !== undefined && message.occupancyPercentage !== 0) {
      obj.occupancyPercentage = Math.round(message.occupancyPercentage);
    }
    if (message.multiCarriageDetails?.length) {
      obj.multiCarriageDetails = message.multiCarriageDetails.map((e) => VehiclePosition_CarriageDetails.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VehiclePosition>, I>>(base?: I): VehiclePosition {
    return VehiclePosition.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VehiclePosition>, I>>(object: I): VehiclePosition {
    const message = createBaseVehiclePosition();
    message.trip = (object.trip !== undefined && object.trip !== null)
      ? TripDescriptor.fromPartial(object.trip)
      : undefined;
    message.vehicle = (object.vehicle !== undefined && object.vehicle !== null)
      ? VehicleDescriptor.fromPartial(object.vehicle)
      : undefined;
    message.position = (object.position !== undefined && object.position !== null)
      ? Position.fromPartial(object.position)
      : undefined;
    message.currentStopSequence = object.currentStopSequence ?? 0;
    message.stopId = object.stopId ?? "";
    message.currentStatus = object.currentStatus ?? 2;
    message.timestamp = object.timestamp ?? 0;
    message.congestionLevel = object.congestionLevel ?? 0;
    message.occupancyStatus = object.occupancyStatus ?? 0;
    message.occupancyPercentage = object.occupancyPercentage ?? 0;
    message.multiCarriageDetails =
      object.multiCarriageDetails?.map((e) => VehiclePosition_CarriageDetails.fromPartial(e)) || [];
    return message;
  },
};

function createBaseVehiclePosition_CarriageDetails(): VehiclePosition_CarriageDetails {
  return { id: "", label: "", occupancyStatus: 7, occupancyPercentage: -1, carriageSequence: 0 };
}

export const VehiclePosition_CarriageDetails = {
  encode(message: VehiclePosition_CarriageDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.label !== undefined && message.label !== "") {
      writer.uint32(18).string(message.label);
    }
    if (message.occupancyStatus !== undefined && message.occupancyStatus !== 7) {
      writer.uint32(24).int32(message.occupancyStatus);
    }
    if (message.occupancyPercentage !== undefined && message.occupancyPercentage !== -1) {
      writer.uint32(32).int32(message.occupancyPercentage);
    }
    if (message.carriageSequence !== undefined && message.carriageSequence !== 0) {
      writer.uint32(40).uint32(message.carriageSequence);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VehiclePosition_CarriageDetails {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVehiclePosition_CarriageDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.label = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.occupancyStatus = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.occupancyPercentage = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.carriageSequence = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VehiclePosition_CarriageDetails {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      label: isSet(object.label) ? globalThis.String(object.label) : "",
      occupancyStatus: isSet(object.occupancyStatus)
        ? vehiclePosition_OccupancyStatusFromJSON(object.occupancyStatus)
        : 7,
      occupancyPercentage: isSet(object.occupancyPercentage) ? globalThis.Number(object.occupancyPercentage) : -1,
      carriageSequence: isSet(object.carriageSequence) ? globalThis.Number(object.carriageSequence) : 0,
    };
  },

  toJSON(message: VehiclePosition_CarriageDetails): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.label !== undefined && message.label !== "") {
      obj.label = message.label;
    }
    if (message.occupancyStatus !== undefined && message.occupancyStatus !== 7) {
      obj.occupancyStatus = vehiclePosition_OccupancyStatusToJSON(message.occupancyStatus);
    }
    if (message.occupancyPercentage !== undefined && message.occupancyPercentage !== -1) {
      obj.occupancyPercentage = Math.round(message.occupancyPercentage);
    }
    if (message.carriageSequence !== undefined && message.carriageSequence !== 0) {
      obj.carriageSequence = Math.round(message.carriageSequence);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VehiclePosition_CarriageDetails>, I>>(base?: I): VehiclePosition_CarriageDetails {
    return VehiclePosition_CarriageDetails.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VehiclePosition_CarriageDetails>, I>>(
    object: I,
  ): VehiclePosition_CarriageDetails {
    const message = createBaseVehiclePosition_CarriageDetails();
    message.id = object.id ?? "";
    message.label = object.label ?? "";
    message.occupancyStatus = object.occupancyStatus ?? 7;
    message.occupancyPercentage = object.occupancyPercentage ?? -1;
    message.carriageSequence = object.carriageSequence ?? 0;
    return message;
  },
};

function createBaseAlert(): Alert {
  return {
    activePeriod: [],
    informedEntity: [],
    cause: 1,
    effect: 8,
    url: undefined,
    headerText: undefined,
    descriptionText: undefined,
    ttsHeaderText: undefined,
    ttsDescriptionText: undefined,
    severityLevel: 1,
    image: undefined,
    imageAlternativeText: undefined,
    causeDetail: undefined,
    effectDetail: undefined,
  };
}

export const Alert = {
  encode(message: Alert, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.activePeriod) {
      TimeRange.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.informedEntity) {
      EntitySelector.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.cause !== undefined && message.cause !== 1) {
      writer.uint32(48).int32(message.cause);
    }
    if (message.effect !== undefined && message.effect !== 8) {
      writer.uint32(56).int32(message.effect);
    }
    if (message.url !== undefined) {
      TranslatedString.encode(message.url, writer.uint32(66).fork()).ldelim();
    }
    if (message.headerText !== undefined) {
      TranslatedString.encode(message.headerText, writer.uint32(82).fork()).ldelim();
    }
    if (message.descriptionText !== undefined) {
      TranslatedString.encode(message.descriptionText, writer.uint32(90).fork()).ldelim();
    }
    if (message.ttsHeaderText !== undefined) {
      TranslatedString.encode(message.ttsHeaderText, writer.uint32(98).fork()).ldelim();
    }
    if (message.ttsDescriptionText !== undefined) {
      TranslatedString.encode(message.ttsDescriptionText, writer.uint32(106).fork()).ldelim();
    }
    if (message.severityLevel !== undefined && message.severityLevel !== 1) {
      writer.uint32(112).int32(message.severityLevel);
    }
    if (message.image !== undefined) {
      TranslatedImage.encode(message.image, writer.uint32(122).fork()).ldelim();
    }
    if (message.imageAlternativeText !== undefined) {
      TranslatedString.encode(message.imageAlternativeText, writer.uint32(130).fork()).ldelim();
    }
    if (message.causeDetail !== undefined) {
      TranslatedString.encode(message.causeDetail, writer.uint32(138).fork()).ldelim();
    }
    if (message.effectDetail !== undefined) {
      TranslatedString.encode(message.effectDetail, writer.uint32(146).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Alert {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlert();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.activePeriod.push(TimeRange.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.informedEntity.push(EntitySelector.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.cause = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.effect = reader.int32() as any;
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.url = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.headerText = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.descriptionText = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.ttsHeaderText = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.ttsDescriptionText = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.severityLevel = reader.int32() as any;
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.image = TranslatedImage.decode(reader, reader.uint32());
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.imageAlternativeText = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.causeDetail = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.effectDetail = TranslatedString.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Alert {
    return {
      activePeriod: globalThis.Array.isArray(object?.activePeriod)
        ? object.activePeriod.map((e: any) => TimeRange.fromJSON(e))
        : [],
      informedEntity: globalThis.Array.isArray(object?.informedEntity)
        ? object.informedEntity.map((e: any) => EntitySelector.fromJSON(e))
        : [],
      cause: isSet(object.cause) ? alert_CauseFromJSON(object.cause) : 1,
      effect: isSet(object.effect) ? alert_EffectFromJSON(object.effect) : 8,
      url: isSet(object.url) ? TranslatedString.fromJSON(object.url) : undefined,
      headerText: isSet(object.headerText) ? TranslatedString.fromJSON(object.headerText) : undefined,
      descriptionText: isSet(object.descriptionText) ? TranslatedString.fromJSON(object.descriptionText) : undefined,
      ttsHeaderText: isSet(object.ttsHeaderText) ? TranslatedString.fromJSON(object.ttsHeaderText) : undefined,
      ttsDescriptionText: isSet(object.ttsDescriptionText)
        ? TranslatedString.fromJSON(object.ttsDescriptionText)
        : undefined,
      severityLevel: isSet(object.severityLevel) ? alert_SeverityLevelFromJSON(object.severityLevel) : 1,
      image: isSet(object.image) ? TranslatedImage.fromJSON(object.image) : undefined,
      imageAlternativeText: isSet(object.imageAlternativeText)
        ? TranslatedString.fromJSON(object.imageAlternativeText)
        : undefined,
      causeDetail: isSet(object.causeDetail) ? TranslatedString.fromJSON(object.causeDetail) : undefined,
      effectDetail: isSet(object.effectDetail) ? TranslatedString.fromJSON(object.effectDetail) : undefined,
    };
  },

  toJSON(message: Alert): unknown {
    const obj: any = {};
    if (message.activePeriod?.length) {
      obj.activePeriod = message.activePeriod.map((e) => TimeRange.toJSON(e));
    }
    if (message.informedEntity?.length) {
      obj.informedEntity = message.informedEntity.map((e) => EntitySelector.toJSON(e));
    }
    if (message.cause !== undefined && message.cause !== 1) {
      obj.cause = alert_CauseToJSON(message.cause);
    }
    if (message.effect !== undefined && message.effect !== 8) {
      obj.effect = alert_EffectToJSON(message.effect);
    }
    if (message.url !== undefined) {
      obj.url = TranslatedString.toJSON(message.url);
    }
    if (message.headerText !== undefined) {
      obj.headerText = TranslatedString.toJSON(message.headerText);
    }
    if (message.descriptionText !== undefined) {
      obj.descriptionText = TranslatedString.toJSON(message.descriptionText);
    }
    if (message.ttsHeaderText !== undefined) {
      obj.ttsHeaderText = TranslatedString.toJSON(message.ttsHeaderText);
    }
    if (message.ttsDescriptionText !== undefined) {
      obj.ttsDescriptionText = TranslatedString.toJSON(message.ttsDescriptionText);
    }
    if (message.severityLevel !== undefined && message.severityLevel !== 1) {
      obj.severityLevel = alert_SeverityLevelToJSON(message.severityLevel);
    }
    if (message.image !== undefined) {
      obj.image = TranslatedImage.toJSON(message.image);
    }
    if (message.imageAlternativeText !== undefined) {
      obj.imageAlternativeText = TranslatedString.toJSON(message.imageAlternativeText);
    }
    if (message.causeDetail !== undefined) {
      obj.causeDetail = TranslatedString.toJSON(message.causeDetail);
    }
    if (message.effectDetail !== undefined) {
      obj.effectDetail = TranslatedString.toJSON(message.effectDetail);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Alert>, I>>(base?: I): Alert {
    return Alert.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Alert>, I>>(object: I): Alert {
    const message = createBaseAlert();
    message.activePeriod = object.activePeriod?.map((e) => TimeRange.fromPartial(e)) || [];
    message.informedEntity = object.informedEntity?.map((e) => EntitySelector.fromPartial(e)) || [];
    message.cause = object.cause ?? 1;
    message.effect = object.effect ?? 8;
    message.url = (object.url !== undefined && object.url !== null)
      ? TranslatedString.fromPartial(object.url)
      : undefined;
    message.headerText = (object.headerText !== undefined && object.headerText !== null)
      ? TranslatedString.fromPartial(object.headerText)
      : undefined;
    message.descriptionText = (object.descriptionText !== undefined && object.descriptionText !== null)
      ? TranslatedString.fromPartial(object.descriptionText)
      : undefined;
    message.ttsHeaderText = (object.ttsHeaderText !== undefined && object.ttsHeaderText !== null)
      ? TranslatedString.fromPartial(object.ttsHeaderText)
      : undefined;
    message.ttsDescriptionText = (object.ttsDescriptionText !== undefined && object.ttsDescriptionText !== null)
      ? TranslatedString.fromPartial(object.ttsDescriptionText)
      : undefined;
    message.severityLevel = object.severityLevel ?? 1;
    message.image = (object.image !== undefined && object.image !== null)
      ? TranslatedImage.fromPartial(object.image)
      : undefined;
    message.imageAlternativeText = (object.imageAlternativeText !== undefined && object.imageAlternativeText !== null)
      ? TranslatedString.fromPartial(object.imageAlternativeText)
      : undefined;
    message.causeDetail = (object.causeDetail !== undefined && object.causeDetail !== null)
      ? TranslatedString.fromPartial(object.causeDetail)
      : undefined;
    message.effectDetail = (object.effectDetail !== undefined && object.effectDetail !== null)
      ? TranslatedString.fromPartial(object.effectDetail)
      : undefined;
    return message;
  },
};

function createBaseTimeRange(): TimeRange {
  return { start: 0, end: 0 };
}

export const TimeRange = {
  encode(message: TimeRange, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.start !== undefined && message.start !== 0) {
      writer.uint32(8).uint64(message.start);
    }
    if (message.end !== undefined && message.end !== 0) {
      writer.uint32(16).uint64(message.end);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TimeRange {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimeRange();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.start = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.end = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TimeRange {
    return {
      start: isSet(object.start) ? globalThis.Number(object.start) : 0,
      end: isSet(object.end) ? globalThis.Number(object.end) : 0,
    };
  },

  toJSON(message: TimeRange): unknown {
    const obj: any = {};
    if (message.start !== undefined && message.start !== 0) {
      obj.start = Math.round(message.start);
    }
    if (message.end !== undefined && message.end !== 0) {
      obj.end = Math.round(message.end);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TimeRange>, I>>(base?: I): TimeRange {
    return TimeRange.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TimeRange>, I>>(object: I): TimeRange {
    const message = createBaseTimeRange();
    message.start = object.start ?? 0;
    message.end = object.end ?? 0;
    return message;
  },
};

function createBasePosition(): Position {
  return { latitude: 0, longitude: 0, bearing: 0, odometer: 0, speed: 0 };
}

export const Position = {
  encode(message: Position, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.latitude !== 0) {
      writer.uint32(13).float(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(21).float(message.longitude);
    }
    if (message.bearing !== undefined && message.bearing !== 0) {
      writer.uint32(29).float(message.bearing);
    }
    if (message.odometer !== undefined && message.odometer !== 0) {
      writer.uint32(33).double(message.odometer);
    }
    if (message.speed !== undefined && message.speed !== 0) {
      writer.uint32(45).float(message.speed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Position {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePosition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.latitude = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.longitude = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.bearing = reader.float();
          continue;
        case 4:
          if (tag !== 33) {
            break;
          }

          message.odometer = reader.double();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }

          message.speed = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Position {
    return {
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
      bearing: isSet(object.bearing) ? globalThis.Number(object.bearing) : 0,
      odometer: isSet(object.odometer) ? globalThis.Number(object.odometer) : 0,
      speed: isSet(object.speed) ? globalThis.Number(object.speed) : 0,
    };
  },

  toJSON(message: Position): unknown {
    const obj: any = {};
    if (message.latitude !== 0) {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== 0) {
      obj.longitude = message.longitude;
    }
    if (message.bearing !== undefined && message.bearing !== 0) {
      obj.bearing = message.bearing;
    }
    if (message.odometer !== undefined && message.odometer !== 0) {
      obj.odometer = message.odometer;
    }
    if (message.speed !== undefined && message.speed !== 0) {
      obj.speed = message.speed;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Position>, I>>(base?: I): Position {
    return Position.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Position>, I>>(object: I): Position {
    const message = createBasePosition();
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    message.bearing = object.bearing ?? 0;
    message.odometer = object.odometer ?? 0;
    message.speed = object.speed ?? 0;
    return message;
  },
};

function createBaseTripDescriptor(): TripDescriptor {
  return {
    tripId: "",
    routeId: "",
    directionId: 0,
    startTime: "",
    startDate: "",
    scheduleRelationship: 0,
    modifiedTrip: undefined,
  };
}

export const TripDescriptor = {
  encode(message: TripDescriptor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tripId !== undefined && message.tripId !== "") {
      writer.uint32(10).string(message.tripId);
    }
    if (message.routeId !== undefined && message.routeId !== "") {
      writer.uint32(42).string(message.routeId);
    }
    if (message.directionId !== undefined && message.directionId !== 0) {
      writer.uint32(48).uint32(message.directionId);
    }
    if (message.startTime !== undefined && message.startTime !== "") {
      writer.uint32(18).string(message.startTime);
    }
    if (message.startDate !== undefined && message.startDate !== "") {
      writer.uint32(26).string(message.startDate);
    }
    if (message.scheduleRelationship !== undefined && message.scheduleRelationship !== 0) {
      writer.uint32(32).int32(message.scheduleRelationship);
    }
    if (message.modifiedTrip !== undefined) {
      TripDescriptor_ModifiedTripSelector.encode(message.modifiedTrip, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripDescriptor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripDescriptor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tripId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.routeId = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.directionId = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.startTime = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.startDate = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.scheduleRelationship = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.modifiedTrip = TripDescriptor_ModifiedTripSelector.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripDescriptor {
    return {
      tripId: isSet(object.tripId) ? globalThis.String(object.tripId) : "",
      routeId: isSet(object.routeId) ? globalThis.String(object.routeId) : "",
      directionId: isSet(object.directionId) ? globalThis.Number(object.directionId) : 0,
      startTime: isSet(object.startTime) ? globalThis.String(object.startTime) : "",
      startDate: isSet(object.startDate) ? globalThis.String(object.startDate) : "",
      scheduleRelationship: isSet(object.scheduleRelationship)
        ? tripDescriptor_ScheduleRelationshipFromJSON(object.scheduleRelationship)
        : 0,
      modifiedTrip: isSet(object.modifiedTrip)
        ? TripDescriptor_ModifiedTripSelector.fromJSON(object.modifiedTrip)
        : undefined,
    };
  },

  toJSON(message: TripDescriptor): unknown {
    const obj: any = {};
    if (message.tripId !== undefined && message.tripId !== "") {
      obj.tripId = message.tripId;
    }
    if (message.routeId !== undefined && message.routeId !== "") {
      obj.routeId = message.routeId;
    }
    if (message.directionId !== undefined && message.directionId !== 0) {
      obj.directionId = Math.round(message.directionId);
    }
    if (message.startTime !== undefined && message.startTime !== "") {
      obj.startTime = message.startTime;
    }
    if (message.startDate !== undefined && message.startDate !== "") {
      obj.startDate = message.startDate;
    }
    if (message.scheduleRelationship !== undefined && message.scheduleRelationship !== 0) {
      obj.scheduleRelationship = tripDescriptor_ScheduleRelationshipToJSON(message.scheduleRelationship);
    }
    if (message.modifiedTrip !== undefined) {
      obj.modifiedTrip = TripDescriptor_ModifiedTripSelector.toJSON(message.modifiedTrip);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripDescriptor>, I>>(base?: I): TripDescriptor {
    return TripDescriptor.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripDescriptor>, I>>(object: I): TripDescriptor {
    const message = createBaseTripDescriptor();
    message.tripId = object.tripId ?? "";
    message.routeId = object.routeId ?? "";
    message.directionId = object.directionId ?? 0;
    message.startTime = object.startTime ?? "";
    message.startDate = object.startDate ?? "";
    message.scheduleRelationship = object.scheduleRelationship ?? 0;
    message.modifiedTrip = (object.modifiedTrip !== undefined && object.modifiedTrip !== null)
      ? TripDescriptor_ModifiedTripSelector.fromPartial(object.modifiedTrip)
      : undefined;
    return message;
  },
};

function createBaseTripDescriptor_ModifiedTripSelector(): TripDescriptor_ModifiedTripSelector {
  return { modificationsId: "", affectedTripId: "" };
}

export const TripDescriptor_ModifiedTripSelector = {
  encode(message: TripDescriptor_ModifiedTripSelector, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.modificationsId !== undefined && message.modificationsId !== "") {
      writer.uint32(10).string(message.modificationsId);
    }
    if (message.affectedTripId !== undefined && message.affectedTripId !== "") {
      writer.uint32(18).string(message.affectedTripId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripDescriptor_ModifiedTripSelector {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripDescriptor_ModifiedTripSelector();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.modificationsId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.affectedTripId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripDescriptor_ModifiedTripSelector {
    return {
      modificationsId: isSet(object.modificationsId) ? globalThis.String(object.modificationsId) : "",
      affectedTripId: isSet(object.affectedTripId) ? globalThis.String(object.affectedTripId) : "",
    };
  },

  toJSON(message: TripDescriptor_ModifiedTripSelector): unknown {
    const obj: any = {};
    if (message.modificationsId !== undefined && message.modificationsId !== "") {
      obj.modificationsId = message.modificationsId;
    }
    if (message.affectedTripId !== undefined && message.affectedTripId !== "") {
      obj.affectedTripId = message.affectedTripId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripDescriptor_ModifiedTripSelector>, I>>(
    base?: I,
  ): TripDescriptor_ModifiedTripSelector {
    return TripDescriptor_ModifiedTripSelector.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripDescriptor_ModifiedTripSelector>, I>>(
    object: I,
  ): TripDescriptor_ModifiedTripSelector {
    const message = createBaseTripDescriptor_ModifiedTripSelector();
    message.modificationsId = object.modificationsId ?? "";
    message.affectedTripId = object.affectedTripId ?? "";
    return message;
  },
};

function createBaseVehicleDescriptor(): VehicleDescriptor {
  return { id: "", label: "", licensePlate: "", wheelchairAccessible: 0 };
}

export const VehicleDescriptor = {
  encode(message: VehicleDescriptor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined && message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.label !== undefined && message.label !== "") {
      writer.uint32(18).string(message.label);
    }
    if (message.licensePlate !== undefined && message.licensePlate !== "") {
      writer.uint32(26).string(message.licensePlate);
    }
    if (message.wheelchairAccessible !== undefined && message.wheelchairAccessible !== 0) {
      writer.uint32(32).int32(message.wheelchairAccessible);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VehicleDescriptor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVehicleDescriptor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.label = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.licensePlate = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.wheelchairAccessible = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VehicleDescriptor {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      label: isSet(object.label) ? globalThis.String(object.label) : "",
      licensePlate: isSet(object.licensePlate) ? globalThis.String(object.licensePlate) : "",
      wheelchairAccessible: isSet(object.wheelchairAccessible)
        ? vehicleDescriptor_WheelchairAccessibleFromJSON(object.wheelchairAccessible)
        : 0,
    };
  },

  toJSON(message: VehicleDescriptor): unknown {
    const obj: any = {};
    if (message.id !== undefined && message.id !== "") {
      obj.id = message.id;
    }
    if (message.label !== undefined && message.label !== "") {
      obj.label = message.label;
    }
    if (message.licensePlate !== undefined && message.licensePlate !== "") {
      obj.licensePlate = message.licensePlate;
    }
    if (message.wheelchairAccessible !== undefined && message.wheelchairAccessible !== 0) {
      obj.wheelchairAccessible = vehicleDescriptor_WheelchairAccessibleToJSON(message.wheelchairAccessible);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VehicleDescriptor>, I>>(base?: I): VehicleDescriptor {
    return VehicleDescriptor.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VehicleDescriptor>, I>>(object: I): VehicleDescriptor {
    const message = createBaseVehicleDescriptor();
    message.id = object.id ?? "";
    message.label = object.label ?? "";
    message.licensePlate = object.licensePlate ?? "";
    message.wheelchairAccessible = object.wheelchairAccessible ?? 0;
    return message;
  },
};

function createBaseEntitySelector(): EntitySelector {
  return { agencyId: "", routeId: "", routeType: 0, trip: undefined, stopId: "", directionId: 0 };
}

export const EntitySelector = {
  encode(message: EntitySelector, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.agencyId !== undefined && message.agencyId !== "") {
      writer.uint32(10).string(message.agencyId);
    }
    if (message.routeId !== undefined && message.routeId !== "") {
      writer.uint32(18).string(message.routeId);
    }
    if (message.routeType !== undefined && message.routeType !== 0) {
      writer.uint32(24).int32(message.routeType);
    }
    if (message.trip !== undefined) {
      TripDescriptor.encode(message.trip, writer.uint32(34).fork()).ldelim();
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      writer.uint32(42).string(message.stopId);
    }
    if (message.directionId !== undefined && message.directionId !== 0) {
      writer.uint32(48).uint32(message.directionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EntitySelector {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEntitySelector();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.agencyId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.routeId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.routeType = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.trip = TripDescriptor.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.stopId = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.directionId = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EntitySelector {
    return {
      agencyId: isSet(object.agencyId) ? globalThis.String(object.agencyId) : "",
      routeId: isSet(object.routeId) ? globalThis.String(object.routeId) : "",
      routeType: isSet(object.routeType) ? globalThis.Number(object.routeType) : 0,
      trip: isSet(object.trip) ? TripDescriptor.fromJSON(object.trip) : undefined,
      stopId: isSet(object.stopId) ? globalThis.String(object.stopId) : "",
      directionId: isSet(object.directionId) ? globalThis.Number(object.directionId) : 0,
    };
  },

  toJSON(message: EntitySelector): unknown {
    const obj: any = {};
    if (message.agencyId !== undefined && message.agencyId !== "") {
      obj.agencyId = message.agencyId;
    }
    if (message.routeId !== undefined && message.routeId !== "") {
      obj.routeId = message.routeId;
    }
    if (message.routeType !== undefined && message.routeType !== 0) {
      obj.routeType = Math.round(message.routeType);
    }
    if (message.trip !== undefined) {
      obj.trip = TripDescriptor.toJSON(message.trip);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      obj.stopId = message.stopId;
    }
    if (message.directionId !== undefined && message.directionId !== 0) {
      obj.directionId = Math.round(message.directionId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EntitySelector>, I>>(base?: I): EntitySelector {
    return EntitySelector.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EntitySelector>, I>>(object: I): EntitySelector {
    const message = createBaseEntitySelector();
    message.agencyId = object.agencyId ?? "";
    message.routeId = object.routeId ?? "";
    message.routeType = object.routeType ?? 0;
    message.trip = (object.trip !== undefined && object.trip !== null)
      ? TripDescriptor.fromPartial(object.trip)
      : undefined;
    message.stopId = object.stopId ?? "";
    message.directionId = object.directionId ?? 0;
    return message;
  },
};

function createBaseTranslatedString(): TranslatedString {
  return { translation: [] };
}

export const TranslatedString = {
  encode(message: TranslatedString, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.translation) {
      TranslatedString_Translation.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TranslatedString {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTranslatedString();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.translation.push(TranslatedString_Translation.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TranslatedString {
    return {
      translation: globalThis.Array.isArray(object?.translation)
        ? object.translation.map((e: any) => TranslatedString_Translation.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TranslatedString): unknown {
    const obj: any = {};
    if (message.translation?.length) {
      obj.translation = message.translation.map((e) => TranslatedString_Translation.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TranslatedString>, I>>(base?: I): TranslatedString {
    return TranslatedString.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TranslatedString>, I>>(object: I): TranslatedString {
    const message = createBaseTranslatedString();
    message.translation = object.translation?.map((e) => TranslatedString_Translation.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTranslatedString_Translation(): TranslatedString_Translation {
  return { text: "", language: "" };
}

export const TranslatedString_Translation = {
  encode(message: TranslatedString_Translation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.text !== "") {
      writer.uint32(10).string(message.text);
    }
    if (message.language !== undefined && message.language !== "") {
      writer.uint32(18).string(message.language);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TranslatedString_Translation {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTranslatedString_Translation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.text = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.language = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TranslatedString_Translation {
    return {
      text: isSet(object.text) ? globalThis.String(object.text) : "",
      language: isSet(object.language) ? globalThis.String(object.language) : "",
    };
  },

  toJSON(message: TranslatedString_Translation): unknown {
    const obj: any = {};
    if (message.text !== "") {
      obj.text = message.text;
    }
    if (message.language !== undefined && message.language !== "") {
      obj.language = message.language;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TranslatedString_Translation>, I>>(base?: I): TranslatedString_Translation {
    return TranslatedString_Translation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TranslatedString_Translation>, I>>(object: I): TranslatedString_Translation {
    const message = createBaseTranslatedString_Translation();
    message.text = object.text ?? "";
    message.language = object.language ?? "";
    return message;
  },
};

function createBaseTranslatedImage(): TranslatedImage {
  return { localizedImage: [] };
}

export const TranslatedImage = {
  encode(message: TranslatedImage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.localizedImage) {
      TranslatedImage_LocalizedImage.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TranslatedImage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTranslatedImage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.localizedImage.push(TranslatedImage_LocalizedImage.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TranslatedImage {
    return {
      localizedImage: globalThis.Array.isArray(object?.localizedImage)
        ? object.localizedImage.map((e: any) => TranslatedImage_LocalizedImage.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TranslatedImage): unknown {
    const obj: any = {};
    if (message.localizedImage?.length) {
      obj.localizedImage = message.localizedImage.map((e) => TranslatedImage_LocalizedImage.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TranslatedImage>, I>>(base?: I): TranslatedImage {
    return TranslatedImage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TranslatedImage>, I>>(object: I): TranslatedImage {
    const message = createBaseTranslatedImage();
    message.localizedImage = object.localizedImage?.map((e) => TranslatedImage_LocalizedImage.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTranslatedImage_LocalizedImage(): TranslatedImage_LocalizedImage {
  return { url: "", mediaType: "", language: "" };
}

export const TranslatedImage_LocalizedImage = {
  encode(message: TranslatedImage_LocalizedImage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.mediaType !== "") {
      writer.uint32(18).string(message.mediaType);
    }
    if (message.language !== undefined && message.language !== "") {
      writer.uint32(26).string(message.language);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TranslatedImage_LocalizedImage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTranslatedImage_LocalizedImage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.mediaType = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.language = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TranslatedImage_LocalizedImage {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      mediaType: isSet(object.mediaType) ? globalThis.String(object.mediaType) : "",
      language: isSet(object.language) ? globalThis.String(object.language) : "",
    };
  },

  toJSON(message: TranslatedImage_LocalizedImage): unknown {
    const obj: any = {};
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.mediaType !== "") {
      obj.mediaType = message.mediaType;
    }
    if (message.language !== undefined && message.language !== "") {
      obj.language = message.language;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TranslatedImage_LocalizedImage>, I>>(base?: I): TranslatedImage_LocalizedImage {
    return TranslatedImage_LocalizedImage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TranslatedImage_LocalizedImage>, I>>(
    object: I,
  ): TranslatedImage_LocalizedImage {
    const message = createBaseTranslatedImage_LocalizedImage();
    message.url = object.url ?? "";
    message.mediaType = object.mediaType ?? "";
    message.language = object.language ?? "";
    return message;
  },
};

function createBaseShape(): Shape {
  return { shapeId: "", encodedPolyline: "" };
}

export const Shape = {
  encode(message: Shape, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.shapeId !== undefined && message.shapeId !== "") {
      writer.uint32(10).string(message.shapeId);
    }
    if (message.encodedPolyline !== undefined && message.encodedPolyline !== "") {
      writer.uint32(18).string(message.encodedPolyline);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Shape {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseShape();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.shapeId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.encodedPolyline = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Shape {
    return {
      shapeId: isSet(object.shapeId) ? globalThis.String(object.shapeId) : "",
      encodedPolyline: isSet(object.encodedPolyline) ? globalThis.String(object.encodedPolyline) : "",
    };
  },

  toJSON(message: Shape): unknown {
    const obj: any = {};
    if (message.shapeId !== undefined && message.shapeId !== "") {
      obj.shapeId = message.shapeId;
    }
    if (message.encodedPolyline !== undefined && message.encodedPolyline !== "") {
      obj.encodedPolyline = message.encodedPolyline;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Shape>, I>>(base?: I): Shape {
    return Shape.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Shape>, I>>(object: I): Shape {
    const message = createBaseShape();
    message.shapeId = object.shapeId ?? "";
    message.encodedPolyline = object.encodedPolyline ?? "";
    return message;
  },
};

function createBaseStop(): Stop {
  return {
    stopId: "",
    stopCode: undefined,
    stopName: undefined,
    ttsStopName: undefined,
    stopDesc: undefined,
    stopLat: 0,
    stopLon: 0,
    zoneId: "",
    stopUrl: undefined,
    parentStation: "",
    stopTimezone: "",
    wheelchairBoarding: 0,
    levelId: "",
    platformCode: undefined,
  };
}

export const Stop = {
  encode(message: Stop, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stopId !== undefined && message.stopId !== "") {
      writer.uint32(10).string(message.stopId);
    }
    if (message.stopCode !== undefined) {
      TranslatedString.encode(message.stopCode, writer.uint32(18).fork()).ldelim();
    }
    if (message.stopName !== undefined) {
      TranslatedString.encode(message.stopName, writer.uint32(26).fork()).ldelim();
    }
    if (message.ttsStopName !== undefined) {
      TranslatedString.encode(message.ttsStopName, writer.uint32(34).fork()).ldelim();
    }
    if (message.stopDesc !== undefined) {
      TranslatedString.encode(message.stopDesc, writer.uint32(42).fork()).ldelim();
    }
    if (message.stopLat !== undefined && message.stopLat !== 0) {
      writer.uint32(53).float(message.stopLat);
    }
    if (message.stopLon !== undefined && message.stopLon !== 0) {
      writer.uint32(61).float(message.stopLon);
    }
    if (message.zoneId !== undefined && message.zoneId !== "") {
      writer.uint32(66).string(message.zoneId);
    }
    if (message.stopUrl !== undefined) {
      TranslatedString.encode(message.stopUrl, writer.uint32(74).fork()).ldelim();
    }
    if (message.parentStation !== undefined && message.parentStation !== "") {
      writer.uint32(90).string(message.parentStation);
    }
    if (message.stopTimezone !== undefined && message.stopTimezone !== "") {
      writer.uint32(98).string(message.stopTimezone);
    }
    if (message.wheelchairBoarding !== undefined && message.wheelchairBoarding !== 0) {
      writer.uint32(104).int32(message.wheelchairBoarding);
    }
    if (message.levelId !== undefined && message.levelId !== "") {
      writer.uint32(114).string(message.levelId);
    }
    if (message.platformCode !== undefined) {
      TranslatedString.encode(message.platformCode, writer.uint32(122).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Stop {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStop();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.stopId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.stopCode = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.stopName = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.ttsStopName = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.stopDesc = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }

          message.stopLat = reader.float();
          continue;
        case 7:
          if (tag !== 61) {
            break;
          }

          message.stopLon = reader.float();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.zoneId = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.stopUrl = TranslatedString.decode(reader, reader.uint32());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.parentStation = reader.string();
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.stopTimezone = reader.string();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.wheelchairBoarding = reader.int32() as any;
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.levelId = reader.string();
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.platformCode = TranslatedString.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Stop {
    return {
      stopId: isSet(object.stopId) ? globalThis.String(object.stopId) : "",
      stopCode: isSet(object.stopCode) ? TranslatedString.fromJSON(object.stopCode) : undefined,
      stopName: isSet(object.stopName) ? TranslatedString.fromJSON(object.stopName) : undefined,
      ttsStopName: isSet(object.ttsStopName) ? TranslatedString.fromJSON(object.ttsStopName) : undefined,
      stopDesc: isSet(object.stopDesc) ? TranslatedString.fromJSON(object.stopDesc) : undefined,
      stopLat: isSet(object.stopLat) ? globalThis.Number(object.stopLat) : 0,
      stopLon: isSet(object.stopLon) ? globalThis.Number(object.stopLon) : 0,
      zoneId: isSet(object.zoneId) ? globalThis.String(object.zoneId) : "",
      stopUrl: isSet(object.stopUrl) ? TranslatedString.fromJSON(object.stopUrl) : undefined,
      parentStation: isSet(object.parentStation) ? globalThis.String(object.parentStation) : "",
      stopTimezone: isSet(object.stopTimezone) ? globalThis.String(object.stopTimezone) : "",
      wheelchairBoarding: isSet(object.wheelchairBoarding)
        ? stop_WheelchairBoardingFromJSON(object.wheelchairBoarding)
        : 0,
      levelId: isSet(object.levelId) ? globalThis.String(object.levelId) : "",
      platformCode: isSet(object.platformCode) ? TranslatedString.fromJSON(object.platformCode) : undefined,
    };
  },

  toJSON(message: Stop): unknown {
    const obj: any = {};
    if (message.stopId !== undefined && message.stopId !== "") {
      obj.stopId = message.stopId;
    }
    if (message.stopCode !== undefined) {
      obj.stopCode = TranslatedString.toJSON(message.stopCode);
    }
    if (message.stopName !== undefined) {
      obj.stopName = TranslatedString.toJSON(message.stopName);
    }
    if (message.ttsStopName !== undefined) {
      obj.ttsStopName = TranslatedString.toJSON(message.ttsStopName);
    }
    if (message.stopDesc !== undefined) {
      obj.stopDesc = TranslatedString.toJSON(message.stopDesc);
    }
    if (message.stopLat !== undefined && message.stopLat !== 0) {
      obj.stopLat = message.stopLat;
    }
    if (message.stopLon !== undefined && message.stopLon !== 0) {
      obj.stopLon = message.stopLon;
    }
    if (message.zoneId !== undefined && message.zoneId !== "") {
      obj.zoneId = message.zoneId;
    }
    if (message.stopUrl !== undefined) {
      obj.stopUrl = TranslatedString.toJSON(message.stopUrl);
    }
    if (message.parentStation !== undefined && message.parentStation !== "") {
      obj.parentStation = message.parentStation;
    }
    if (message.stopTimezone !== undefined && message.stopTimezone !== "") {
      obj.stopTimezone = message.stopTimezone;
    }
    if (message.wheelchairBoarding !== undefined && message.wheelchairBoarding !== 0) {
      obj.wheelchairBoarding = stop_WheelchairBoardingToJSON(message.wheelchairBoarding);
    }
    if (message.levelId !== undefined && message.levelId !== "") {
      obj.levelId = message.levelId;
    }
    if (message.platformCode !== undefined) {
      obj.platformCode = TranslatedString.toJSON(message.platformCode);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Stop>, I>>(base?: I): Stop {
    return Stop.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Stop>, I>>(object: I): Stop {
    const message = createBaseStop();
    message.stopId = object.stopId ?? "";
    message.stopCode = (object.stopCode !== undefined && object.stopCode !== null)
      ? TranslatedString.fromPartial(object.stopCode)
      : undefined;
    message.stopName = (object.stopName !== undefined && object.stopName !== null)
      ? TranslatedString.fromPartial(object.stopName)
      : undefined;
    message.ttsStopName = (object.ttsStopName !== undefined && object.ttsStopName !== null)
      ? TranslatedString.fromPartial(object.ttsStopName)
      : undefined;
    message.stopDesc = (object.stopDesc !== undefined && object.stopDesc !== null)
      ? TranslatedString.fromPartial(object.stopDesc)
      : undefined;
    message.stopLat = object.stopLat ?? 0;
    message.stopLon = object.stopLon ?? 0;
    message.zoneId = object.zoneId ?? "";
    message.stopUrl = (object.stopUrl !== undefined && object.stopUrl !== null)
      ? TranslatedString.fromPartial(object.stopUrl)
      : undefined;
    message.parentStation = object.parentStation ?? "";
    message.stopTimezone = object.stopTimezone ?? "";
    message.wheelchairBoarding = object.wheelchairBoarding ?? 0;
    message.levelId = object.levelId ?? "";
    message.platformCode = (object.platformCode !== undefined && object.platformCode !== null)
      ? TranslatedString.fromPartial(object.platformCode)
      : undefined;
    return message;
  },
};

function createBaseTripModifications(): TripModifications {
  return { selectedTrips: [], startTimes: [], serviceDates: [], modifications: [] };
}

export const TripModifications = {
  encode(message: TripModifications, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.selectedTrips) {
      TripModifications_SelectedTrips.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.startTimes) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.serviceDates) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.modifications) {
      TripModifications_Modification.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripModifications {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripModifications();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.selectedTrips.push(TripModifications_SelectedTrips.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.startTimes.push(reader.string());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.serviceDates.push(reader.string());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.modifications.push(TripModifications_Modification.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripModifications {
    return {
      selectedTrips: globalThis.Array.isArray(object?.selectedTrips)
        ? object.selectedTrips.map((e: any) => TripModifications_SelectedTrips.fromJSON(e))
        : [],
      startTimes: globalThis.Array.isArray(object?.startTimes)
        ? object.startTimes.map((e: any) => globalThis.String(e))
        : [],
      serviceDates: globalThis.Array.isArray(object?.serviceDates)
        ? object.serviceDates.map((e: any) => globalThis.String(e))
        : [],
      modifications: globalThis.Array.isArray(object?.modifications)
        ? object.modifications.map((e: any) => TripModifications_Modification.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TripModifications): unknown {
    const obj: any = {};
    if (message.selectedTrips?.length) {
      obj.selectedTrips = message.selectedTrips.map((e) => TripModifications_SelectedTrips.toJSON(e));
    }
    if (message.startTimes?.length) {
      obj.startTimes = message.startTimes;
    }
    if (message.serviceDates?.length) {
      obj.serviceDates = message.serviceDates;
    }
    if (message.modifications?.length) {
      obj.modifications = message.modifications.map((e) => TripModifications_Modification.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripModifications>, I>>(base?: I): TripModifications {
    return TripModifications.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripModifications>, I>>(object: I): TripModifications {
    const message = createBaseTripModifications();
    message.selectedTrips = object.selectedTrips?.map((e) => TripModifications_SelectedTrips.fromPartial(e)) || [];
    message.startTimes = object.startTimes?.map((e) => e) || [];
    message.serviceDates = object.serviceDates?.map((e) => e) || [];
    message.modifications = object.modifications?.map((e) => TripModifications_Modification.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTripModifications_Modification(): TripModifications_Modification {
  return {
    startStopSelector: undefined,
    endStopSelector: undefined,
    propagatedModificationDelay: 0,
    replacementStops: [],
    serviceAlertId: "",
    lastModifiedTime: 0,
  };
}

export const TripModifications_Modification = {
  encode(message: TripModifications_Modification, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.startStopSelector !== undefined) {
      StopSelector.encode(message.startStopSelector, writer.uint32(10).fork()).ldelim();
    }
    if (message.endStopSelector !== undefined) {
      StopSelector.encode(message.endStopSelector, writer.uint32(18).fork()).ldelim();
    }
    if (message.propagatedModificationDelay !== undefined && message.propagatedModificationDelay !== 0) {
      writer.uint32(24).int32(message.propagatedModificationDelay);
    }
    for (const v of message.replacementStops) {
      ReplacementStop.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.serviceAlertId !== undefined && message.serviceAlertId !== "") {
      writer.uint32(42).string(message.serviceAlertId);
    }
    if (message.lastModifiedTime !== undefined && message.lastModifiedTime !== 0) {
      writer.uint32(48).uint64(message.lastModifiedTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripModifications_Modification {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripModifications_Modification();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.startStopSelector = StopSelector.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.endStopSelector = StopSelector.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.propagatedModificationDelay = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.replacementStops.push(ReplacementStop.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.serviceAlertId = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.lastModifiedTime = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripModifications_Modification {
    return {
      startStopSelector: isSet(object.startStopSelector) ? StopSelector.fromJSON(object.startStopSelector) : undefined,
      endStopSelector: isSet(object.endStopSelector) ? StopSelector.fromJSON(object.endStopSelector) : undefined,
      propagatedModificationDelay: isSet(object.propagatedModificationDelay)
        ? globalThis.Number(object.propagatedModificationDelay)
        : 0,
      replacementStops: globalThis.Array.isArray(object?.replacementStops)
        ? object.replacementStops.map((e: any) => ReplacementStop.fromJSON(e))
        : [],
      serviceAlertId: isSet(object.serviceAlertId) ? globalThis.String(object.serviceAlertId) : "",
      lastModifiedTime: isSet(object.lastModifiedTime) ? globalThis.Number(object.lastModifiedTime) : 0,
    };
  },

  toJSON(message: TripModifications_Modification): unknown {
    const obj: any = {};
    if (message.startStopSelector !== undefined) {
      obj.startStopSelector = StopSelector.toJSON(message.startStopSelector);
    }
    if (message.endStopSelector !== undefined) {
      obj.endStopSelector = StopSelector.toJSON(message.endStopSelector);
    }
    if (message.propagatedModificationDelay !== undefined && message.propagatedModificationDelay !== 0) {
      obj.propagatedModificationDelay = Math.round(message.propagatedModificationDelay);
    }
    if (message.replacementStops?.length) {
      obj.replacementStops = message.replacementStops.map((e) => ReplacementStop.toJSON(e));
    }
    if (message.serviceAlertId !== undefined && message.serviceAlertId !== "") {
      obj.serviceAlertId = message.serviceAlertId;
    }
    if (message.lastModifiedTime !== undefined && message.lastModifiedTime !== 0) {
      obj.lastModifiedTime = Math.round(message.lastModifiedTime);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripModifications_Modification>, I>>(base?: I): TripModifications_Modification {
    return TripModifications_Modification.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripModifications_Modification>, I>>(
    object: I,
  ): TripModifications_Modification {
    const message = createBaseTripModifications_Modification();
    message.startStopSelector = (object.startStopSelector !== undefined && object.startStopSelector !== null)
      ? StopSelector.fromPartial(object.startStopSelector)
      : undefined;
    message.endStopSelector = (object.endStopSelector !== undefined && object.endStopSelector !== null)
      ? StopSelector.fromPartial(object.endStopSelector)
      : undefined;
    message.propagatedModificationDelay = object.propagatedModificationDelay ?? 0;
    message.replacementStops = object.replacementStops?.map((e) => ReplacementStop.fromPartial(e)) || [];
    message.serviceAlertId = object.serviceAlertId ?? "";
    message.lastModifiedTime = object.lastModifiedTime ?? 0;
    return message;
  },
};

function createBaseTripModifications_SelectedTrips(): TripModifications_SelectedTrips {
  return { tripIds: [], shapeId: "" };
}

export const TripModifications_SelectedTrips = {
  encode(message: TripModifications_SelectedTrips, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.tripIds) {
      writer.uint32(10).string(v!);
    }
    if (message.shapeId !== undefined && message.shapeId !== "") {
      writer.uint32(18).string(message.shapeId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TripModifications_SelectedTrips {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTripModifications_SelectedTrips();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tripIds.push(reader.string());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.shapeId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TripModifications_SelectedTrips {
    return {
      tripIds: globalThis.Array.isArray(object?.tripIds) ? object.tripIds.map((e: any) => globalThis.String(e)) : [],
      shapeId: isSet(object.shapeId) ? globalThis.String(object.shapeId) : "",
    };
  },

  toJSON(message: TripModifications_SelectedTrips): unknown {
    const obj: any = {};
    if (message.tripIds?.length) {
      obj.tripIds = message.tripIds;
    }
    if (message.shapeId !== undefined && message.shapeId !== "") {
      obj.shapeId = message.shapeId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TripModifications_SelectedTrips>, I>>(base?: I): TripModifications_SelectedTrips {
    return TripModifications_SelectedTrips.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TripModifications_SelectedTrips>, I>>(
    object: I,
  ): TripModifications_SelectedTrips {
    const message = createBaseTripModifications_SelectedTrips();
    message.tripIds = object.tripIds?.map((e) => e) || [];
    message.shapeId = object.shapeId ?? "";
    return message;
  },
};

function createBaseStopSelector(): StopSelector {
  return { stopSequence: 0, stopId: "" };
}

export const StopSelector = {
  encode(message: StopSelector, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stopSequence !== undefined && message.stopSequence !== 0) {
      writer.uint32(8).uint32(message.stopSequence);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      writer.uint32(18).string(message.stopId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StopSelector {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStopSelector();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.stopSequence = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.stopId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StopSelector {
    return {
      stopSequence: isSet(object.stopSequence) ? globalThis.Number(object.stopSequence) : 0,
      stopId: isSet(object.stopId) ? globalThis.String(object.stopId) : "",
    };
  },

  toJSON(message: StopSelector): unknown {
    const obj: any = {};
    if (message.stopSequence !== undefined && message.stopSequence !== 0) {
      obj.stopSequence = Math.round(message.stopSequence);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      obj.stopId = message.stopId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StopSelector>, I>>(base?: I): StopSelector {
    return StopSelector.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StopSelector>, I>>(object: I): StopSelector {
    const message = createBaseStopSelector();
    message.stopSequence = object.stopSequence ?? 0;
    message.stopId = object.stopId ?? "";
    return message;
  },
};

function createBaseReplacementStop(): ReplacementStop {
  return { travelTimeToStop: 0, stopId: "" };
}

export const ReplacementStop = {
  encode(message: ReplacementStop, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.travelTimeToStop !== undefined && message.travelTimeToStop !== 0) {
      writer.uint32(8).int32(message.travelTimeToStop);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      writer.uint32(18).string(message.stopId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplacementStop {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplacementStop();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.travelTimeToStop = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.stopId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReplacementStop {
    return {
      travelTimeToStop: isSet(object.travelTimeToStop) ? globalThis.Number(object.travelTimeToStop) : 0,
      stopId: isSet(object.stopId) ? globalThis.String(object.stopId) : "",
    };
  },

  toJSON(message: ReplacementStop): unknown {
    const obj: any = {};
    if (message.travelTimeToStop !== undefined && message.travelTimeToStop !== 0) {
      obj.travelTimeToStop = Math.round(message.travelTimeToStop);
    }
    if (message.stopId !== undefined && message.stopId !== "") {
      obj.stopId = message.stopId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ReplacementStop>, I>>(base?: I): ReplacementStop {
    return ReplacementStop.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReplacementStop>, I>>(object: I): ReplacementStop {
    const message = createBaseReplacementStop();
    message.travelTimeToStop = object.travelTimeToStop ?? 0;
    message.stopId = object.stopId ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
